'use strict';
app.controller('ModalInstanceCtrl', ['$scope', '$modalInstance', 'items', function ($scope, $modalInstance, items) {
    console.log(items)

}]);
app.controller('maintainBridgeBacklog_controller', ['$scope', '$http', '$modal', function ($scope, $http,$modal) {
    $scope.maintainInfo = [{
        BridgeID: '1',
        BridgeNum: 'HT005',
        BridgeName: '胜利路桥',
        BridgeType: '梁桥',
        CuringGrade: 'I等',
        num: 5,
        num1:4,
        maintainDept: '天桥区住房和城乡建设局',
        stime:"2019-04-01",
        etime:'2019-04-30',
        ctime:'2019-04-01'
    },
        {
            BridgeID: '2',
            BridgeNum: 'HT004',
            BridgeName: '八一路桥',
            BridgeType: '圬工拱桥（无拱上构造）',
            CuringGrade: 'II等',
            num: 5,
            num1:4,
            maintainDept: '淄川区住房和城乡建设局',
            stime:"2019-04-01",
            etime:'2019-04-30',
            ctime:'2019-04-01'
        }];
    $scope.waitDiseaseInfo=[{
        id:'19032200003',
        bridgeName:'燕山立交桥',
        diseaseName:'沥青路面坑槽',
        time:'2019-03-22 08:15:00',
        etime:'2019-04-22 08:15:00',
        address:'卧虎山路(与沂山路交汇西50米路北)'
    },{
        id:'19032200003',
        bridgeName:'燕山立交桥',
        diseaseName:'沥青路面坑槽',
        time:'2019-03-22 08:15:00',
        etime:'2019-04-22 08:15:00',
        address:'卧虎山路(与沂山路交汇西50米路北)'
    }];
    $scope.orderDispose=function(){
        var modalInstance = $modal.open({
            templateUrl: 'orderDisposeModal.html',
            // controller: 'ModalInstanceCtrl',
            size: '',
            backdrop: 'static',      
	        keyboard: false,
            resolve: {
                items: function () {
                    return {};
                }

            }
        });

        modalInstance.result.then(function (selectedItem) {
            $scope.selected = selectedItem;
        }, function () {
            $log.info('Modal dismissed at: ' + new Date());
        });
    }
}])