'use strict';

/* Controllers */
app.controller('signin_controller', ['$scope', '$http', '$state', '$window', function ($scope, $http, $state, $window) {
    console.log($window.innerHeight)
    $scope.windowHeight = {
        "height": $window.innerHeight + 'px',
        "width" :$window.innerWidth + 'px'
    };
    $scope.user = { username: "", password: "" };
    $scope.loginError = "";

    $scope.login = function () {
        let loginUrl = '/loginCheck?username=' + $scope.user.username + "&password=" + $scope.user.password;
        $http.get(loginUrl)
            .then(function (response) {
                console.log(response.data)
                if (response.data.state == 'ok') {
                    if (response.data.msg.usertype == "0" || response.data.msg.usertype == "1") {
                        sessionStorage.setItem("state", response.data.state);
                        sessionStorage.setItem("msg", JSON.stringify(response.data.msg));
                        $scope.app.globalInfo.manageType = true;
                        $scope.app.globalInfo.userid = response.data.msg.userid;
                        $state.go('first');
                    } else if (response.data.msg.usertype == "2" || response.data.msg.usertype == "3") {
                        sessionStorage.setItem("state", response.data.state);
                        sessionStorage.setItem("msg", JSON.stringify(response.data.msg));
                        $scope.app.globalInfo.manageType = false;
                        $scope.app.globalInfo.userid = response.data.msg.userid;
                        $state.go('app_full.office');
                    } else {
                        console.log(response.data)
                    }

                }
                else if (response.data.state == 'err') {
                    $scope.loginError = response.data.msg;
                }
            }, function (x) {

            }
            );


    };

}]);
