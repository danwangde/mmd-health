'use strict';


app.controller('manage_controller', ['$scope', '$window', '$state', function ($scope, $window, $state) {
    $scope.windowWidth = $window.innerWidth;

    $scope.manageData = [
        {
            id: 1,
            path:'app_full.office'
        },
        {
            id: 2,
            path:'app_full.office'
        },
        {id: 3, path:''},
        {id: 4, path: ''},
    ];

    $scope.clickItem = function (item) {

        $state.go($scope.manageData[item].path,{itemId:item});
    };

    $scope.open = function(){
        window.open('http://47.92.89.74:3000/#/access/signin');
    }

    

}]);
