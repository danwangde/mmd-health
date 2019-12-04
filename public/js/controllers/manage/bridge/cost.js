
app.controller('manageBridgeCost_controller', ['$scope', '$http', '$modal', '$log', function ($scope, $http, $modal, $log) {
    $scope.costInfo = [{
        ID: '1',
        diseaseName: '人行道平板碎裂',
        BridgeName: '胜利路桥',
        maintainDept: '天桥区住房和城乡建设局',
        name:'单连春',
        site : '祊河路(与柳青河西路交汇西138米)',
        sum: '110.42',
        time: "2019-03-01"
    },
        {
            ID: '1',
            diseaseName: '人行道平板碎裂',
            BridgeName: '胜利路桥',
            maintainDept: '天桥区住房和城乡建设局',
            name:'单连春',
            site : '祊河路(与柳青河西路交汇西138米)',
            sum: '110.42',
            time: "2019-03-01"
        }];

}])