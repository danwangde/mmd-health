'use strict';
app.controller('managePublicJournal_controller', ['$scope','$filter', '$http', function ($scope,$filter, $http) {
    console.log(new Date());

  

    [$scope.jourData, $scope.totalItems, $scope.jourDataNow] = [[], [], []];
    [$scope.currentPage, $scope.itemsPerPage, $scope.maxSize] = [1, 16, 3];
    async  function getJournal() {
        let url ='/memo/select_log?branch_id='+JSON.parse(sessionStorage.getItem('msg')).branch_id
        await $http.get(url).then((res)=>{
            for (let item of  res.data) {
                if (item.operation_time !== '0000-00-00 00:00:00') {
                    item.operation_time = get_date_str(new Date( item.operation_time));
                }
            }
            res.data = res.data.sort(compare('operation_time',false))
            $scope.jourData = res.data.slice(0,100);
            console.log($scope.jourData)
            $scope.totalItems = $scope.jourData.length;

            getCurrentTimes();
        });
    };
    getJournal();

    $scope.search = function () {
        console.log(1111)
        $scope.jourDataNow = $filter('journal')($scope.jourData, $scope.ip, $scope.username);
    };

    // 返回当前页对应的数据
    function getCurrentTimes() {

        var start = ($scope.currentPage - 1) * $scope.itemsPerPage;
        $scope.jourDataNow = $scope.jourData.slice(start, start + $scope.itemsPerPage);
    }

    // 切换分页
    $scope.changePage = function () {
        getCurrentTimes();
    };

    
    function compare(property, desc) {
        return function (a, b) {
            var value1 = a[property];
            var value2 = b[property];
            if (desc == true) {
                return value1.localeCompare(value2);
            } else {
                return value2.localeCompare(value1);
            }
        }
    };

    function get_date_str(Date) {
        var Y = Date.getFullYear();
        var M = Date.getMonth() + 1;
        M = M < 10 ? '0' + M : M; // ??????0
        var D = Date.getDate();
        D = D < 10 ? '0' + D : D;
        var H = Date.getHours();
        H = H < 10 ? '0' + H : H;
        var Mi = Date.getMinutes();
        Mi = Mi < 10 ? '0' + Mi : Mi;
        var S = Date.getSeconds();
        S = S < 10 ? '0' + S : S;
        return Y + '-' + M + '-' + D + ' ' + H + ':' + Mi + ':' + S;
    }

}]);
