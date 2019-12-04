'use strict';

app.controller('structureCtrl', ['$scope', '$modalInstance', '$http', '$modal','$location', 'items', function ($scope, $modalInstance, $http, $modal, $location, items) {
  $scope.path = $location.url();
  $scope.type = JSON.parse(sessionStorage.getItem('msg')).usertype;
  $scope.structureInfo = items.structureInfo;
  async function getStruct() {
    let getStructure = '/Testing/select_structure?uid=' + JSON.parse(sessionStorage.getItem('msg')).userid + '&Facility_type=' + items.x.Facility_type + '&id=' + items.x.id;

    await $http.get(getStructure).then((res) => {
      $scope.structureInfo = res.data;
    });
  };
  $scope.cancel = function () {
    $modalInstance.dismiss()
  }

  getStruct();
  $scope.open = async function (x) {

    let getStructUrl = '/Testing/select_Structural_details?Odd_Numbers=' + x.Odd_Numbers + '&id=' + x.id;
    await $http.get(getStructUrl).then((res) => {
      $scope.dataInfo = res.data;
    });
    let modalInstance = $modal.open({
      templateUrl: 'structureDetail.html',
      controller: 'structureDetailCtrl',
      size: '',
      backdrop: 'static',      
      keyboard: false,
      resolve: {
        items: function () {
          return {
            dataInfo: $scope.dataInfo

          }
        }

      }
    });
    modalInstance.result.then(function (fs) {
    })
  };
  $scope.item = {
    Facility_type: '',
    Facility_id: '',
    component: '',
    type: '',
    diameter: '',
    steel_min: '',
    steel_max: '',
    steel_avg: '',
    steel_set_up: '',
    protect_min: '',
    protect_max: '',
    protect_avg: '',
    protect_set_up: '',
    protect_Features: '',
    protect_evaluate: '',
    avg: '',
    evaluate: '',
    test_method: '',
    Strength: '',
    Design: '',
    Hevaluate: '',
    Lmin: '',
    Lmax: '',
    Levaluate: '',
    Dmin: '',
    Dmax: '',
    Devaluate: '',
    Gmin: '',
    Gmax: '',
    Gevaluate: ''
  };
  $scope.addStruct = async function (x) {
    $scope.item.Odd_Numbers = items.x.Odd_Numbers;
    $scope.item.id = items.x.id;

    let modalInstance = $modal.open({
      templateUrl: 'addStruct.html',
      controller: 'addStructCtrl',
      size: '',
      backdrop: 'static',      
      keyboard: false,
      resolve: {
        items: function () {
          return {
            item: x,
            bridgeInfo: items.bridgeInfo,
            passageInfo: items.passageInfo
          }
        }
      }
    });
    modalInstance.result.then(function (fs) {
      getStruct();
    })
  };

  $scope.updateStruct = async function (x) {
    let getStructUrl = '/Testing/select_Structural_details?Odd_Numbers=' + x.Odd_Numbers + '&id=' + x.id;
    await $http.get(getStructUrl).then((res) => {
      $scope.dataInfo = res.data;
    });


    let modalInstance = $modal.open({
      templateUrl: 'updateStruct.html',
      controller: 'updateStructCtrl',
      size: '',
      backdrop: 'static',      
      keyboard: false,
      resolve: {
        items: function () {
          return {
            item: x,
            Facility_type: items.x.Facility_type,
            dataInfo: $scope.dataInfo,
            bridgeInfo: items.bridgeInfo,
            passageInfo: items.passageInfo
          }
        }
      }
    });
    modalInstance.result.then(function (fs) {
      getStruct();
    })
  }

  $scope.delStruct = async function (x) {
    let delUrl = '/Testing/delete_struct?id=' + x.id;
    let res = await $http.get(delUrl);
    if (res.data == 1) {
      alert("删除成功");
    } else {
      alert("删除失败");
    };
    getStruct();
  }
}]);
app.controller('structureDetailCtrl', ['$scope', '$modalInstance', '$http', 'items', function ($scope, $modalInstance, $http, items) {

  $scope.reinforced_concrete = items.dataInfo.reinforced_concrete;
  $scope.carbonization = items.dataInfo.carbonization;
  $scope.concrete_strength = items.dataInfo.concrete_strength;
  $scope.chloride_ion = items.dataInfo.chloride_ion;
  $scope.resistivity = items.dataInfo.resistivity;
  $scope.potential = items.dataInfo.potential;
}]);

app.controller('addRegularCtrl', ['$scope', '$modalInstance', '$http', 'items', function ($scope, $modalInstance, $http, items) {


}]);

app.controller('regularDetailCtrl', ['$scope', '$modalInstance', '$http', 'items', function ($scope, $modalInstance, $http, items) {

  $scope.regularDetail = items.regularDetail;
  $scope.cancel = function () {
    $modalInstance.dismiss('cancel');
  };

}]);

