'use strict';
app.controller('costInformation_controller', ['$scope', '$compile', '$http', '$modal', function ($scope, $compile, $http, $modal) {
  $scope.start = '2019-06';
  $scope.unit = 4;
  async function branch () {
    let url = '/bigDataStatics/select_branch_all?branch_id='+ JSON.parse(sessionStorage.getItem('msg')).branch_id;
    console.log(url);
    let res = await $http.get(url);
    $scope.branch_data = res.data;
  };
  branch();
  together();
  togetherExamine();
  $scope.searchList = async function () {
    await together();
  };
  $scope.searchCost =async function () {
    await togetherExamine ();
  }

  async function together () {
    let url = '/bigDataStatics/select_manage_costInformation?time='+ $scope.start + '&branch_id=' +$scope.unit;
    let res = await $http.get(url);
    $scope.$apply(function () {
      console.log(res.data)
      let listTotal = 0;
      $scope.maintainInfo = res.data;
      for (let item of  $scope.maintainInfo) {
       listTotal += parseInt(item.totalPrice)
      }
      $scope.listTotal = listTotal+'元';
      
    })
  }
  async function togetherExamine () {
    let url = '/bigDataStatics/select_manage_costInformatExamine?time='+ $scope.start + '&branch_id=' +$scope.unit;
    let res = await $http.get(url);
    $scope.$apply(function () {
      console.log(res.data);
      $scope.engineerCost = res.data;
      if(res.data.length>0) {
        $scope.branch = res.data[0].branch;
        $scope.buildUnit = res.data[0].BuildUnit;
      }else{
        $scope.branch = '济南天正道桥养护公司';
        $scope.buildUnit = '中建八局';
      }
      
    
      $scope.reportPrice= $scope.engineerCost.reduce(function (total,currentValue, currentIndex, arr) {
        return Math.round((total + currentValue.YS_COST)*100)/100
      },0);
      $scope.confirmPrice= $scope.engineerCost.reduce(function (total,currentValue, currentIndex, arr) {
        return Math.round((total + currentValue.JG_COST)*100)/100
      },0);
      $scope.reduce =  $scope.reportPrice - $scope.confirmPrice ;
      $scope.upperCostReport = digitUppercase($scope.reportPrice);
      $scope.reduceUpperCost = digitUppercase($scope.reduce);
      $scope.numbers = $scope.engineerCost.length;
    })
  }
  $('#loadExamine').click(function(event) {
     $(".word").wordExport('GongChengZaoJia');
   });
  $scope.loadList =async function () {
    /* $("#gridList").table2excel({
      exclude  : ".noExl",
      filename : "MingXiBiao" +".xls"
    }); */
    let url = '/bigDataStatics/downloadEnd?time='+ $scope.start + '&branch_id=' +$scope.unit;
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
  $scope.loadCost = async function () {
   /*  $("#gridCost").table2excel({
      exclude  : ".noExl",
      filename : "ShenHeDingDanMingXiBiao"+ ".xls"
    }); */
    let url = '/bigDataStatics/downloadFile?time='+ $scope.start + '&branch_id=' +$scope.unit;
    let res = await $http.get(url);
    let arr = res.data.split('\\').length;
    let filename = res.data.split('\\')[arr-1];
    var a = document.createElement('a'); 
    a.href = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }; //
 function digitUppercase(n) {
    var fraction = ['角', '分'];
    var digit = [
      '零', '壹', '贰', '叁', '肆',
      '伍', '陆', '柒', '捌', '玖'
    ];
    var unit = [
      ['元', '万', '亿'],
      ['', '拾', '佰', '仟']
    ];
    var head = n < 0 ? '欠' : '';
    n = Math.abs(n);
    var s = '';
    for (var i = 0; i < fraction.length; i++) {
      s += (digit[Math.floor(n * 10 * Math.pow(10, i)) % 10] + fraction[i]).replace(/零./, '');
    }
    s = s || '整';
    n = Math.floor(n);
    for (var i = 0; i < unit[0].length && n > 0; i++) {
      var p = '';
      for (var j = 0; j < unit[1].length && n > 0; j++) {
        p = digit[n % 10] + unit[1][j] + p;
        n = Math.floor(n / 10);
      }
      s = p.replace(/(零.)*零$/, '').replace(/^$/, '零') + unit[0][i] + s;
    }
    return head + s.replace(/(零.)*零元/, '元')
      .replace(/(零.)+/g, '零')
      .replace(/^整$/, '零元整');
  };

}]);
