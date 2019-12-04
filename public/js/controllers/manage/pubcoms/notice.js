app.controller('noticeCtrl', ['$scope', '$modalInstance', 'items', '$compile', '$http', '$modal', function ($scope, $modalInstance, items, $compile, $http, $modal) {
    console.log(items);
    $scope.addNotice = items;
    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };

    function getBranch() {
        $http.get('/notice/select_bran?user_id=' + $scope.addNotice.user_id).then(function (req) {
            console.log(req.data);
            $scope.noticeTree = req.data;
        })
    }

    getBranch();
    $scope.save = function () {
        console.log($scope.addNotice)
        if ($scope.addNotice.theme == '' || $scope.addNotice.content == '') {
            alert("标题、内容不能为空");
            return false;
        }
        $scope.addNotice.branch_arr = [];
        getBranchArr($scope.noticeTree);
        console.log($scope.addNotice.branch_arr)
        let fd = new FormData();
        let upload_file = document.getElementById("noticeFile").files[0];
        fd.append('file', upload_file);
        fd.append('theme', $scope.addNotice.theme);
        fd.append('content', $scope.addNotice.content);
        fd.append('branch_arr', $scope.addNotice.branch_arr);
        fd.append('F_branch_id', $scope.addNotice.branch_id);
        fd.append('creation_time', $scope.addNotice.creation_time);
        $http.post('/notice/insert_notice', fd, {
            headers: {'Content-Type': undefined},
            transformRequest: angular.identity
        }).then(function (req) {
            if (req.data == 1) {
                $modalInstance.close();
            }
        });

    };

    function getBranchArr(data) {
        for (var i in data) {
            if (data[i].$$isChecked == true) {
                $scope.addNotice.branch_arr.push(data[i].id);
            }
            getBranchArr(data[i].children);
        }
    }
}]);
app.controller('noticeContentCtrl', ['$scope', '$modalInstance', 'items', '$compile', '$http', '$modal', function ($scope, $modalInstance, items, $compile, $http, $modal) {
    console.log(items);
    $scope.content = items;
    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    }
}]);