app.controller('addStructCtrl', ['$scope', '$modalInstance', '$http', 'items', function ($scope, $modalInstance, $http, items) {
  $scope.structData = items.item;
  $scope.bridgeInfo = items.bridgeInfo;
  $scope.passageInfo = items.passageInfo;
  $scope.arrData = [];
  $scope.getComponent = async function () {
    let url = '/Testing/select_struct?uid=' + JSON.parse(sessionStorage.getItem('msg')).userid + '&BridgeID=' + $scope.structData.Facility_id;
    await $http.get(url).then((res) => {

      $scope.component = res.data;
      let data = [];
      $scope.arr = [];
      $scope.str = '';
      for (let item of $scope.component) {
        data = Object.keys(item).map((key) => {
          return item[key];
        });
        $scope.arr.push(data)
      };

      for (let item of $scope.arr) {
        $scope.str = item.join("-");
        $scope.arrData.push($scope.str);

      };

    })
  }

  $scope.addSaveStruct = async function () {
    let addUrl = '/Testing/insert_struct';
    await $http.post(addUrl, $scope.structData).then((res) => {
      if (res.data == 1) {
        $modalInstance.close();
        alert('新增成功');
      }
    })
  }

  $scope.cancel = function () {
    $modalInstance.dismiss('cancel');
  };
}]);


app.controller('updateStructCtrl', ['$scope', '$modalInstance', '$http', 'items', function ($scope, $modalInstance, $http, items) {
  $scope.bridgename = items.item.bridgename;
  $scope.PassagewayName = items.item.PassagewayName;
  $scope.Facility_type = items.Facility_type == '桥梁' ? '0' : "1";
  $scope.reinforced_concrete = items.dataInfo.reinforced_concrete;
  $scope.carbonization = items.dataInfo.carbonization;
  $scope.concrete_strength = items.dataInfo.concrete_strength;
  $scope.chloride_ion = items.dataInfo.chloride_ion;
  $scope.resistivity = items.dataInfo.resistivity;
  $scope.potential = items.dataInfo.potential;
  $scope.bridgeInfo = items.bridgeInfo;
  for (let item of $scope.bridgeInfo) {
    if ($scope.bridgename == item.BridgeName) {
      item.select = true;
    } else {
      item.select = false;
    }
  };
  $scope.passageInfo = items.passageInfo;
  for (let item of $scope.passageInfo) {
    if ($scope.PassagewayName == item.PassagewayName) {
      item.select = true;
    } else {
      item.select = false;
    }
  };


  $scope.addSaveStruct = async function () {

    $scope.updateData = {
      id: items.item.id,
      bridgename: $scope.bridgename,
      PassagewayName: $scope.PassagewayName,
      diameter: $scope.reinforced_concrete[0].diameter,
      steel_min: $scope.reinforced_concrete[0].steel_min,
      steel_max: $scope.reinforced_concrete[0].steel_max,
      steel_avg: $scope.reinforced_concrete[0].steel_avg,
      steel_set_up: $scope.reinforced_concrete[0].steel_set_up,
      protect_min: $scope.reinforced_concrete[0].protect_min,
      protect_max: $scope.reinforced_concrete[0].protect_max,
      protect_avg: $scope.reinforced_concrete[0].protect_avg,
      protect_set_up: $scope.reinforced_concrete[0].protect_set_up,
      protect_Features: $scope.reinforced_concrete[0].protect_Features,
      protect_evaluate: $scope.reinforced_concrete[0].protect_evaluate,
      avg: $scope.carbonization[0].avg,
      strength: $scope.concrete_strength[0].Strength,
      design: $scope.concrete_strength[0].Design,
      Lmin: $scope.chloride_ion[0].min,
      Lmax: $scope.chloride_ion[0].max,
      Dmin: $scope.resistivity[0].min,
      Dmax: $scope.resistivity[0].max,
      Gmin: $scope.potential[0].min,
      Gmax: $scope.potential[0].max
    }
    let addUrl = '/Testing/update_struct';
    await $http.post(addUrl, $scope.updateData).then((res) => {
      if (res.data == 1) {
        $modalInstance.close();
        alert('修改成功');
      }
    })
  }

  $scope.cancel = function () {
    $modalInstance.dismiss('cancel');
  };
}]);

app.controller('diseaseCtrl', ['$scope', '$modalInstance', '$http','$location', 'items', function ($scope, $modalInstance, $http,$location, items) {
  console.log($location.url())
  $scope.path = $location.url();
  $scope.type = JSON.parse(sessionStorage.getItem('msg')).usertype;
  $scope.diseaseInfo = items.diseaseInfo;

  $scope.cancel = function () {
    $modalInstance.dismiss('cancel');
  };
}]);


