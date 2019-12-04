'use strict';
app.controller('managePublicdic_controller', ['$scope', '$http','$modal',function ($scope, $http,$modal) {
    console.log(new Date());

    $scope.faultData = [{
            keyvalue: '001001',
            label: '跨',
            type: '001',
            describe: '构件类型所属结构',
            sort: '10'
        },
        {
            keyvalue: '001002',
            label: '跨',
            type: '001',
            describe: '构件类型所属结构',
            sort: '10'
        },
        {
            keyvalue: '001003',
            label: '桥台',
            type: '001',
            describe: '构件类型所属结构',
            sort: '20'
        },
        {
            keyvalue: '001004',
            label: '桥墩',
            type: '001',
            describe: '构件类型所属结构',
            sort: '30'
        },
        {
            keyvalue: '001005',
            label: '桥面系',
            type: '001',
            describe: '构件类型所属结构',
            sort: '40'
        }
    ]




    $scope.items ={keyvalue:'',label:'',type:'',describe:'',sort:''};
  

    $scope.add = function(size){
        var modalInstance =$modal.open({
            templateUrl:'regularModal.html',
            controller:'ModalInstanceCtrl',
            backdrop: 'static',
            keyboard: false,
            size:'',
            resolve:{
                items: function () {
                    $scope.items=size;
                    if(size.keyvalue==''){
                        $scope.items.title='insert'
                    }
                    else{
                        $scope.items.title='update'
                    }
                    return {
                        items:$scope.items
                    }
                 }
 
            }
        })
        modalInstance.result.then(function (rs) {
            if(rs.message=='ok'){
                if ($scope.items.title=='insert'){
                    $scope.faultData.push($scope.items);
                }
                else{
                    //$scope.items=rs.data;
                }
             }
             $scope.items ={keyvalue:'',label:'',type:'',describe:'',sort:''};
           console.log(rs);
        }, function () {
            $log.info('Modal dismissed at: ' + new Date());
        });
    }

    $scope.removeRegular = function(index){
        $scope.faultData.splice(index,1)
    }

}])



app.controller('ModalInstanceCtrl',['$scope', '$modalInstance', 'items', function ($scope, $modalInstance, items) {
    $scope.updateData = items.items;
   
    if( $scope.updateData.title=='insert'){
     $scope.titleName='新增键值'
 }else{
     $scope.titleName='修改键值'
 }
    $scope.ok = ()=>{
     $modalInstance.close({
         message: 'ok',
         data: {
 
         }
     })
    }
 
    $scope.cancel = ()=>{
     $modalInstance.close({
         message: 'cancle',
         data: {
 
         }
     })
    }
 }])