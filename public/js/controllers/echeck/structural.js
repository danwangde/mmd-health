app.controller('echeckBridgeStructural_controller', ['$scope', '$http', '$modal', '$log', function ($scope, $http, $modal, $log) {
    $scope.structInfo = [{
            number: '5',
            type: '桥梁',
            name: '张北路乌河桥',
            component: '线路1-第1跨-空心板梁2'
        },
        {
            number: '6',
            type: '桥梁',
            name: '	胜利路桥',
            component: '	高速方向-第1跨-主梁'
        }
    ]
    $scope.showTable = false;
    $scope.show = function () {
        $scope.showTable = !$scope.showTable
    }
    $scope.openModal = function () {
        $modal.open({
            templateUrl: 'structureModal.html',
            size: 'lg',
            backdrop: 'static',      
	        keyboard: false,
            resolve: {
                items: function () {
                    // return $scope.maintainInfo[index];
                }

            }
        });
    }
    $scope.items = {
        number: '',
        type: '',
        name: '',
        component: ''
    };
    $scope.addStructural = function (size) {
        var modalInstance = $modal.open({
            templateUrl: 'addStruct.html',
            controller:'ModalInstanceCtrl',
            backdrop: 'static',
            keyboard: false,
            size: '',
            resolve: {
                items: function () {
                    $scope.items = size;
                    if (size.component == '') {
                        $scope.items.title = 'insert'
                    } else {
                        $scope.items.title = 'update'
                    }
                    return {
                        items: $scope.items
                    }
                }
            }
        })

        modalInstance.result.then(function (rs) {
            if (rs.message == 'ok') {
                if ($scope.items.title == 'insert') {
                    $scope.regularInfo.push($scope.items);
                } else {
                    //$scope.items=rs.data;
                }
            }
            $scope.items = {
                number: '',
                type: '',
                name: '',
                component: ''
            };
            console.log(rs.data.data);
        }, function () {
            $log.info('Modal dismissed at: ' + new Date());
        });
    }
}])

app.controller('ModalInstanceCtrl', ['$scope', '$modalInstance', 'items', function ($scope, $modalInstance, items) {
    $scope.updateData = items.items;

    if ($scope.updateData.title == 'insert') {
        $scope.titleName = '新增检测记录'
    } else {
        $scope.titleName = '修改检测记录'
    }
    $scope.ok = () => {
        $modalInstance.close({
            message: 'ok',
            data: {

            }
        })
    }

    $scope.cancel = () => {
        $modalInstance.close({
            message: 'cancle',
            data: {
                data: $scope.updateData
            }
        })
    }
}])