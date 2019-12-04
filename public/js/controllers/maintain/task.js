'use strict';

app.controller('maintainBridgeTask_controller', ['$scope', '$http','$filter','$modal', '$log', function ($scope, $http,$filter, $modal, $log) {
    [$scope.maintainInfo, $scope.totalItems, $scope.maintainInfoNow] = [[], [], []];
    [$scope.currentPage, $scope.itemsPerPage, $scope.maxSize] = [1, 12, 3];
    async function getMaintain() {
        let maintainInfoUrl = '/curing/select_curing_maintain?uid=' + $scope.app.globalInfo.userid;
        $http.get(maintainInfoUrl).then(function (req) {
            console.log(req.data);
            $scope.maintainInfo = req.data;
            $scope.totalItems = $scope.maintainInfo.length;
            getCurrentTimes();
            for (let item of $scope.maintainInfo) {
                if (item.facilities_type == '0') {
                    item.facilitype = '桥梁';
                } else {
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
    $scope.changePage = function () {
        getCurrentTimes();
    };

}])