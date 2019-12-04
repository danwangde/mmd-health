'use strict';

app.controller('managePublicWeight_controller', ['$scope', '$modal', '$http', function ($scope, $modal, $http) {
    console.log(111);
    [$scope.weight, $scope.totalItems, $scope.weightNow] = [[], [], []];
    [$scope.currentPage, $scope.itemsPerPage, $scope.maxSize] = [1, 12, 3];

    async function getData() {
        let getUrl = '/bridgeinfo/select_weight';
        let res = await $http.get(getUrl);
        $scope.$apply(function () {
            $scope.weight = res.data;
            $scope.totalItems = $scope.weight.length;
            getCurrentTimes();
        });
        console.log(res.data)
    };
    getData();
    // 返回当前页对应的数据
    function getCurrentTimes() {

        var start = ($scope.currentPage - 1) * $scope.itemsPerPage;
        $scope.weightNow = $scope.weight.slice(start, start + $scope.itemsPerPage);
    }

    // 切换分页
    $scope.changePage = function () {
        getCurrentTimes();
    };


    $scope.addData = { bridge_type: '', bridgetype_name: '', deck_weight: '', down_weight: '' };
    $scope.addBtn = async function (x) {
        if (x.bridge_type == '') {
            x.title = 'insert';
        } else {
            x.title = 'update';
        }
        let modalInstance = $modal.open({
            templateUrl: 'addWeight.html',
            controller: 'addWeightCtrl',
            size: '',
            backdrop: 'static',      
	        keyboard: false,
            resolve: {
                items: function () {
                    return {
                        item: x
                    }
                }

            }
        });
        modalInstance.result.then(function () {
            getData();
            $scope.addData = { bridge_type: '', bridgetype_name: '', deck_weight: '', down_weight: '' };
        }, function () {
        });
    };

    $scope.delBtn = async function (x) {
        let delUrl = '/bridgeinfo/delete_weight?id=' + x.id;
        let res = await $http.get(delUrl);
        if (res.data == '1') {
            alert('删除成功');
        } else {
            alert('删除失败');
        };
        getData();
    }

}]);


app.controller('addWeightCtrl', ['$scope', '$modal', '$http', 'items', '$modalInstance', function ($scope, $modal, $http, items, $modalInstance) {
    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };

    if (items.item.title == 'insert') {
        $scope.title = '新增权重';
    } else {
        $scope.title = '修改权重';
    };

    $scope.addWeight = items.item;

    $scope.saveBtn = async function () {

        console.log($scope.addWeight)
        if ($scope.title == '新增权重') {
            let addUrl = '/bridgeinfo/insert_weight';
            let res = await $http.post(addUrl, $scope.addWeight);
            if (res.data == '1') {
                alert('新增成功');
                $modalInstance.close();

            } else {
                alert('新增失败');
            };
        } else {
            let updateUrl = '/bridgeinfo/update_weight';
            let res = await $http.post(updateUrl, $scope.addWeight);
            if (res.data == '1') {
                alert('修改成功');
                $modalInstance.close();
            } else {
                alert('修改失败');
            };
        }
    }


}]);
