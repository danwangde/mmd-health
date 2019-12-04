app.controller('ModalInstanceCtrl', ['$scope', '$modalInstance', 'items','$http', function ($scope, $modalInstance, items,$http) {

    $scope.curingData=items.curingData;
    $scope.itemData=items.item;
    console.log(items.item)
    $scope.saveUpdateTask=function(){
        $http.post('/curing/insert_curing_play',$scope.itemData).then(function(req){
            console.log(req.data)
            if(req.data == 1){
                $modalInstance.close();
            }else{
                alert('修改失败')
            }
        })
    };
    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    }

}]);
app.controller('manageBridgeTask_controller', ['$scope', '$http', '$modal','$filter' ,'$log', function ($scope, $http, $modal,$filter, $log) {

    $scope.type = JSON.parse(sessionStorage.getItem('msg')).usertype;
    [$scope.maintainInfo, $scope.totalItems, $scope.maintainInfoNow]=[[],[],[]];
    [$scope.currentPage, $scope.itemsPerPage, $scope.maxSize] = [1,12,3];
    function CuringDataFn(){
        let getCuringData='/bridgeInfo/selCuring?manageid='+$scope.app.globalInfo.userid;
        $http.get(getCuringData).then(function (response) {
            $scope.curingData = response.data;
        });
    }
    async function getMaintain(){
        await CuringDataFn();
        let maintainInfoUrl='/curing/select_curing_play?uid='+$scope.app.globalInfo.userid+'&power='+JSON.parse(sessionStorage.getItem('msg')).usertype;
        $http.get(maintainInfoUrl).then(function(req){
            $scope.maintainInfo=req.data;
            console.log(req.data);
            $scope.totalItems = $scope.maintainInfo.length;
            getCurrentTimes();
            for(let item of  $scope.maintainInfo){
                if(item.facilities_type=='0'){
                    item.facilitype = '桥梁';
                }else{
                    item.facilitype = '人行通道';
                }

            }

        })
    }
    getMaintain();

    $scope.search = function () {

        $scope.maintainInfoNow = $filter('task')($scope.maintainInfo, $scope.type, $scope.number);
    };


     // 返回当前页对应的数据
     function getCurrentTimes() {

        var start = ($scope.currentPage - 1) * $scope.itemsPerPage;
        $scope.maintainInfoNow = $scope.maintainInfo.slice(start, start + $scope.itemsPerPage);
    }

    // 切换分页
    $scope.changePage = function() {
        getCurrentTimes();
    };


    $scope.update=function(item){
        var modalInstance = $modal.open({
            templateUrl: 'myModalContent.html',
            controller: 'ModalInstanceCtrl',
            size: '',
            backdrop: 'static',      
	        keyboard: false,
            resolve: {
                items: function () {
                    return {
                        item:item,
                        curingData:$scope.curingData
                    }
                }

            }
        });
        modalInstance.result.then(function () {
            getMaintain();
        }, function () {
        });
    }
}])
