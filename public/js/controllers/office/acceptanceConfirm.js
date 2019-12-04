'use strict';
app.controller('ModalInstanceCtrl', ['$scope', '$modalInstance', 'items', '$modal', '$log', '$http', function ($scope, $modalInstance, items, $modal, $log, $http) {

  let step = new Map();
  step.set('病害上报', '0');
  step.set('工单派发', '1');
  step.set('竣工申报', '2');
  step.set('验收确认', '3');
  console.log(items);
  $scope.disdetails = items.disdetails;
  $scope.quantityList = items.quantityList;
  $scope.confirmData = items.confirmData;
  $scope.reportData = items.reportData;
  $scope.completeData = items.completeData;
  $scope.title = items.stepID;
  console.log($scope.title);
  $scope.reportData.stepID = step.get(items.stepID);
  console.log($scope.reportData.stepID)
  $scope.reportData.Reporting_time = get_date_str(new Date($scope.reportData.Reporting_time));

  $scope.cancel = function () {
    $modalInstance.dismiss('cancle');
  }
  for (let item of $scope.quantityList) {
    item.total = (item.Unit_Price * item.Check_num).toFixed(2);
  };
  let totalCost = 0;
  for (let item of $scope.quantityList) {
    totalCost += parseFloat(item.total);
  };
  $scope.totalCost = totalCost.toFixed(2);
  $scope.addConfirm = async function () {
    $scope.confirmData.Odd_Numbers = items.reportData.Odd_Numbers;
    //$scope.confirmData.Cost = $scope.totalCost;
    let url = '/curing/insert_Check';
    let res = await $http.post(url, $scope.confirmData)
    if (res.data == 1) {
      $modalInstance.dismiss('cancle');
      alert('已确认');
    } else {
      alert('确认失败');
    }
  }

  $scope.sellBtn = async function () {
    let getWorkOrder = '/curing/select_WorkOrder?Odd_Numbers=' + $scope.reportData.Odd_Numbers;
    await $http.get(getWorkOrder).then((res) => {
      $scope.sell = res.data[0];
      for (let item of res.data) {
        if (item.send_time !== '0000-00-00 00:00:00' || item.time_limit !== '0000-00-00 00:00:00') {
          item.send_time = get_date_str(new Date(item.send_time));
          item.time_limit = get_date_str(new Date(item.time_limit));
        }

      }
      $scope.sell.curingCuit = items.reportData.branch;
      $scope.sell.Odd_Numbers = items.reportData.Odd_Numbers;

    })
  }

  $scope.addSell = async function () {
    $scope.sell.send_time = get_date_str(new Date());
    let sellUrl = '/curing/insert_WorkOrder';

    $http.post(sellUrl, $scope.sell).then((res) => {
      if (res.data == 1) {
        $modalInstance.close();
        alert('工单派发成功');
      } else {
        alert('工单派发失败');
      }
    });
  }

  $scope.showImg = function () {
    let modalInstance = $modal.open({
      templateUrl: 'image.html',
      controller: 'imageModalCtrl',
      size: 'lg',
      backdrop: 'static',      
      keyboard: false,
      resolve: {
        items: function () {
          return {
            disdetails: 1
          }
        }

      }
    });

    modalInstance.result.then(function (selectedItem) {
      $scope.selected = selectedItem;
    }, function () {
      $log.info('Modal dismissed at: ' + new Date());
    });
  }



  $scope.openModal = async function () {

    let modalInstance = $modal.open({
      templateUrl: 'disdescModal.html',
      controller: 'disdescModalCtrl',
      size: 'lg',
      backdrop: 'static',      
      keyboard: false,
      resolve: {
        items: function () {
          return {
            disdetails: $scope.disdetails
          }
        }

      }
    });

    modalInstance.result.then(function (selectedItem) {
      $scope.selected = selectedItem;
    }, function () {
      $log.info('Modal dismissed at: ' + new Date());
    });
  }


  $scope.openList = async function () {
    let modalInstance = $modal.open({
      templateUrl: 'disdescList.html',
      controller: 'disdescListCtrl',
      size: 'lg',
      backdrop: 'static',      
      keyboard: false,
      resolve: {
        items: function () {
          return {
            quantityList: $scope.quantityList
          }
        }

      }
    });

    modalInstance.result.then(function (selectedItem) {
      $scope.selected = selectedItem;
    }, function () {
      $log.info('Modal dismissed at: ' + new Date());
    });
  };

  $scope.submitImage = async function () {
    let imageUrl = '/Curing/select_photo?baseinfo_id=' + $scope.reportData.id + '&photo_type=0';
    await $http.get(imageUrl).then((res) => {
      $scope.items = res.data;
    });
    let modalInstance = $modal.open({
      templateUrl: 'image.html',
      controller: 'imageModalCtrl',
      size: 'lg',
      backdrop: 'static',      
      keyboard: false,
      resolve: {
        items: function () {
          return {
            stepID: 0,
            items: $scope.items,
            id: $scope.reportData.id
          }
        }

      }
    });

    modalInstance.result.then(function (selectedItem) {
      $scope.selected = selectedItem;
    }, function () {
      $log.info('Modal dismissed at: ' + new Date());
    });
  };

  $scope.submitImageCom = async function () {
    let imageUrl = '/Curing/select_photo?baseinfo_id=' + $scope.reportData.id + '&photo_type=1';
    await $http.get(imageUrl).then((res) => {
      $scope.items = res.data;
    });
    let modalInstance = $modal.open({
      templateUrl: 'image.html',
      controller: 'imageModalCtrl',
      size: 'lg',
      backdrop: 'static',      
      keyboard: false,
      resolve: {
        items: function () {
          return {
            stepID: 1,
            items: $scope.items,
            id: $scope.reportData.id
          }
        }

      }
    });

    modalInstance.result.then(function (selectedItem) {
      $scope.selected = selectedItem;
    }, function () {

    });
  };
  $scope.openTotalImage = async function () {
    let imageUrl = '/Curing/select_photo_total?baseinfo_id=' + $scope.reportData.id;;
    await $http.get(imageUrl).then((res) => {
      $scope.items = res.data;
    })
    let modalInstance = $modal.open({
      templateUrl: 'image.html',
      controller: 'imageModalCtrl',
      size: 'lg',
      backdrop: 'static',      
      keyboard: false,
      resolve: {
        items: function () {
          return {
            stepID: 2,
            items: $scope.items,
            id: $scope.reportData.id
          }
        }

      }
    });

    modalInstance.result.then(function (selectedItem) {
      $scope.selected = selectedItem;
    }, function () {

    });
  };






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


}]);


