'use strict';

/* Controllers */
app.controller('updateAccountCtrl', ['$scope', '$rootScope', '$http','items', '$window',  '$state','$modal','$modalInstance',  function ($scope, $rootScope, $http, items, $window,$state, $modal, $modalInstance) {
    $scope.user = {
        username: items.username,
        password:''
    };

    $scope.saveUpdate = async function () {
        let url = '/loginCheck/update_password';
        let res = await $http.post(url,$scope.user);
        if (res.data == 1) {
            alert('修改密码成功');
            $modalInstance.close();
        }

    }
    $scope.cancel = function () {
        $modalInstance.close();
    }
}]);


app.controller('header_controller', ['$scope', '$rootScope', '$http', '$window',  '$state','$modal',  function ($scope, $rootScope, $http, $window,$state, $modal) {
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
    $scope.update = function () {
        let modalInstance =$modal.open({
            templateUrl: 'updateAccount.html',
            controller: 'updateAccountCtrl',
            size: '',
            backdrop: 'static',      
	        keyboard: false,
            resolve: {
                items: function () {
                    return {
                        username:  $scope.userName
                    }
                }
            }
        });
        modalInstance.result.then(function () {
        }, function () {
        });
    }
}]);



