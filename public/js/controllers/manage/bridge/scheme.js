'use strict';

app.controller('manageBridgeScheme_controller', ['$scope', '$http', '$modal', '$log', function ($scope, $http, $modal, $log) {
    $scope.orderInfo=[
        {
            id:'19032200003',
            bridgeName:'燕山立交桥',
            diseaseName:'沥青路面坑槽',
            time:'2019-03-22 08:15:00',
            scheme:'山东省市政基础设施养护管理平台详细设计说明书 (1).pdf',
            state:0,
            address:'卧虎山路(与沂山路交汇西50米路北)',
            description:'12319单子',
            name:'高明欣'
        },
        {
            id:'19032200004',
            bridgeName:'燕山立交桥',
            diseaseName:'沥青路面坑槽',
            time:'2019-03-22 08:15:00',
            scheme:'山东省市政基础设施养护管理平台详细设计说明书 (1).pdf',
            state:1,
            address:'卧虎山路(与沂山路交汇西50米路北)',
            description:'12319单子',
            name:'高明欣'
        },
        {
            id:'19032200005',
            bridgeName:'燕山立交桥',
            diseaseName:'沥青路面坑槽',
            time:'2019-03-22 08:15:00',
            scheme:'山东省市政基础设施养护管理平台详细设计说明书 (1).pdf',
            state:2,
            address:'卧虎山路(与沂山路交汇西50米路北)',
            description:'12319单子',
            name:'高明欣'
        }
    ];
    $scope.clickOrder = function (index) {
        $scope.focus = index;
        var modalInstance = $modal.open({
            templateUrl: 'myModalContent.html',
            controller: 'ModalInstanceCtrl',
            size: '',
            backdrop: 'static',      
	        keyboard: false,
            resolve: {
                items: function () {
                    return $scope.orderInfo[index]
                }

            }
        });

        modalInstance.result.then(function (selectedItem) {
            $scope.selected = selectedItem;
        }, function () {
            $log.info('Modal dismissed at: ' + new Date());
        });
    };
}])