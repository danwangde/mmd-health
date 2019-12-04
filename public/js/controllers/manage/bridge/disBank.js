app.controller('manageBridgeDisBank_controller',['$scope','$http','$modal','$log',function ($scope,$http,$modal,$log) {
   
    $scope.disBank = [
        {
            diseaseType:'市政桥梁病害库',
            diseaseConType:'桥梁构件',
            ComponentType:'衬砌和挡墙',
            DamageType:'桥面贯通纵缝',
            DiseaseDef:'外部装饰板的构件损坏后',
            Remark:'“无”指伸缩缝处没有渗水痕迹；“轻微”指伸缩缝处轻微渗水，渗水痕迹面积不大且不明显；“严重”指伸缩缝处严重渗水，渗水痕迹面积较大且非常明显'
        },
        {
            diseaseType:'市政桥梁病害库',
            diseaseConType:'人行通道构件',
            ComponentType:'主拱圈',
            DamageType:'牛腿表面损伤',
            DiseaseDef:'外部装饰板的构件损',
            Remark:'“无”指伸缩缝处没有渗水痕迹；“轻微”指伸缩缝处轻微渗水，渗水痕迹面积不大且不明显；“严重”指伸缩缝处严重渗水，渗水痕迹面积较大且非常明显'
        }
    ];

    $scope.damageType = [
        {value:'0',name:'桥梁构件'},
        {value:'1',name:'人行通道构件'}
    ];

    $scope.notice=function(item){
        var modalInstance = $modal.open({
            templateUrl: 'myModalContent.html',
            controller: 'ModalInstanceCtrl',
            size: '',
            backdrop: 'static',      
	        keyboard: false,
            resolve: {
                items: function () {
                    return item;
                }

            }
        });

        modalInstance.result.then(function (rs) {
            $scope.selected = rs;
        }, function () {
            $log.info('Modal dismissed at: ' + new Date());
        });
    }

}]);
app.controller('ModalInstanceCtrl', ['$scope', '$modalInstance', 'items', function ($scope, $modalInstance, items) {
    console.log(items);

    $scope.ok = function() {
        $modalInstance.close({
            message: 'ok',
            data: {

            }
        })
    };
    $scope.cancel = function() {
        $modalInstance.close({
            message:'cancel'
        });
    };

}]);

