'use strict';
app.controller('manageFacility_controller', ['$scope', '$compile', '$http', '$modal', function ($scope, $compile, $http, $modal) {
  [$scope.bridge, $scope.totalItems, $scope.bridgeNow] = [[], [], []];
  [$scope.passageway, $scope.totalItems, $scope.passagewayNow] = [[], [], []];
  [$scope.currentPage, $scope.itemsPerPage, $scope.maxSize] = [1, 12, 3];
  // 返回当前页对应的数据
  function getCurrentTimes() {

    var start = ($scope.currentPage - 1) * $scope.itemsPerPage;
    $scope.bridgeNow = $scope.bridge.slice(start, start + $scope.itemsPerPage);
    $scope.passagewayNow = $scope.passageway.slice(start, start + $scope.itemsPerPage);
  };

  // 切换分页
  $scope.changePage = function () {
    getCurrentTimes();
  };
  $scope.type = 0;
  async function getBridge() {
    let getBridgeUrl = '/bridgeInfo/select?userid=' + $scope.app.globalInfo.userid + '&usertype=' + JSON.parse(sessionStorage.getItem('msg')).usertype;
    await $http.get(getBridgeUrl).then(
      function (response) {
        $scope.bridge = response.data;
        $scope.totalItems = $scope.bridge.length;
        getCurrentTimes();
        console.log(response.data)
      }, function (response) {
      }
    )
  };

  async function getPassage() {
    let getPassagewayUrl = '/passagewayinfo/select?userid=' + $scope.app.globalInfo.userid + '&usertype=' + JSON.parse(sessionStorage.getItem('msg')).usertype;
    await $http.get(getPassagewayUrl).then(
      function (response) {
        $scope.passageway = response.data;
        $scope.totalItems = $scope.passageway.length;
        getCurrentTimes();
        console.log(response.data)
      }, function (response) {
      }
    )
  };

  getBridge();
  getPassage();

  $scope.updateFacility = async function (item) {
    let getCuring = '/bridgeInfo/selCuring?manageid=' + $scope.app.globalInfo.userid;
    await $http.get(getCuring).then(function (response) {
      $scope.curingData = response.data;
      console.log(response.data)
    });
    let modalInstance = $modal.open({
      templateUrl: 'addFacility.html',
      controller: 'addFacilityCtrl',
      size: '',
      backdrop: 'static',      
      keyboard: false,
      resolve: {
        data: function () {
          return {
            curingData: $scope.curingData,
            item: item,
            type: $scope.type
          }
        }
      }
    });
    modalInstance.result.then(function () {
      if($scope.type == 0) {
        getBridge();
      }else {
        getPassage();
      }
     
    }, function () {
    });
  }
}]);
app.controller('addFacilityCtrl', ['$scope', '$http', '$modalInstance', 'data', function ($scope, $http, $modalInstance, data) {
  console.log(123);
  $scope.type = data.type;
  $scope.curingData = data.curingData;
  for (let item of $scope.curingData) {
    if (data.item.CuringUnit == item.branch) {
      item.select = true;
    } else {
      item.select = false;
    }
  };
  $scope.update = {
    CuringUnit: ''
  }


  $scope.saveFacility = async function () {
    if ($scope.type == 0) {
      let url = '/bridgeinfo/updateFacility?CuringUnit=' + $scope.update.CuringUnit + '&BridgeID=' + data.item.BridgeID;
      let res = await $http.get(url);
      if (res.data == 1) {
        alert('修改成功');
        $modalInstance.close();
      } else {
        alert('修改失败')
      }
    }else {
      let url = '/bridgeinfo/updateFacility1?CuringUnit=' + $scope.update.CuringUnit + '&PassagewayID=' + data.item.PassagewayID;
      let res = await $http.get(url);
      if (res.data == 1) {
        alert('修改成功');
        $modalInstance.close();
      } else {
        alert('修改失败')
      }
    }


  };
  $scope.cancel = function () {
    $modalInstance.close();
  }
}])
