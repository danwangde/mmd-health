app.controller('loadtestCtrl', ['$scope', '$modalInstance', '$http', 'items', function ($scope, $modalInstance, $http, items) {
    $scope.detail = items.detail[0];
    $scope.num = items.index;
    console.log($scope.detail);
    $scope.detail.Inspection_date = get_date_str(new Date( $scope.detail.Inspection_date ))
    $scope.cancel = function () {
        $modalInstance.close()
    }

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
        return Y + '-' + M + '-' + D;
    }

}]);

app.controller('addLoadtestModalCtrl', ['$scope', '$modalInstance', '$http', 'items', function ($scope, $modalInstance, $http, items) {


}]);

app.controller('manageBridgeLoadtest_controller', ['$scope', '$http','$filter', '$modal', '$log', function ($scope, $http,$filter, $modal, $log) {
    $scope.showLoadtest = async function (x, index) {
        let getLoadtest = '/Testing/select_loadDetail?id=' + x.id;
        await $http.get(getLoadtest).then((res) => {
            $scope.detail = res.data;
            console.log(res.data);
        });
        let modalInstance = $modal.open({
            templateUrl: 'loadtestModal.html',
            controller: 'loadtestCtrl',
            size: 'lg',
            backdrop: 'static',      
	        keyboard: false,
            resolve: {
                items: function () {
                    return {
                        detail: $scope.detail,
                        index: index + 1
                    }
                }

            }
        });
        modalInstance.result.then(function (fs) {

        })
    };

    $scope.addLoadtest = async function () {
        let modalInstance = $modal.open({
            templateUrl: 'addLoadtestModal.html',
            controller: 'addLoadtestModalCtrl',
            size: 'lg',
            backdrop: 'static',      
	        keyboard: false,
            resolve: {
                items: function () {
                    return {

                    }
                }

            }
        });
        modalInstance.result.then(function (fs) {

        })
    }


    [$scope.loadTestInfo, $scope.totalItems, $scope.loadTestInfoNow] = [[], [], []];
    [$scope.currentPage, $scope.itemsPerPage, $scope.maxSize] = [1, 12, 3];

    async function getLoadtest() {
        let getLoadUrl = '/Testing/select_load?uid=' + $scope.app.globalInfo.userid;
        await $http.get(getLoadUrl).then((res) => {
            console.log(res.data);
            $scope.loadTestInfo = res.data;
            $scope.totalItems = $scope.loadTestInfo.length;
            getCurrentTimes();
            for (let item of $scope.loadTestInfo) {

                if (item.Inspection_date == null) {
                    item.Inspection_date = '';
                } else {

                    item.Inspection_date = get_date_str(new Date(item.Inspection_date));
                }
            }
        })
    };
    getLoadtest();

    $scope.search = function () {
        $scope.loadTestInfoNow = $filter('loadtest')($scope.loadTestInfo, $scope.projectName, $scope.reviever,$scope.date);
    };
    // 返回当前页对应的数据
    function getCurrentTimes() {

        var start = ($scope.currentPage - 1) * $scope.itemsPerPage;
        $scope.loadTestInfoNow = $scope.loadTestInfo.slice(start, start + $scope.itemsPerPage);
    }

    // 切换分页
    $scope.changePage = function () {
        getCurrentTimes();
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
        return Y + '-' + M + '-' + D;
    }
}])