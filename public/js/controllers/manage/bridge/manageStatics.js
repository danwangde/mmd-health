'use strict'

app.controller('manageStaticsCtrl', ['$scope', '$http', '$modal', function ($scope, $http, $modal) {

  $scope.load =async function () {

    /* $("#gridPanel").table2excel({
      exclude  : ".noExl",
      filename : "结算统计-" + new Date().getTime() + ".xls"
    }); */
    let url ='/bigDataStatics/loadStatics?time='+ $scope.start + '&branch_id=' +$scope.unit;
    let res = await $http.get(url);
    console.log(res.data);
    let arr = res.data.split('\\').length;
    let filename = res.data.split('\\')[arr-1];
    var a = document.createElement('a'); 
    a.href = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };
  $scope.start = '2019-08';
  $scope.unit = 4;
  async function branch () {
    let url = '/bigDataStatics/select_branch_all?branch_id='+ JSON.parse(sessionStorage.getItem('msg')).branch_id;
    console.log(url);
    let res = await $http.get(url);
    $scope.branch_data = res.data;
  };
  branch();
  together()
  $scope.search = async function (){
    await together ();
  };
  async function together () {
    let url = '/bigDataStatics/select_manage_statics?time='+ $scope.start + '&branch_id=' +$scope.unit;
    console.log(url)
    let res = await $http.get(url);
    $scope.$apply(function (){
      $scope.maintainInfo = res.data;
      for(let item of $scope.maintainInfo){
        if(item.manage_Sign_time!=='0000-00-00 00:00:00') item.manage_Sign_time = get_date_str(new Date(item.manage_Sign_time));
        if(item.problem_source == '1'){
          item.problem_source = '巡查';
        }else{
          item.problem_source = '检测';
        }
      };
      console.log( $scope.maintainInfo)
    })
  }

 

  
  function get_date_str(Date){
    var Y = Date.getFullYear();
    var M = Date.getMonth() + 1;
    M = M < 10 ? '0' + M : M;// ??????0
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
