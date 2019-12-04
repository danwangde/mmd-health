'use strict'

app.controller('managePatrolStaticsCtrl', ['$scope', '$http', '$modal', function ($scope, $http, $modal) {
  $scope.start = '2019-08';
  $scope.unit = 4;
  async function branch() {
    let url = '/bigDataStatics/select_branch_all?branch_id=' + JSON.parse(sessionStorage.getItem('msg')).branch_id;
    console.log(url);
    let res = await $http.get(url);
    $scope.branch_data = res.data;
  };
  branch();
  together();
  $scope.search = async function () {
    await together();
  }
  async function together() {
    let url = '/curing/select_maintain_statics?time=' + $scope.start + '&branch_id=' + $scope.unit;
    let res = await $http.get(url);
    $scope.$apply(function () {
      $scope.maintain_statics = res.data;

      for (let item of $scope.maintain_statics) {
        if (item.A_Signin_date !== '0000-00-00 00:00:00') {
          item.A_Signin_date = get_date_str(new Date(item.A_Signin_date));
        };
        if (item.B_Signin_date !== '0000-00-00 00:00:00') {
          item.B_Signin_date = get_date_str(new Date(item.B_Signin_date));
        };
      }
    })

    console.log(res.data)
  }

  function get_date_str(Date) {
    var Y = Date.getFullYear();
    var M = Date.getMonth() + 1;
    M = M < 10 ? '0' + M : M; // ??????0
    var D = Date.getDate();
    D = D < 10 ? '0' + D : D;
    var H = Date.getHours();
    H = H < 10 ? '0' + H : H;
    var Mi = Date.getMinutes();
    Mi = Mi < 10 ? '0' + Mi : Mi;
    var S = Date.getSeconds();
    S = S < 10 ? '0' + S : S;
    return Y + '-' + M + '-' + D + ' ' + H + ':' + Mi + ':' + S;
  }

}]);
