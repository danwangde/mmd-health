'use strict';
app.controller('ModalInstanceCtrl', ['$scope', '$modalInstance', 'items', '$http', function ($scope, $modalInstance, items, $http) {
    $scope.branchInfo = items;
    console.log($scope.branchInfo)
    let checkSubmitFlg = false;
    $scope.saveBranch = function () {
        console.log($scope.branchInfo)
        if (checkSubmitFlg == true) {
            return false;
        }
       checkSubmitFlg = true;
        if ($scope.branchInfo.title == '新建部门') {
            $http.get('/branch/insert_branch?branch=' + $scope.branchInfo.branch + '&id=' + $scope.branchInfo.id + '&branch_type=' + $scope.branchInfo.branch_type).then(function (req) {
                checkSubmitFlg = false;
                if (req.data == 1) {
                    $modalInstance.close();
                    alert('新建成功')
                } else {
                    alert('新建失败')
                }
            })
        }
        else if ($scope.branchInfo.title == '修改部门') {
            $http.post('/branch/update_branch', $scope.branchInfo).then(function (req) {
                checkSubmitFlg = false;
                if (req.data == 1) {
                    $modalInstance.close();
                    alert('修改成功')
                } else {
                    alert('修改失败')
                }
            })
        }
    };
    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    }


}]);
app.controller('managePublicOffice_controller', function ($scope, $modal, $http, $window) {
    $scope.userType = JSON.parse(sessionStorage.getItem('msg')).usertype;
    function getBranch() {
        let url = '/branch/select_branch_all?branch_id=' + JSON.parse(sessionStorage.getItem('msg')).branch_id;
        console.log(url);
        $http.get(url).then(function (req) {
            $scope.sysOffice = req.data;
            console.log($scope.sysOffice);
            let arr = [];
            arr.push($scope.sysOffice[0])
            for (let item of  $scope.sysOffice ) {
                for (let i of $scope.sysOffice) {
                    if(item.id == i.parent_id) {
                        
                        
                    }
                }
            }
        })
    }

    getBranch();

    $scope.$on('ngRepeatFinished', function () {//监听事件
        $("#treetable").treetable({
            expandable: true,// 展示
            initialState: "expanded",//默认打开所有节点ngRepeatFinished
            stringCollapse: '关闭',
            stringExpand: '展开',
            /*onNodeExpand: function () {// 分支展开后的回调函数
                var node = this;        //判断当前节点是否已经拥有子节点
                console.log(node)
                var childSize = $("#treetable").find("[data-tt-parent-id='" + node.id + "']").length;
                if (childSize > 0) {
                    return;
                }
                var data = "pageId=" + node.id;         // Render loader/spinner while loading 加载时渲染
                console.log(data)

                $.ajax({
                    loading: false, sync: false,// Must be false, otherwise loadBranch happens after showChildren?

//                    url: context + "/document/loadChild.json",
                    data: data,
                    success: function (result) {
                        if (0 == result.code) {
                            if (!com.isNull(result.body)) {
                                if (0 == eval(result.body['chilPages']).length) {//不存在子节点

                                    var $tr = $("#treetable").find("[data-tt-id='" + node.id + "']");
                                    $tr.attr("data-tt-branch", "false");// data-tt-branch 标记当前节点是否是分支节点，在树被初始化的时候生效

                                    $tr.find("span.indenter").html("");// 移除展开图标

                                    return;
                                }
                                var rows = this.getnereateHtml(result.body['chilPages']);
                                $("#treetable").treetable("loadBranch", node, rows);// 插入子节点

                                $("#treetable").treetable("expandNode", node.id);// 展开子节点

                            }
                        } else {
                            alert(result.tip);
                        }
                    }
                });
            }*/
        });
    });
    $scope.addBranch = function (x) {
        let branchObj = {
            branch: '',
            branch_type: '',
            title: '新建部门',
            id: x.id,
            usertype: JSON.parse(sessionStorage.getItem('msg')).usertype
        };

        var modalInstance = $modal.open({
            templateUrl: 'myModalContent.html',
            controller: 'ModalInstanceCtrl',
            size: '',
            backdrop: 'static',      
	        keyboard: false,
            resolve: {
                items: function () {
                    return branchObj;
                }
            }
        });

        modalInstance.result.then(function () {
            $window.location.reload();
        }, function () {
        });
    };
    $scope.updBranch = function (x) {
        x.title = '修改部门';
        x.usertype = JSON.parse(sessionStorage.getItem('msg')).usertype;
        var modalInstance = $modal.open({
            templateUrl: 'myModalContent.html',
            controller: 'ModalInstanceCtrl',
            size: '',
            backdrop: 'static',      
	        keyboard: false,
            resolve: {
                items: function () {
                    return x;
                }
            }
        });

        modalInstance.result.then(function () {
            $window.location.reload();
        }, function () {
        });
    };
    $scope.delBranch = function (x) {
        if (confirm("你确认要删除吗？")) {
            $http.get('/branch/delete_branch?branch_id=' + x.id).then(function (req) {
                $window.location.reload();
            })
        }
    }
});
app.directive('onFinishRenderFilters', function ($timeout) {
    return {
        restrict: 'A',
        link: function (scope, element, attr) {
            if (scope.$last === true) {
                $timeout(function () {
                    scope.$emit('ngRepeatFinished')
                });
            }

        }
    };
});


