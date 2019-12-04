app.controller('manageComponentPrice_controller', ['$scope', '$http', '$modal', '$log','$filter', function ($scope, $http, $modal, $log,$filter) {
    $scope.addData = {
        project: '',
        unit: '',
        Unit_Price: '',
        Features: '',
        disease_name:'',
        creat_time:''
    };
    $scope.addPrice = async function (item) {
            let getPriceUrl = '/curing/select_diseases?uid='+JSON.parse(sessionStorage.getItem('msg')).userid;
            let res = await $http.get(getPriceUrl);
            $scope.$apply(function () {
                console.log(res.data);
                $scope.DisData = res.data;
            })
        if (item.project == '') {
            $scope.num = 'insert'
        } else {
            $scope.num = 'update'
        };
        let modalInstance = $modal.open({
            templateUrl: 'addPrice.html',
            controller: 'addPriceCtrl',
            size: '',
            backdrop: 'static',
	        keyboard: false,
            resolve: {
                data: function () {
                    return {
                        value: item,
                        num: $scope.num,
                        DisData: $scope.DisData
                    }
                }
            }
        });

        modalInstance.result.then(function (SuperStructure) {
            getPrice();
        }, function () {

        });
    };
    $scope.deletePrice = async function (item) {
        if (confirm('确认删除该条记录吗?')) {
            let delUrl = '/price/delete_Project?id='+item.id;
        let res = await $http.get(delUrl);
        if(res.data == 1){
            alert('删除成功');

        }else{
            alert('删除失败');
        };
        getPrice();
        }

    };





    [$scope.priceData, $scope.totalItems, $scope.priceDataNow] = [[], [], []];
    [$scope.currentPage, $scope.itemsPerPage, $scope.maxSize] = [1, 12, 3];

    async function getPrice() {
        let getPriceUrl = '/price/select_Project';
        let res = await $http.get(getPriceUrl);
        $scope.$apply(function () {
            $scope.priceData = res.data;
            $scope.totalItems = $scope.priceData.length;
            getCurrentTimes();
        })
    };
    getPrice();

    $scope.search = function () {

        $scope.priceDataNow = $filter('price')(  $scope.priceData,$scope.project);
    };

    // 返回当前页对应的数据
    function getCurrentTimes() {

        var start = ($scope.currentPage - 1) * $scope.itemsPerPage;
        $scope.priceDataNow = $scope.priceData.slice(start, start + $scope.itemsPerPage);
    }

    // 切换分页
    $scope.changePage = function () {
        getCurrentTimes();
    };

}]);

app.controller('addPriceCtrl', ['$scope','$http','$modalInstance', 'data', function ($scope,$http,$modalInstance, data) {
    $scope.addData = data.value;
    $scope.DisData = data.DisData;
    if ( $scope.DisData.length) {
        for (let i of $scope.DisData) {
            if(i.disid ==$scope.addData.dis_id) {
                i.select = true;
            }else{
                i.select = false;
            }
        }
    }


    if (data.num == 'insert') {
        $scope.title = '新增单价';
        $scope.savePrice = async function () {
            let addPriceUrl = '/price/insert_Project';
            let res = await $http.post(addPriceUrl, $scope.addData);
            if(res.data == 1){
                alert('新增成功');
                $modalInstance.close();
            }else{
                alert('新增失败');
            }
        }
        $scope.addData = {
            project: '',
            unit: '',
            Unit_Price: '',
            Features: '',
            disease_name:'',
            creat_time:''
        };
    } else {
        $scope.title = '修改单价';
        $scope.savePrice = async function (item) {
            let updatePriceUrl = '/price/update_Project';
            let res = await $http.post(updatePriceUrl,$scope.addData);
            if(res.data == 1){
                alert('修改成功');
                $modalInstance.close();
            }else{
                alert('修改失败');
            }
        }
    };

    $scope.cancel = function() {
        $modalInstance.dismiss();
    }


}]);
