app.controller('dataManageCtrl', ['$scope', '$modalInstance', 'items', '$compile', '$http', '$modal', function ($scope, $modalInstance, items, $compile, $http, $modal) {

    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    }
}]);
app.controller('managePublicDataManage_controller', ['$scope', '$http', '$modal',function ($scope, $http,$modal) {
        $scope.disBank = [
            {
                diseaseType:'市政桥梁病害库',
                diseaseConType:'桥梁构件',
                diseaseDate:'2019-04-08',
                DamageType:'桥梁病害信息',
                DiseaseDef:'leo'
            },
            {
                diseaseType:'市政桥梁病害库',
                diseaseConType:'人行通道构件',
                diseaseDate:'2019-04-08',
                DamageType:'人行通道信息',
                DiseaseDef:'benben',
            }
        ];
        $scope.dataManage=function(num,item){
            if(num==1){
                item.title='修改资料'
            }else if(num==0){
                item.title='新建资料'
            }
            var modalInstance = $modal.open({
                templateUrl: 'dataManageTpl.html',
                controller: 'dataManageCtrl',
                size: '',
                backdrop: 'static',      
                keyboard: false,
                resolve: {
                    items: function () {
                        return item;
                    }

                }
            });

            modalInstance.result.then(function () {

            }, function () {

            });
        };
        $scope.delData=function(item){
            console.log(item)
        }


}])