'use strict';
app.controller('roleModalCtrl', ['$scope', '$modalInstance', 'items', function ($scope, $modalInstance, items) {
    console.log(123)
    $scope.treeData = [
        {
            id: "1",
            fatherId: "0000",
            name: "子系统",
            checked: true,
            childItems: [
                {
                    id: "11",
                    fatherId: "1",
                    name: "数据总览",
                    checked: true,
                    childItems: []
                },
                {
                    id: "12",
                    fatherId:
                        "1",
                    name:
                        "城市桥梁",
                    checked:
                        false,
                    childItems:
                        [{
                            id: "121",
                            fatherId:
                                "12",
                            name:
                                "首页",
                            checked:
                                true,
                            childItems:
                                []

                        }]
                },
                {
                    id: "13",
                    fatherId:
                        "1",
                    name:
                        "市政道路",
                    checked:
                        false,
                    childItems:
                        []
                },
                {
                    id: "14",
                    fatherId:
                        "1",
                    name:
                        "城市隧道",
                    checked:
                        false,
                    childItems:
                        []
                }
            ]
        }, {
            id: "2",
            fatherId: "0000",
            name: "公共模块",
            checked: true,
            childItems: []
        }, {
            id: "3",
            fatherId: "0000",
            name: "验收模块",
            checked: true,
            childItems: []
        }, {
            id: "4",
            fatherId: "0000",
            name: "检测平台",
            checked: true,
            childItems: []
        }, {
            id: "5",
            fatherId: "0000",
            name: "电子地图",
            checked: true,
            childItems: []
        }];
    $scope.ok = function () {

    }
}]);
app.directive('treeView', [function () {
    return {
        restrict: 'E',
        templateUrl: './tpl/modal/treeView.html',
        scope: {
            treeData: '=',
        }
    };
}]);
app.controller('managePublicRole_controller', function ($scope, $modal) {
    $scope.sysRole = [
        {name: '区级管理部门', ename: "countrymanager", OFFICE_ID: "山东省住房和城乡建设厅", type: '管理'},
        {name: '市级管理部门', ename: "citymanager", OFFICE_ID: "山东省住房和城乡建设厅", type: '检测'},
        {name: '省厅浏览角色', ename: "jst", OFFICE_ID: "市中区级设施养护公司", type: '养护'},
    ];
    $scope.addRole = function (x) {
        var modalInstance = $modal.open({
            templateUrl: 'roleModal.html',
            controller: 'roleModalCtrl',
            size: '',
            backdrop: 'static',      
	        keyboard: false,
            resolve: {
                items: function () {
                    return x;
                }

            }
        });

        modalInstance.result.then(function (selectedItem) {
            $scope.selected = selectedItem;
        }, function () {
            $log.info('Modal dismissed at: ' + new Date());
        });
    }
})