app.controller('ModalInstanceCtrl', ['$scope', '$modalInstance', 'items', function ($scope, $modalInstance, items) {
    console.log(items)

}]);
app.controller('manageBridgeTask_controller', ['$scope', '$http', '$modal', '$log', function ($scope, $http, $modal, $log) {
    $scope.maintainInfo = [{
        BridgeID: '桥梁',
        BridgeNum: 'HT005',
        BridgeName: '胜利路桥',
        PlanName: '2018秋季巡查计划2',
        time:'2019-03-01到2019-03-03',
        maintainDept: '天桥区住房和城乡建设局',
        num:5
    },
        {
            BridgeID: '隧道',
            BridgeNum: 'HT004',
            BridgeName: '隧道1',
            PlanName: '2018秋季巡查计划2',
            time:'2019-03-01到2019-03-03',
            maintainDept: '淄川区住房和城乡建设局',
            num:4
        }];
    $scope.addTask=function(index){
        var modalInstance = $modal.open({
            templateUrl: 'myModalContent.html',
            controller: 'ModalInstanceCtrl',
            size: '',
            backdrop: 'static',      
	        keyboard: false,
            resolve: {
                items: function () {
                    return $scope.maintainInfo[index];
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