'use strict'
app.controller('managePatrolAssessCtrl', ['$scope', '$http', '$modal','$filter', function ($scope, $http, $modal, $filter) {
  [$scope.patrolInfo, $scope.totalItems, $scope.patrolInfoNow]=[[],[],[]];
  [$scope.currentPage, $scope.itemsPerPage, $scope.maxSize] = [1,12,3];
  // 返回当前页对应的数据
  function getCurrentTimes() {

    var start = ($scope.currentPage - 1) * $scope.itemsPerPage;
    $scope.patrolInfoNow = $scope.patrolInfo.slice(start, start + $scope.itemsPerPage);
  }

  // 切换分页
  $scope.changePage = function() {
    getCurrentTimes();
  };
  function patrolInfoFn(){
    let patrolInfoUrl='/curing/select_home_page?uid='+$scope.app.globalInfo.userid+'&power='+JSON.parse(sessionStorage.getItem('msg')).usertype;
    $http.get(patrolInfoUrl).then(function (req) {
      $scope.patrolInfo=req.data;
      for(let item of req.data){
          if(item.A_Signin_date !== '0000-00-00 00:00:00') {
              item.A_Signin_date = get_date_str(new Date( item.A_Signin_date));
          };

          if(item.B_Signin_date !== '0000-00-00 00:00:00') {
              item.B_Signin_date = get_date_str(new Date( item.B_Signin_date));
          };
      };
      $scope.totalItems = $scope.patrolInfo.length;
      getCurrentTimes();
    })
  }
  patrolInfoFn();
  $scope.load = function () {
    $("#gridPanel").table2excel({
      exclude  : ".noExl", //过滤位置的 css 类名
      filename : "巡查考核-" + new Date().getTime() + ".xls" //文件名称
    });
  };

  $scope.search = function () {
    $scope.patrolInfoNow = $filter('patrolAssess')($scope.patrolInfo, $scope.name, $scope.start,$scope.unit);
    console.log( $scope.patrolInfoNow)
  };
  // 返回当前页对应的数据
  function getCurrentTimes() {

    var start = ($scope.currentPage - 1) * $scope.itemsPerPage;
    $scope.patrolInfoNow = $scope.patrolInfo.slice(start, start + $scope.itemsPerPage);

  }

  // 切换分页
  $scope.changePage = function() {
    getCurrentTimes();
  };

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
    return Y + '-' + M;
  }
}]);
