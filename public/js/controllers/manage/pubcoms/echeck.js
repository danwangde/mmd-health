app.controller('ModalInstanceCtrl', ['$scope', '$modalInstance', 'items', function ($scope, $modalInstance, items) {
    console.log(items)

}]);
app.controller('manageBridgePlan_controller', ['$scope', '$http', '$modal', '$log', function ($scope, $http, $modal, $log) {
    $scope.planInfo = [{
        Subsystem: '人行通道',
        PlanType: '常规检测',
        PlanTypeName: '胜利路桥',
        PlanName: '2018秋季巡查计划2',
        time: '2019-03-01到2019-03-03',
        state: '未审核',

    },
        {
            Subsystem: '隧道',
            PlanType: '结构性能检测',
            PlanTypeName: '胜利路桥',
            PlanName: '2018秋季巡查计划2',
            time: '2019-03-01到2019-03-03',
            state: '未审核',

        }, {
            Subsystem: '桥梁',
            PlanType: '荷载试验',
            PlanTypeName: '胜利路桥',
            PlanName: '2018秋季巡查计划2',
            time: '2019-03-01到2019-03-03',
            state: '已审核',

        },];
    $scope.addPlan = function () {
        var modalInstance = $modal.open({
            templateUrl: 'myModalContent.html',
            controller: 'ModalInstanceCtrl',
            size: '',
            backdrop: 'static',      
	        keyboard: false,
            resolve: {
                items: function () {
                    // return $scope.maintainInfo[index];
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