app.controller('managePublicNotice_controller', ['$scope', '$http', '$modal', '$filter', function ($scope, $http, $modal, $filter) {
    var vm = this;

    $scope.noticeModal = function () {
        let obj = {
            branch_id: branch_id,
            theme: '',
            content: '',
            creation_time: (new Date()).Format("yyyy-MM-dd hh:mm:ss"),
            branch_arr: [],
            user_id: $scope.app.globalInfo.userid,

        };
        var modalInstance = $modal.open({
            templateUrl: 'noticeTpl.html',
            controller: 'noticeCtrl',
            size: '',
            resolve: {
                items: function () {
                    return obj;
                }

            }
        });

        modalInstance.result.then(function () {
            manageNotice();
        }, function () {

        });
    };

    let userType = JSON.parse(sessionStorage.getItem('msg')).usertype;
    let branch_id = JSON.parse(sessionStorage.getItem('msg')).branch_id;

    if (userType == "0" || userType == "1") {
        manageNotice()
    } else {
        branchNotice()
    }

    [$scope.noticeData, $scope.totalItems, $scope.noticeNow] = [[], [], []];
    [$scope.currentPage, $scope.itemsPerPage, $scope.maxSize] = [1, 12, 3];

    function manageNotice() {
        $http.get('/notice/select_notice?branch_id=' + branch_id+'&uid='+$scope.app.globalInfo.userid).then(function (req) {
            console.log(req.data);
            $scope.noticeData = req.data;
            $scope.filterData = angular.copy($scope.noticeData);
            $scope.totalItems = $scope.filterData.length;
            getCurrentTimes($scope.filterData);
        })
    }

    function branchNotice() {
        $http.get('/notice/select_branch_notice?branch_id=' + branch_id+'&uid='+$scope.app.globalInfo.userid).then(function (req) {
            console.log(req.data);
            $scope.noticeData = req.data;
            $scope.filterData = angular.copy($scope.noticeData);
            $scope.totalItems = $scope.filterData.length;
            getCurrentTimes($scope.filterData);
        })
    }

    // 返回当前页对应的数据
    function getCurrentTimes(data) {
        var start = ($scope.currentPage - 1) * $scope.itemsPerPage;
        $scope.noticeNow = data.slice(start, start + $scope.itemsPerPage);
    }

    // 切换分页
    $scope.changePage = function () {
        getCurrentTimes($scope.filterData);
    };

    $scope.showContent = function (x) {
        var modalInstance = $modal.open({
            templateUrl: 'noticeContent.html',
            controller: 'noticeContentCtrl',
            size: '',
            resolve: {
                items: function () {
                    return $scope.noticeNow[x].content;
                }

            }
        });

        modalInstance.result.then(function () {
        }, function () {
            if ($scope.noticeNow[x].staten == "未读") {
                $http.get('/notice/update_notice_state?notice_id=' + $scope.noticeNow[x].notice_id).then(function (req) {
                    if (req.data == 1) {
                        branchNotice()
                    }
                })
            }
        });
    };
    Date.prototype.Format = function (fmt) { // author: meizz
        var o = {
            "M+": this.getMonth() + 1, // 月份
            "d+": this.getDate(), // 日
            "h+": this.getHours(), // 小时
            "m+": this.getMinutes(), // 分
            "s+": this.getSeconds(), // 秒
            "q+": Math.floor((this.getMonth() + 3) / 3), // 季度
            "S": this.getMilliseconds() // 毫秒
        };
        if (/(y+)/.test(fmt))
            fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
        for (var k in o)
            if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
        return fmt;
    };
    $scope.deleteNotice =async function (item) {
        if (confirm("确定删除该公告吗")) {
            if (userType == "0" || userType == "1") {
                $http.get('/notice/delete1_notice?noticeid='+item.notice_id + '&userid='+$scope.app.globalInfo.userid).then(function (response) {
                    if (response.data == 1) {
                        alert('删除成功')
                        manageNotice()
                    }else {
                        alert('删除失败')
                    }
                   
                })
                
            } else {
                $http.get('/notice/delete_notice?noticeid='+item.notice_id + '&userid='+$scope.app.globalInfo.userid).then(function (response) {
                    if (response.data == 1) {
                        alert('删除成功')
                        branchNotice()
                    }else {
                        alert('删除失败')
                    }
                   
                })
               
            }
                
        }
    };
    $scope.filterType = "";
    $scope.changeType = function () {
        [$scope.currentPage, $scope.itemsPerPage, $scope.maxSize] = [1, 12, 3];
        $scope.filterData = [];
        if ($scope.filterType == "") {
            $scope.filterData = angular.copy($scope.noticeData)
        } else {
            for (let i = 0; i < $scope.noticeData.length; i++) {
                if ($scope.noticeData[i].type == $scope.filterType) {
                    $scope.filterData.push($scope.noticeData[i])
                }
            }
        }
        $scope.totalItems = $scope.filterData.length;
        getCurrentTimes($scope.filterData);


    }

}]);
app.filter('textLengthSet', function () {
    return function (value, wordwise, max, tail) {
        if (!value) return '';

        max = parseInt(max, 10);
        if (!max) return value;
        if (value.length <= max) return value;

        value = value.substr(0, max);
        if (wordwise) {
            var lastspace = value.lastIndexOf(' ');
            if (lastspace != -1) {
                value = value.substr(0, lastspace);
            }
        }

        return value + (tail || ' …');//'...'可以换成其它文字
    };
});
app.directive('treeView', [function () {

    return {
        restrict: 'E',
        templateUrl: '/treeView.html',
        scope: {
            treeData: '=',
            canChecked: '=',
            textField: '@',
            itemClicked: '&',
            itemCheckedChanged: '&',
            itemTemplateUrl: '@'
        },
        controller: ['$scope', function ($scope) {
            $scope.itemExpended = function (item, $event) {
                item.$$isExpend = !item.$$isExpend;
                $event.stopPropagation();
            };

            $scope.getItemIcon = function (item) {
                var isLeaf = $scope.isLeaf(item);

                if (isLeaf) {
                    return 'fa  fa-folder-o';
                }

                return item.$$isExpend ? 'fa fa-minus' : 'fa fa-plus';
            };

            $scope.isLeaf = function (item) {
                return !item.children || !item.children.length;
            };

            $scope.chk = function (callback, item) {
                var itemId = item.id;

            };

            $scope.warpCallback = function (callback, item, $event) {
                ($scope[callback] || angular.noop)({
                    $item: item,
                    $event: $event
                });
            };
        }]
    };
}]);