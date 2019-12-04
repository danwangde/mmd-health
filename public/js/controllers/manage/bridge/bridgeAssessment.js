app.controller('bridgeAssess_controller', ['$scope', '$http', '$modal', '$log', function ($scope, $http, $modal, $log) {

    async function assess() {
        let url = '/assess/select_assess?uid=' + $scope.app.globalInfo.userid;
        let res = await $http.get(url);
        console.log(res.data)
        $scope.$apply(function () {
            $scope.bridgeAssess = res.data;
        })
        for (let item of $scope.bridgeAssess) {
            item.Inspection_date = get_date_str(new Date(item.Inspection_date));
        }
    }
    assess();


    $scope.notice = function (item) {
        var modalInstance = $modal.open({
            templateUrl: 'myModalContent.html',
            controller: 'ModalInstanceCtrl',
            size: 'lg',
            backdrop: 'static',      
	        keyboard: false,
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


app.controller('ModalInstanceCtrl', ['$scope', '$modalInstance', 'items', function ($scope, $modalInstance, items) {
    console.log(items);
    $scope.title = items;

    $scope.data = [
        { data1: '2019-3-26', data2: '山东省市政养护管理平台', data3: 'II', data4: '4', data5: '5', data6: '6', data7: '7', data8: '8', data9: '9', data10: '10', data11: '11', data12: '12', data13: '13', data14: '14', data15: '15' },
        { data1: '2019-3-26', data2: '山东省市政养护管理平台', data3: 'II', data4: '4', data5: '5', data6: '6', data7: '7', data8: '8', data9: '9', data10: '10', data11: '11', data12: '12', data13: '13', data14: '14', data15: '15' },
        { data1: '2019-3-26', data2: '山东省市政养护管理平台', data3: 'II', data4: '4', data5: '5', data6: '6', data7: '7', data8: '8', data9: '9', data10: '10', data11: '11', data12: '12', data13: '13', data14: '14', data15: '15' },
        { data1: '2019-3-26', data2: '山东省市政养护管理平台', data3: 'II', data4: '4', data5: '5', data6: '6', data7: '7', data8: '8', data9: '9', data10: '10', data11: '11', data12: '12', data13: '13', data14: '14', data15: '15' },
        { data1: '2019-3-26', data2: '山东省市政养护管理平台', data3: 'II', data4: '4', data5: '5', data6: '6', data7: '7', data8: '8', data9: '9', data10: '10', data11: '11', data12: '12', data13: '13', data14: '14', data15: '15' },
        { data1: '2019-3-26', data2: '山东省市政养护管理平台', data3: 'II', data4: '4', data5: '5', data6: '6', data7: '7', data8: '8', data9: '9', data10: '10', data11: '11', data12: '12', data13: '13', data14: '14', data15: '15' }
    ];

    $scope.ok = function () {
        $modalInstance.close({
            message: 'ok',
            data: {

            }
        })
    };
    $scope.cancel = function () {
        $modalInstance.close({
            message: 'cancel'
        });
    };

}]);