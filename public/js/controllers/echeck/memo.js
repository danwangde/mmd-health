app.controller('echeckMemo_controller',['$scope','$http',function ($scope,$http) {
    console.log('备忘录');
    
    $scope.memoData = [
        {title:'敏文测试',content:'测试功能',date:'2019-03-28',annexes:'查看附件',status:'已发布'},
        {title:'单位测试002',content:'	测试 测试测试sssss......',date:'2019-03-28',annexes:'查看附件',status:'已发布'},
        {title:'	尽快回复',content:'测试功能',date:'2019-03-28',annexes:'查看附件',status:'已发布'}
    ]
}])