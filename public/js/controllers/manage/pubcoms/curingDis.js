app.controller('manageCuringDis_controller', ['$scope', '$http', '$modal', '$log', '$filter','$window', function ($scope, $http, $modal, $log, $filter, $window) {
    $scope.addData = {
        disease_name: '',
        unit: '',
        material: '',
        Solution_Tips: '',
        Plate_thickness: '',
        structure: '',
        uid: $scope.app.globalInfo.userid
    };
    $scope.addCuring = function (item) {
        console.log(item)
        if (item.disease_name == '') {
            $scope.num = 'insert'
        } else {
            $scope.num = 'update'
        };
        let modalInstance = $modal.open({
            templateUrl: 'addCuringDis.html',
            controller: 'addCuringDisCtrl',
            size: '',
            backdrop: 'static',
	        keyboard: false,
            resolve: {
                data: function () {
                    return {
                        value: item,
                        num: $scope.num
                    }
                }
            }
        });

        modalInstance.result.then(function (SuperStructure) {
            getPrice();
            window.location.reload();
            $scope.addData = {
                disease_name: '',
                unit: '',
                material: '',
                Solution_Tips: '',
                Plate_thickness: '',
                structure: '',
                uid: $scope.app.globalInfo.userid
            };
        }, function () {

        });
    };

    $scope.addBranch = function (data,item) {
        console.log(item)
        if (data.disease_name == '') {
            $scope.num = 'insert'
        } else {
            $scope.num = 'update'
        };
        let modalInstance = $modal.open({
            templateUrl: 'addCuringDis.html',
            controller: 'addCuringDisCtrl',
            size: '',
            backdrop: 'static',
	        keyboard: false,
            resolve: {
                data: function () {
                    return {
                        value: data,
                        item:item,
                        num: $scope.num
                    }
                }
            }
        });

        modalInstance.result.then(function (SuperStructure) {


            $scope.addData = {
                disease_name: '',
                unit: '',
                material: '',
                Solution_Tips: '',
                Plate_thickness: '',
                structure: '',
                uid: $scope.app.globalInfo.userid
            };
        }, function () {

        });
    }
    $scope.deleteCuring = async function (item) {
        if (confirm('确认删除该记录吗?')) {
            let delUrl = '/curing/delete_dis?id=' + item.id;
        let res = await $http.get(delUrl);
        if (res.data == 1) {
            alert('删除成功');

        } else {
            alert('删除失败');
        };
        window.location.reload();
        }

    }
    $scope.userid = $scope.app.globalInfo.userid;



    [$scope.DisData, $scope.totalItems, $scope.DisDataNow] = [[], [], []];
    [$scope.currentPage, $scope.itemsPerPage, $scope.maxSize] = [1, 12, 3];

    async function getPrice() {
        let getPriceUrl = '/curing/select_dis?uid='+$scope.app.globalInfo.userid;
        let res = await $http.get(getPriceUrl);
        $scope.$apply(function () {
            console.log(res.data)
            $scope.DisData = res.data;
            [...$scope.DisDataNow] = $scope.DisData;
            $scope.totalItems = $scope.DisData.length;
            getCurrentTimes();
        })
    };
    getPrice();


    $scope.$on('ngRepeatFinished', function () {//监听事件
        $("#treetable1").treetable({
            expandable: true,// 展示
            initialState: "expanded",//默认打开所有节点ngRepeatFinished
            stringCollapse: '关闭',
            stringExpand: '展开',
            onNodeExpand: function () {// 分支展开后的回调函数
                var node = this;        //判断当前节点是否已经拥有子节点
                console.log(node)
                var childSize = $("#treetable1").find("[data-tt-parent-id='" + node.id + "']").length;
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

                                    var $tr = $("#treetable1").find("[data-tt-id='" + node.id + "']");
                                    $tr.attr("data-tt-branch", "false");// data-tt-branch 标记当前节点是否是分支节点，在树被初始化的时候生效

                                    $tr.find("span.indenter").html("");// 移除展开图标

                                    return;
                                }
                                var rows = this.getnereateHtml(result.body['chilPages']);
                                $("#treetable1").treetable("loadBranch", node, rows);// 插入子节点

                                $("#treetable1").treetable("expandNode", node.id);// 展开子节点

                            }
                        } else {
                            alert(result.tip);
                        }
                    }
                });
            }
        });
    });
    $scope.search = function () {
        console.log(1)
        $scope.DisDataNow = $filter('curingDis')($scope.DisData, $scope.project);
    };

    // 返回当前页对应的数据
    function getCurrentTimes() {

        var start = ($scope.currentPage - 1) * $scope.itemsPerPage;
        $scope.DisDataNow = $scope.DisData.slice(start, start + $scope.itemsPerPage);
        console.log($scope.DisDataNow)
    }

    // 切换分页
    $scope.changePage = function () {
        getCurrentTimes();
    };

}]);

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

app.controller('addCuringDisCtrl', ['$scope', '$http', '$modalInstance', 'data', function ($scope, $http, $modalInstance, data) {
    console.log(data);
    $scope.addData = data.value;
    if (data.num == 'insert') {
       /* console.log( $scope.addData);
        if (data.hasOwnProperty('id')) {
            $scope.addData.id = data.pid;
        }else {
            $scope.addData.id = 0;
        }*/

        $scope.title = '新增病害';
        $scope.savePrice = async function () {
            $scope.addData.pid = data.item.pid;
            let addCuringUrl = '/curing/insert_dis';
            let res = await $http.post(addCuringUrl,$scope.addData);
            if (res.data == 1) {
                alert('新增成功');
                $modalInstance.close();
            } else {
                alert('新增失败');
            }
            window.location.reload()
        }
    } else {
        $scope.title = '修改病害';
        $scope.savePrice = async function (item) {
            let updateCuringUrl = '/curing/update_dis';
            let res = await $http.post(updateCuringUrl, $scope.addData);
            if (res.data == 1) {
                alert('修改成功');
                $modalInstance.close();
            } else {
                alert('修改失败');
            }
        }
    };

    $scope.cancel = function() {
        $modalInstance.dismiss();
    }


}]);
