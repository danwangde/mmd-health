app.controller('passageAssess_controller',['$scope','$http','$modal','$log',function ($scope,$http,$modal,$log) {

    $scope.passageAssess = [
        {name:'团体通道',grade:'A',score:'100',checkDate:'2019-3-26',evalDate:'2019-03-28',checkUnit:'山东省市政养护管理平台'},
        {name:'北园大街人行通道',grade:'B',score:'100.66',checkDate:'2019-3-26',evalDate:'2019-03-28',checkUnit:'山东省市政养护管理平台'},
        {name:'城市通道',grade:'A',score:'97.66',checkDate:'2019-3-28',evalDate:'2019-03-28',checkUnit:'山东省市政养护管理平台'},
        {name:'奥体西路人行通道',grade:'C',score:'97.66',checkDate:'2019-3-26',evalDate:'2019-03-28',checkUnit:'山东省市政养护管理平台'},
    ];



    $scope.notice=function(item){
        var modalInstance = $modal.open({
            templateUrl: 'myModalContent.html',
            controller: 'ModalInstanceCtrl',
            size: 'lg',
            resolve: {
                items: function () {
                    return item.name;
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

    $scope.data = [
        {data1:'2019-3-26',data2:'山东省市政养护管理平台',data3:'II',data4:'4',data5:'5',data6:'6',data7:'7',data8:'8',data9:'9',data10:'10',data11:'11',data12:'12',data13:'13'},
        {data1:'2019-3-26',data2:'山东省市政养护管理平台',data3:'II',data4:'4',data5:'5',data6:'6',data7:'7',data8:'8',data9:'9',data10:'10',data11:'11',data12:'12',data13:'13'},
        {data1:'2019-3-26',data2:'山东省市政养护管理平台',data3:'II',data4:'4',data5:'5',data6:'6',data7:'7',data8:'8',data9:'9',data10:'10',data11:'11',data12:'12',data13:'13'},
        {data1:'2019-3-26',data2:'山东省市政养护管理平台',data3:'II',data4:'4',data5:'5',data6:'6',data7:'7',data8:'8',data9:'9',data10:'10',data11:'11',data12:'12',data13:'13'},
        {data1:'2019-3-26',data2:'山东省市政养护管理平台',data3:'II',data4:'4',data5:'5',data6:'6',data7:'7',data8:'8',data9:'9',data10:'10',data11:'11',data12:'12',data13:'13'},
        {data1:'2019-3-26',data2:'山东省市政养护管理平台',data3:'II',data4:'4',data5:'5',data6:'6',data7:'7',data8:'8',data9:'9',data10:'10',data11:'11',data12:'12',data13:'13'}
    ];

    $scope.title=items;

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