app.controller('imageModalCtrl', ['$scope', '$modalInstance', 'items', '$modal', '$http', '$log', function ($scope, $modalInstance, items, $modal, $http, $log) {
  $scope.cancel = function () {
    $modalInstance.close();
  }
  $scope.stepID = items.stepID;
  $scope.id = items.id;
  $scope.items = items.items;
  $scope.addImage = async function () {
    let fd = new FormData();
    let upload_file = document.getElementById("file1").files[0];
    fd.append('file', upload_file);
    fd.append('photo_type', $scope.stepID);
    fd.append('baseinfo_id', $scope.id);
    $http.post('/Curing/insert_photo', fd, { headers: { 'Content-Type': undefined }, transformRequest: angular.identity }).then(function (req) {
      if (req.data == 1) {
        $modalInstance.close();
        alert('新增成功');
      }
    });

  };

  $scope.num = 0;

  $scope.changeImg = function (item) {
    $scope.num = item;
    $scope.path = $scope.items[$scope.num].photo_name;

  };

}]);

app.controller('disdescListCtrl', ['$scope', '$modalInstance', 'items', '$modal', '$log', function ($scope, $modalInstance, items, $modal, $log) {

  $scope.quantityList = items.quantityList;
  console.log(items)
  for (let item of $scope.quantityList) {
    item.total = (item.Unit_Price * item.Check_num).toFixed(2);
  }
  let declareNum = 0;
  let checkNum = 0;
  let totalCost = 0;
  for (let item of $scope.quantityList) {
    declareNum += item.declare_num;
    checkNum += item.Check_num;
    totalCost += parseFloat(item.total);
  }
  $scope.declareNum = declareNum;
  $scope.checkNum = checkNum;
  $scope.totalCost = totalCost.toFixed(2);


}]);

