app.controller('manageBridgeStructural_controller', ['$scope', '$http', '$modal', '$log', function ($scope, $http, $modal, $log) {
    
    $scope.openModal=function(){
       let modalInstance = $modal.open({
            templateUrl: 'structureModal.html',
            controller: 'structureCtrl',
            size: 'lg',
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
    $scope.showDisease=function(){
        $modal.open({
            templateUrl: 'diseaseModal.html',
            size: 'lg',
            backdrop: 'static',      
	        keyboard: false,
            resolve: {
                items: function () {
                    // return $scope.maintainInfo[index];
                }

            }
        });
    }

}])
app.controller('structureCtrl',['$scope','$http','items','$modal','$modalInstance',function($scope,$http,items,$modal,$modalInstance){
    console.log(items);
    
}])