'use strict';
app.controller('echeckBridgeBacklog_controller', ['$scope', '$http', '$modal', function ($scope, $http,$modal) {
    $scope.dataType = [
        {value: '0', name: '常规检测'},
        {value: '1', name: '结构性能'},
        {value: '2', name: '荷载试验'},
    ];
    $scope.backlog = [
        {
            type: '桥梁',
            taskType: '常规检测',
            taskTypeName: '胜利路桥',
            planName: '2019秋季巡查计划2',
            date: '2019-03-01到2019-03-29',
            num: 1
        },
        {
            type: '桥梁',
            taskType: '结构性能检测',
            taskTypeName: '胜利路桥',
            planName: '2019秋季巡查计划2',
            date: '2019-03-01到2019-03-29',
            num: 2
        },
        {
            type: '桥梁',
            taskType: '荷载试验',
            taskTypeName: '胜利路桥',
            planName: '2019秋季巡查计划2',
            date: '2019-03-20到2019-03-29',
            num: 3
        },
    ];
    var modalInstance;
    $scope.addRecord = function (x) {
        if (x.num == 1) {
            modalInstance = $modal.open({
                templateUrl: 'addDqModal.html',
                // controller: 'addDqModalCtrl',
                size: '',
                backdrop: 'static',      
                keyboard: false,
                resolve: {
                    items: function () {
                        return x;
                    }
                }
            });
        }else if(x.num == 2){
            modalInstance = $modal.open({
                templateUrl: 'addJgModal.html',
                // controller: 'addDqModalCtrl',
                size: '',
                backdrop: 'static',      
                keyboard: false,
                resolve: {
                    items: function () {
                        return x;
                    }
                }
            });
        }else if(x.num == 3){
            modalInstance = $modal.open({
                templateUrl: 'addZhModal.html',
                // controller: 'addDqModalCtrl',
                size: '',
                backdrop: 'static',      
                keyboard: false,
                resolve: {
                    items: function () {
                        return x;
                    }
                }
            });
        }

    }
    $scope.addDisease = function (x){
        modalInstance = $modal.open({
            templateUrl: 'addDqBhModal.html',
            // controller: 'addDqModalCtrl',
            size: '',
            backdrop: 'static',      
	        keyboard: false,
            resolve: {
                items: function () {
                    return x;
                }
            }
        });
    }
    $scope.addStructural = function (x){
        modalInstance = $modal.open({
            templateUrl: 'addJgModal.html',
            // controller: 'addDqModalCtrl',
            size: '',
            backdrop: 'static',      
	        keyboard: false,
            resolve: {
                items: function () {
                    return x;
                }
            }
        });
    }

}])