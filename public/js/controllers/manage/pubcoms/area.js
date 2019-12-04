'use strict';
app.controller('ModalInstanceCtrl', ['$scope', '$modalInstance', 'items', function ($scope, $modalInstance, items) {
}]);
app.controller('managePublicArea_controller', function ($scope,$modal) {

    $scope.sysArea = [
        {
            ID: 1,
            PARENT_ID: "",
            NAME: '山东省',
            CODE: '370000',
            TYPE: '省份、直辖市',
            REMARKS:'1'
        },
        {
            ID: 2,
            PARENT_ID: "1",
            NAME: '桓台县',
            CODE: '370105',
            TYPE: '地市',
            REMARKS:'2'
        },
        {
            ID: 3,
            PARENT_ID: "2",
            NAME: '枣庄市',
            CODE: '370105',
            TYPE: '地市',
            REMARKS:'3'
        },
        {
            ID: 4,
            PARENT_ID: "1",
            NAME: '淄博市',
            CODE: '370105',
            TYPE: '地市',
            REMARKS:'2'
        },
        {
            ID: 5,
            PARENT_ID: "4",
            NAME: '滕州市',
            CODE: '370105',
            TYPE: '地市',
            REMARKS:'3'
        }

    ];
    $scope.$on('ngRepeatFinished', function () {//监听事件
        $("#areaTree").treetable({
            expandable: true,// 展示
            initialState: "expanded",//默认打开所有节点
            stringCollapse: '关闭',
            stringExpand: '展开'
        });
    });
    $scope.addArea = function (x) {
        var modalInstance = $modal.open({
            templateUrl: 'myModalContent.html',
            controller: 'ModalInstanceCtrl',
            size: '',
            backdrop: 'static',      
	        keyboard: false,
            resolve: {
                items: function () {
                    return x;
                }

            }
        });

        modalInstance.result.then(function (selectedItem) {
            $scope.selected = selectedItem;
        }, function () {
            $log.info('Modal dismissed at: ' + new Date());
        });
    }
});
app.directive('onFinishRenderFilters', function ($timeout) {
    return {
        restrict: 'A',
        link: function (scope, element, attr) {
            if (scope.$last === true) {
                $timeout(function () {
                    scope.$emit('ngRepeatFinished')
                });
            }

        }
    };
})



