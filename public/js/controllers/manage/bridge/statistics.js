app.controller('manageInfoStatistics_controller', ['$scope', '$http', '$location', function ($scope, $http, $location) {

    [$scope.funcData,  $scope.formData,$scope.gradeData, $scope.curingData, $scope.totalItems, $scope.funcDataNow,$scope.formDataNow,$scope.gradeDataNow,$scope.curingDataNow]=[[],[],[],[],[],[],[],[],[]];
    [$scope.currentPage, $scope.itemsPerPage, $scope.maxSize] = [1,12,3];

    let getFunc = '/bridgeinfo/select_purpose?id=' + JSON.parse(sessionStorage.getItem('msg')).branch_id;
    $http.get(getFunc).then((res) => {
        $scope.funcData = res.data;
        getCurrentTimes($scope.funcData);
    });
    let getForm = '/bridgeinfo/select_form?id=' + JSON.parse(sessionStorage.getItem('msg')).branch_id;
    $http.get(getForm).then((res) => {
        $scope.formData = res.data;
        total($scope.formData);
        getCurrentTimes($scope.formData);
    });
    let getGrade = '/bridgeinfo/select_Grade?id=' + JSON.parse(sessionStorage.getItem('msg')).branch_id;
    $http.get(getGrade).then((res) => {
        $scope.gradeData = res.data;
        total($scope.gradeData);
        getCurrentTimes($scope.gradeData);
    });
    let getCuringGrade = '/bridgeinfo/select_category?id=' + JSON.parse(sessionStorage.getItem('msg')).branch_id;
    $http.get(getCuringGrade).then((res) => {
        $scope.curingData = res.data;
        total($scope.curingData);
        getCurrentTimes($scope.curingData);
    });

    
     // 返回当前页对应的数据
     function getCurrentTimes(item1) {

        var start = ($scope.currentPage - 1) * $scope.itemsPerPage;
        if(item1==$scope.funcData){
            $scope.funcDataNow = item1.slice(start, start + $scope.itemsPerPage);
            return  $scope.funcDataNow
        }else if(item1==$scope.formData){
            $scope.formDataNow = item1.slice(start, start + $scope.itemsPerPage);
            return  $scope.formDataNow
        }else if(item1==$scope.gradeData){
            $scope.gradeDataNow = item1.slice(start, start + $scope.itemsPerPage);
           return  $scope.gradeDataNow
        }else{
            $scope.curingDataNow = item1.slice(start, start + $scope.itemsPerPage);
            return  $scope.curingDataNow
        }
    };
    function total(item){
        $scope.totalItems = item.length;
        return $scope.totalItems
    };

    // 切换分页
    $scope.changePage1 = function() {
        getCurrentTimes($scope.funcData);
    };
    
    $scope.changePage2 = function() {
        getCurrentTimes($scope.formData);
    };

    $scope.changePage3 = function() {
        getCurrentTimes($scope.gradeData);
    };

    $scope.changePage4 = function() {
        getCurrentTimes($scope.curingData);
    };
    $scope.changeCurrent = function(){
        $scope.currentPage = 1;
    }
}]);