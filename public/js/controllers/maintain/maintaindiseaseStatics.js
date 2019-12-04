'use strict';
app.controller('maintaindiseaseStatics_controller', ['$scope', '$modal', '$http','$filter', '$log', function ($scope, $modal, $http, $filter, $log) {

  [$scope.diseaseTotal, $scope.totalItems, $scope.diseaseTotalNow] = [[], [], []];
  [$scope.currentPage, $scope.itemsPerPage, $scope.maxSize] = [1,12, 3];
  let selectUrl = '/curing/select_disease_statistics?uid='+$scope.app.globalInfo.userid;
  $http.get(selectUrl).then((res) =>{
    $scope.diseaseTotal = res.data;
    for(let item of $scope.diseaseTotal){
      item.Reporting_time = get_date_str(new Date(item.Reporting_time));
    };
    $scope.totalItems = $scope.diseaseTotal.length;
    getCurrentTimes();
  });
  $scope.searchData = {
    facilitiesname: '',
    Reporting_time: ''
  };

  $scope.search = function () {
    $scope.diseaseTotalNow = $filter('diseaseTotal')($scope.diseaseTotal, $scope.searchData.facilitiesname, $scope.searchData.Reporting_time);
    console.log($scope.diseaseTotalNow);
  };

  // 返回当前页对应的数据
  function getCurrentTimes() {

    var start = ($scope.currentPage - 1) * $scope.itemsPerPage;
    $scope.diseaseTotalNow = $scope.diseaseTotal.slice(start, start + $scope.itemsPerPage);
  }

  // 切换分页
  $scope.changePage = function () {
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
    return Y + '-' + M + '-' + D + ' ' + H + ':' + Mi + ':' + S;
  }
}]);