app.controller('loadtestCtrl', ['$scope', '$modalInstance', '$http', 'items', function ($scope, $modalInstance, $http, items) {
  $scope.detail = items.detail[0];
  $scope.num = items.index;
  $scope.cancel = function () {
    $modalInstance.dismiss('cancel');
  };
}]);
app.controller('echeckStatics_controller', ['$scope', '$http', '$modal', '$location', function ($scope, $http, $modal, $location) {

  $scope.showLoadtest = async function (x, index) {
    let getLoadtest = '/Testing/select_loadDetail?id=' + x.id;
    await $http.get(getLoadtest).then((res) => {
      $scope.detail = res.data;
    });
    let modalInstance = $modal.open({
      templateUrl: 'loadtestModal.html',
      controller: 'loadtestCtrl',
      size: 'lg',
      backdrop: 'static',      
      keyboard: false,
      resolve: {
        items: function () {
          return {
            detail: $scope.detail,
            index: index + 1
          }
        }

      }
    });
    modalInstance.result.then(function (fs) {

    })
  };
  $scope.openRegular = async function (x) {
    let openRegularUrl = '/Testing/select_details_check?Facility_type=' + x.Facility_type + '&uid=' + $scope.app.globalInfo.userid + '&id=' + x.id;

    await $http.get(openRegularUrl).then((res) => {
      $scope.regularDetail = res.data[0];
      $scope.regularDetail.facilityName = x.Facilityname;
    });



    let modalInstance = $modal.open({
      templateUrl: 'regularDetail.html',
      controller: 'regularDetailCtrl',
      size: '',
      backdrop: 'static',      
      keyboard: false,
      resolve: {
        items: function () {
          return {
            regularDetail: $scope.regularDetail
          }
        }

      }
    });
    modalInstance.result.then(function (fs) {
    })
  };
  $scope.openStructure = async function (x) {

    let getBridge = '/Testing/select_bri?uid=' + $scope.app.globalInfo.userid;
    await $http.get(getBridge).then((res) => {
      $scope.bridgeInfo = res.data;
    });
    let getPassage = '/Testing/select_passage?uid=' + $scope.app.globalInfo.userid;
    await $http.get(getPassage).then((res) => {
      $scope.passageInfo = res.data;
    });
    let modalInstance = $modal.open({
      templateUrl: 'structuerModal.html',
      controller: 'structureCtrl',
      size: 'lg',
      backdrop: 'static',      
      keyboard: false,
      resolve: {
        items: function () {
          return {
            x: x,
            structureInfo: $scope.structureInfo,
            bridgeInfo: $scope.bridgeInfo,
            passageInfo: $scope.passageInfo
          }
        }

      }
    });
    modalInstance.result.then(function (fs) {
    })
  }
  $scope.openDisList = async function (x) {
    let getDiseaseUrl = '/regular/select_disease_detection?id=' + x.id + '&Facility_type=' + x.Facility_type;
    await $http.get(getDiseaseUrl).then((res) => {
      $scope.diseaseInfo = res.data;
    })
    let modalInstance = $modal.open({
      templateUrl: 'diseaseModal.html',
      controller: 'diseaseCtrl',
      size: 'lg',
      backdrop: 'static',      
      keyboard: false,
      resolve: {
        items: function () {
          return {
            diseaseInfo: $scope.diseaseInfo
          }
        }

      }
    });
    modalInstance.result.then(function (fs) {
    })
  };

  [$scope.regularData, $scope.totalItems, $scope.regularDataNow] = [[], [], []];
  [$scope.currentPage, $scope.itemsPerPage, $scope.maxSize] = [1, 12, 3];

  async function getRegularData() {
    let getFunc = '/Testing/select_Statistics_check?uid=' + $scope.app.globalInfo.userid+'&power='+JSON.parse(sessionStorage.getItem('msg')).usertype;
    console.log(getFunc)
    await $http.get(getFunc).then((res) => {
      $scope.regularData = res.data;
      console.log( $scope.regularData)
      $scope.totalItems = $scope.regularData.length;
      getCurrentTimes();
      for (let item of res.data) {
        item.Inspection_date = get_date_str(new Date(item.Inspection_date));
        if (item.Facility_type == '0') {
          item.Facility_type = '桥梁';
        } else {
          item.Facility_type = '人行通道';
        }
      };
    })
  }
  getRegularData()
  // 返回当前页对应的数据
  function getCurrentTimes() {

    var start = ($scope.currentPage - 1) * $scope.itemsPerPage;
    $scope.regularDataNow = $scope.regularData.slice(start, start + $scope.itemsPerPage);
  }

  // 切换分页
  $scope.changePage = function () {
    getCurrentTimes();
  };

  $scope.loadBtn = async function () {
    let getLoad = '/Testing/select_Statistics_load_check?uid=' + $scope.app.globalInfo.userid;
    await $http.get(getLoad).then((res) => {
      $scope.loadtestData = res.data;
      console.log( $scope.loadtestData)
      for(let item of res.data){
        if(item.Inspection_date !== '0000-00-00 00:00:00'){
          item.Inspection_date = get_date_str(new Date(item.Inspection_date));
        }
      }

    });
  };

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
    return Y + '-' + M + '-' + D;
  }



}]);
