app.controller('headerBigdata_controller', ['$scope', '$location','$state', function ($scope, $location, $state) {
    $scope.userName=JSON.parse(sessionStorage.getItem('msg')).username
    $scope.open = function(){
        window.open('http://47.92.89.74:3000/#/access/signin?id=105');
    };

    $scope.usertype = JSON.parse(sessionStorage.getItem('msg')).usertype;
    if ($scope.usertype == '0') {
        $scope.nav = 5;
    }else {
        $scope.nav = 2;
    }
    $scope.goItem = function (item,nav,name,childname) {
        if (item) {
            $scope.app.globalInfo.nav = nav;
            $scope.app.globalInfo.Bread.parent=name;
            $scope.app.globalInfo.Bread.child=childname;
            $scope.app.globalInfo.Bread.grandson="";
            $('.modal-backdrop').remove();
            $('body').removeClass('modal-open');
            $('#myModal').modal('hide');
            $state.go(item);

        }else {
            alert('此功能正在加速开发中！请您莫急！')
        }

    };
}]);



