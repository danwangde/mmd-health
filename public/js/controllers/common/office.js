'use strict';
app.controller('office_controller', ['$scope','$stateParams','$state','$http','$window', function ($scope, $stateParams,$state,$http,$window) {
    $scope.windowHeight = {
        "height": $window.innerHeight + 'px'
    };
    let itemId = $stateParams.itemId;
	console.log( $stateParams.itemId)
    const basicsData = [
       /*  {name: '数据总览', path: '', img: '../img/office_01.png'}, */
        {name: '城市桥梁', path: 'app.manageBridgeIndex', img: '../img/office_02.png',nav:'1',childname:'首页'},
        {name: '市政道路', path: '', img: '../img/office_03.png'},
        {name: '城市隧道', path: '', img: '../img/office_04.png'},
        {name: '管养系统', path: 'app.curing.manageFacility', img: '../img/office_08.png',nav:7},
       /* {name: '检测系统', path: 'app.check.checkTask', img: '../img/office_06.png', nav: 8},*/
        {name: '公共管理', path: 'app.managePublicOffice', img: '../img/office_05.png'},
    ];
    const manageData = [
        // {name: '公共管理', path: 'app.managePublicOffice', img: '../img/office_05.png',nav:'',childname:'部门管理'},
        // {name: '审核管理', path: 'app.manageCheckScheme', img: '../img/office_06.png',nav:'6',childname:'方案审核'},
        {name: '部门考核', path: '', img: '../img/office_07.png'},
        // {name: '电子地图', path: '', img: '../img/office_08.png'}
    ];
    const echeckData = [
        {name: '城市桥梁', path: 'app.echeckPlanStructural', img: '../img/office_02.png', nav: 3,childname:'检测计划'},
        {name: '市政道路', path: '', img: '../img/office_03.png'},
        {name: '城市隧道', path: '', img: '../img/office_04.png'}
    ];
    const maintainData = [
        {name: '城市桥梁', path: 'app.maintainBridgeOrder', img: '../img/office_02.png', nav: 4,childname:'巡查计划'},
        {name: '市政道路', path: '', img: '../img/office_03.png'},
        {name: '城市隧道', path: '', img: '../img/office_04.png'}
    ];
    if (itemId == 0 && JSON.parse(sessionStorage.getItem('msg')).usertype=="0") {
        basicsData[basicsData.length-1].nav = 5;
        $scope.itemData = basicsData;
    }else if(itemId == 0 && JSON.parse(sessionStorage.getItem('msg')).usertype=="1"){
          basicsData[basicsData.length-1].nav = 2;
          $scope.itemData = basicsData;
    } else if (itemId == 1) {
        $scope.itemData = manageData;
    }  else if(JSON.parse(sessionStorage.getItem('msg')).usertype=="2"){
        $scope.itemData = maintainData
    }else if(JSON.parse(sessionStorage.getItem('msg')).usertype=="3"){
        $scope.itemData = echeckData
    }
    $scope.boxNum = $scope.itemData.length;
    $scope.clickItem = function (item) {
        $scope.app.globalInfo.nav = item.nav;
        $scope.app.globalInfo.Bread={};
        $scope.app.globalInfo.Bread.parent=item.name;
        $scope.app.globalInfo.Bread.child=item.childname;
        $scope.app.globalInfo.Bread.grandson="";
        $state.go(item.path)
    };

    $scope.$on('$destroy',async function() {
        let url = '/memo/update_memorandum1';
        let obj = {branch_id: JSON.parse(sessionStorage.getItem('msg')).branch_id};
        let res = await $http.post(url,obj);
        console.log(res.data);
    });
    async function getMemo() {
          let url = '/memo/select_memorandum1?branch_id='+JSON.parse(sessionStorage.getItem('msg')).branch_id;
          await $http.get(url).then((res) => {
              $scope.memoData = res.data[0];
              console.log(res.data)
              if ( res.data.length >0 && $scope.memoData.creat_time !== '0000-00-00 00:00:00') {
                  $scope.showMemo = true;
                  $scope.memoData.creat_time =get_date_str(new Date( $scope.memoData.creat_time))
              }
          });
  
      };
      getMemo();
      // $scope.showMemo = false;
      $scope.close_linkCheck = function () {
          $scope.showMemo = false;
      };
      $scope.$on('$destroy',async function() {
        let url = '/memo/update_memorandum1';
        let res = await $http.post(url,$scope.addInfo);
        console.log(res.data)
    });
    function get_date_str(Date) {
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
    };
}])