app.controller('disdescModalCtrl', ['$scope', '$modalInstance', 'items', '$modal', '$log', function ($scope, $modalInstance, items, $modal, $log) {


  $scope.disdetail = items.disdetails;
  let sum1 = 0;
  let sum2 = 0;
  let sum3 = 0;
  let sum4 = 0;
  for (let item of $scope.disdetail) {

    sum1 += item.Reported_quantity;
    sum2 += item.Distribution_quantity;
    sum3 += item.Declared_quantity;
    sum4 += item.Audit_quantity;
  }

  $scope.num1 = sum1;
  $scope.num2 = sum2;
  $scope.num3 = sum3;
  $scope.num4 = sum4;


  $scope.cancel = function () {
    $modalInstance.dismiss('cancel');
  };

}]);
app.controller('acceptanceConfirm_controller', ['$scope', '$http', '$modal', '$filter', '$log', function ($scope, $http, $modal, $filter, $log) {
  [$scope.diseaseInfo, $scope.totalItems, $scope.diseaseInfoNow] = [[], [], []];
  [$scope.currentPage, $scope.itemsPerPage, $scope.maxSize] = [1, 12, 3];
  // 返回当前页对应的数据
  function getCurrentTimes() {

    var start = ($scope.currentPage - 1) * $scope.itemsPerPage;
    $scope.diseaseInfoNow = $scope.diseaseInfo.slice(start, start + $scope.itemsPerPage);
  };

  // 切换分页
  $scope.changePage = function () {
    getCurrentTimes();
  };
  async function getData() {
    let gethome = '/curing/select_unconfirm?uid=' + $scope.app.globalInfo.userid + '&power=' + JSON.parse(sessionStorage.getItem('msg')).usertype;
    let res = await $http.get(gethome);
    let step = new Map();
    step.set('0', '病害上报');
    step.set('1', '工单派发');
    step.set('2', '竣工申报');
    step.set('3', '验收确认');
    res.data = res.data.map((item) => {
      item.StepID = step.get(item.StepID);
      return item
    });
    $scope.$apply(() => {
      res.data = res.data.sort(compare('Reporting_time',false));
      $scope.diseaseInfo = res.data;

      console.log($scope.diseaseInfo);
      for (let item of res.data) {
        item.Reporting_time = get_date_str(new Date(item.Reporting_time));
      }
      $scope.totalItems = $scope.diseaseInfo.length;
      getCurrentTimes();
    })

  }
  getData();
  $scope.searchData = {
    oddNumbers: '',
    number: '',
    oddStatus: ''
  };
  let step = new Map();
  step.set('0', '病害上报');
  step.set('1', '工单派发');
  step.set('2', '竣工申报');
  step.set('3', '验收确认');
  $scope.changeStatus = async function () {
    if ($scope.searchData.oddStatus == '0') {
      let getcomfirms = '/curing/select_unconfirm?uid=' + $scope.app.globalInfo.userid + '&power=' + JSON.parse(sessionStorage.getItem('msg')).usertype;
      await $http.get(getcomfirms).then((res) => {
        res.data = res.data.map((item) => {
          item.StepID = step.get(item.StepID);
          return item
        });

        $scope.diseaseInfo = res.data;
        console.log($scope.diseaseInfo);
        for (let item of res.data) {
          item.Reporting_time = get_date_str(new Date(item.Reporting_time));
        }
        $scope.diseaseInfoNow = $filter('order')($scope.diseaseInfo, $scope.searchData.oddNumbers, $scope.searchData.number);

      })
    } else if ($scope.searchData.oddStatus == '1') {
      let getcomfirms = '/curing/select_confirms?uid=' + $scope.app.globalInfo.userid + '&power=' + JSON.parse(sessionStorage.getItem('msg')).usertype;
      await $http.get(getcomfirms).then((res) => {
        res.data = res.data.map((item) => {
          item.StepID = step.get(item.StepID);
          return item
        });
        res.data = res.data.sort(compare('Reporting_time',false));
        $scope.diseaseInfo = res.data;

        console.log($scope.diseaseInfo);
        for (let item of res.data) {
          item.Reporting_time = get_date_str(new Date(item.Reporting_time));
        }
        $scope.diseaseInfoNow = $filter('order')($scope.diseaseInfo, $scope.searchData.oddNumbers, $scope.searchData.number);

      })
    }else if ($scope.searchData.oddStatus == '2') {
      let getcomfirms = '/curing/select_confirm_false?uid=' + $scope.app.globalInfo.userid + '&power=' + JSON.parse(sessionStorage.getItem('msg')).usertype;
      await $http.get(getcomfirms).then((res) => {
        res.data = res.data.map((item) => {
          item.StepID = step.get(item.StepID);
          return item
        });

        $scope.diseaseInfo = res.data;
        res.data = res.data.sort(compare('Reporting_time',false));
        console.log($scope.diseaseInfo);
        for (let item of res.data) {
          item.Reporting_time = get_date_str(new Date(item.Reporting_time));
        }
        $scope.diseaseInfoNow = $filter('order')($scope.diseaseInfo, $scope.searchData.oddNumbers, $scope.searchData.number);

      })
    }

  };
  $scope.search = async function () {
    console.log(111)
    $scope.diseaseInfoNow = $filter('order')($scope.diseaseInfo, $scope.searchData.oddNumbers, $scope.searchData.number);
  };

  $scope.clickOrder = async function (item) {
    console.log(item)

    let getReport = '/curing/select_Report?uid=' + $scope.app.globalInfo.userid + '&power=' + JSON.parse(sessionStorage.getItem('msg')).usertype + '&id=' + item.id;

    await $http.get(getReport).then((res) => {
      $scope.reportData = res.data[0];
    });
    let getDetails = '/curing/select_disease?id=' + $scope.reportData.id;
    await $http.get(getDetails).then((res) => {
      $scope.disdetails = res.data;
    })


    $scope.id = $scope.disdetails.map((item) => {
      return item.id;
    })
    $scope.reportId = {
      id: $scope.id
    };
    let getList = '/curing/select_list?id=' + $scope.reportData.id;
    await $http.get(getList).then((res) => {
      $scope.quantityList = res.data;
    });
    let getComplete = '/curing/complete?Odd_Numbers=' + $scope.reportData.Odd_Numbers;
    await $http.get(getComplete).then((res) => {
      $scope.completeData = res.data[0];
      for (let item of res.data) {
        if (item.Reporting_time !== '0000-00-00 00:00:00' || item.Completion_time !== '0000-00-00 00:00:00') {
          item.Reporting_time = get_date_str(new Date(item.Reporting_time));
          item.Completion_time = get_date_str(new Date(item.Completion_time));
        }


      }
    })
    let getConfirm = '/curing/select_confirm?Odd_Numbers=' + $scope.reportData.Odd_Numbers;
    await $http.get(getConfirm).then((res) => {
      $scope.confirmData = res.data[0];
      for (let item of res.data) {
        if (item.curing_Sign_time !== '0000-00-00 00:00:00' || item.manage_Sign_time !== '0000-00-00 00:00:00') {
          item.curing_Sign_time = get_date_str(new Date(item.curing_Sign_time));
          item.manage_Sign_time = get_date_str(new Date(item.manage_Sign_time));
        }

      };
    })


    var modalInstance = $modal.open({
      templateUrl: 'myModalContent.html',
      controller: 'ModalInstanceCtrl',
      size: 'lg',
      backdrop: 'static',      
      keyboard: false,
      resolve: {
        items: function () {
          return {
            reportData: $scope.reportData,
            disdetails: $scope.disdetails,
            orderData: $scope.orderData,
            quantityList: $scope.quantityList,
            completeData: $scope.completeData,
            confirmData: $scope.confirmData,
            stepID: item.StepID
          }
        }

      }
    });

    modalInstance.result.then(function (selectedItem) {
      $scope.selected = selectedItem;
    }, function () {
      $log.info('Modal dismissed at: ' + new Date());
    });
  };
  function compare(property, desc) {
    return function (a, b) {
        var value1 = a[property];
        var value2 = b[property];
        if (desc == true) {
            return value1.localeCompare(value2);
        } else {
            return value2.localeCompare(value1);
        }
    }
};

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
  }

}])
