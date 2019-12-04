app.controller('plan_controller', ['$scope', '$http','$filter', '$modal', function ($scope, $http,$filter, $modal) {
    console.log(111);

    $scope.uid = $scope.app.globalInfo.userid;
    console.log( $scope.uid)
    $scope.openPlan = async function (item) {
        console.log

        let modalInstance = $modal.open({
            templateUrl: 'plan.html',
            controller: 'planCtrl',
            size: 'lg',
            backdrop: 'static',      
	        keyboard: false,
            resolve: {
                items: function () {
                    return {
                        smallData: $scope.smallData,
                        id: item.id
                    }
                }

            }
        });

        modalInstance.result.then(function (selectedItem) {
            getPlanData();
        }, function () {
            //$log.info('Modal dismissed at: ' + new Date());
        });
    };
    $scope.addData = {
        plan_name: '',
        start_time: '',
        end_time: ''
    };
    $scope.addPlan = function (item) {
        if (item.plan_name == '') {
            item.title = 'insert';
        } else {
            item.title = 'update';
        }
        let modalInstance = $modal.open({
            templateUrl: 'addBigPlan.html',
            controller: 'addBigPlanCtrl',
            size: '',
            backdrop: 'static',      
	        keyboard: false,
            resolve: {

                items: function () {
                    return {
                        size: item
                    }
                }

            }
        });

        modalInstance.result.then(function (selectedItem) {
            BigPlan();
            $scope.addData = {
                plan_name: '',
                start_time: '',
                end_time: '',
                uid: JSON.parse(sessionStorage.getItem('msg')).userid
            };
        }, function () {

        });
    };
    $scope.delPlan = async function (item) {
        let delUrl = '/Testing/delete_big_plan?id=' + item.id;
        await $http.get(delUrl).then((res) => {
            if (res.data == 1) {
                alert("删除成功");
            } else {
                alert("删除失败");
            };
            BigPlan();
        })
    };
    [$scope.bigPlanInfo, $scope.totalItems, $scope.bigPlanInfoNow] = [[], [], []];
    [$scope.currentPage, $scope.itemsPerPage, $scope.maxSize] = [1, 12,3];
    async function BigPlan() {
        let getPlan = '/Testing/select_big_plan/?uid=' + $scope.app.globalInfo.userid;
        await $http.get(getPlan).then((res) => {
            console.log(res.data);
            $scope.bigPlanInfo = res.data;
            for(let item of res.data){
                item.start_time = get_date_str(new Date(item.start_time));
                item.end_time = get_date_str(new Date(item.end_time));
            }
            $scope.totalItems = $scope.bigPlanInfo.length;
            getCurrentTimes();
        })
    };
    BigPlan();

    $scope.search = function () {
        console.log(333)
        $scope.bigPlanInfoNow = $filter('planParent')($scope.bigPlanInfo, $scope.planName);
    };

    // 返回当前页对应的数据
    function getCurrentTimes() {

        var start = ($scope.currentPage - 1) * $scope.itemsPerPage;
        $scope.bigPlanInfoNow = $scope.bigPlanInfo.slice(start, start + $scope.itemsPerPage);
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
        return Y + '-' + M + '-' + D;
    }

}]);

app.controller('addBigPlanCtrl', ['$scope', '$http', '$modal', 'items', '$modalInstance', function ($scope, $http, $modal, items, $modalInstance) {
    console.log(items);
    $scope.addData = items.size;
    if (items.size.title == 'insert') {
        $scope.title = '新增计划';
    } else {
        $scope.title = '修改计划';
    };
    if ($scope.title == '新增计划') {

    };

    $scope.cancel = function () {
        $modalInstance.close();
    }
    $scope.saveBigPlan = async function () {

        if ($scope.title == '新增计划') {
            let fd = new FormData();
            let upload_file = document.getElementById("file1").files[0];
            fd.append('file', upload_file);
            fd.append('plan_name', $scope.addData.plan_name);
            fd.append('start_time', $scope.addData.start_time);
            fd.append('end_time', $scope.addData.end_time);
            fd.append('uid', JSON.parse(sessionStorage.getItem('msg')).userid);
            $http.post('/Testing/inset_big_plan', fd, { headers: { 'Content-Type': undefined }, transformRequest: angular.identity }).then(function (req) {
                if (req.data == 1) {
                    $modalInstance.close();
                    alert('新增成功');
                }
            });
        } else {
            let fd = new FormData();
            let upload_file = document.getElementById("file1").files[0];
            fd.append('file', upload_file);
            fd.append('plan_name', $scope.addData.plan_name);
            fd.append('start_time', $scope.addData.start_time);
            fd.append('end_time', $scope.addData.end_time);
            fd.append('id', $scope.addData.id);
            fd.append('file_name', $scope.addData.file_name);
            $http.post('/Testing/update_big_plan', fd, { headers: { 'Content-Type': undefined }, transformRequest: angular.identity }).then(function (req) {
                if (req.data == 1) {
                    $modalInstance.close();
                    alert('修改成功');
                }
            });
        }

    };
}]);

app.controller('addPlanCtrl', ['$scope', '$modalInstance', 'items', '$http', function ($scope, $modalInstance, items, $http) {
    console.log(items);
    $scope.planData = items.item;
    $scope.bridgeInfo = items.bridgeInfo;
    $scope.passageInfo = items.passageInfo;
    $scope.branchInfo = items.branchInfo;
    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
    $scope.savePlan = async function () {
        $http.post('/Testing/insert_file', items.item).then((res) => {
            if (res.data == 1) {
                $modalInstance.close();
                alert('新增成功');
            }
        });
        

    };


}]);

app.controller('updatePlanCtrl', ['$scope', '$modalInstance', 'items', '$http', function ($scope, $modalInstance, items, $http) {

    console.log(items.item);
    $scope.planData = items.item;
    if ($scope.planData.facilities_type == '常规检测') {
        $scope.planData.facilities_type = "0";
    } else {
        $scope.planData.facilities_type = "1";
    };

    if ($scope.planData.plan_type == '桥梁') {
        $scope.planData.plan_type = "0";
    } else {
        $scope.planData.plan_type = "1";
    };

    $scope.bridgeInfo = items.bridgeInfo;
    for (let item of $scope.bridgeInfo) {
        if ($scope.planData.facilitiesid == item.BridgeID) {
            item.select = true;
        } else {
            item.select = false;
        }
    };

    console.log($scope.bridgeInfo);
    $scope.passageInfo = items.passageInfo;
    for (let item of $scope.passageInfo) {
        if ($scope.planData.facilitiesid == item.PassagewayID) {
            item.select = true;
        } else {
            item.select = false;
        }
    };
    $scope.branchInfo = items.branchInfo;
    for (let item of $scope.branchInfo) {
        if ($scope.planData.branch == item.branch) {
            item.select = true;
        } else {
            item.select = false;
        }
    };
    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
    $scope.savePlan = function () {

        $http.post('/Testing/update_small_plan', $scope.planData).then((res) => {
            if (res.data == 1) {
                $modalInstance.close();
                alert('修改成功');
            }
        })

    }


}]);
app.controller('planCtrl', ['$scope', '$http', '$modal', '$log', 'items','$modalInstance', function ($scope, $http, $modal, $log, items,$modalInstance) {

    $scope.uid = JSON.parse(sessionStorage.getItem('msg')).userid;

    $scope.smallData = items.smallData;
    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };

    $scope.addPlan = async function (item) {
        console.log(item);

        let getBridge = '/Testing/select_bri?uid=' + JSON.parse(sessionStorage.getItem('msg')).userid;
        await $http.get(getBridge).then((res) => {
            $scope.bridgeInfo = res.data;
        });
        let getPassage = '/Testing/select_passage?uid=' + JSON.parse(sessionStorage.getItem('msg')).userid;
        await $http.get(getPassage).then((res) => {
            $scope.passageInfo = res.data;
            console.log(res.data);
        });
        let getBranch = '/Testing/select_branchs?id=' + JSON.parse(sessionStorage.getItem('msg')).branch_id;
        await $http.get(getBranch).then((res) => {
            $scope.branchInfo = res.data;
        });
        item.bridge_id = '';
        item.branch_id = '';
        item.plan_type = '';
        item.facilities_type = '';
        item.id = items.id;

        var modalInstance = $modal.open({
            templateUrl: 'addPlan.html',
            controller: 'addPlanCtrl',
            size: '',
            backdrop: 'static',      
	        keyboard: false,
            resolve: {
                items: function () {
                    return {
                        item: item,
                        bridgeInfo: $scope.bridgeInfo,
                        passageInfo: $scope.passageInfo,
                        branchInfo: $scope.branchInfo
                    }
                }

            }
        });

        modalInstance.result.then(function (selectedItem) {
            getPlanData();
        }, function () {
            $log.info('Modal dismissed at: ' + new Date());
        });
    };
    $scope.delSmallPlan = async function (x) {
        console.log(x)
        let delUrl = '/Testing/delete_small_plan?id=' + x.id;
        console.log(delUrl)
        let res = await $http.get(delUrl);
        if (res.data == 1) {
            alert("删除成功");
        } else {
            alert("删除失败");
        };
        getPlanData();
    }

    $scope.updatePlan = async function (item) {
        console.log(item);

        let getBridge = '/Testing/select_bri?uid=' + JSON.parse(sessionStorage.getItem('msg')).userid;
        await $http.get(getBridge).then((res) => {
            $scope.bridgeInfo = res.data;
        });
        let getPassage = '/Testing/select_passage?uid=' + JSON.parse(sessionStorage.getItem('msg')).userid;
        await $http.get(getPassage).then((res) => {
            $scope.passageInfo = res.data;
        });
        let getBranch = '/Testing/select_branchs?id=' + JSON.parse(sessionStorage.getItem('msg')).branch_id;
        await $http.get(getBranch).then((res) => {
            $scope.branchInfo = res.data;
        });
        var modalInstance = $modal.open({
            templateUrl: 'updatePlan.html',
            controller: 'updatePlanCtrl',
            size: '',
            backdrop: 'static',      
	        keyboard: false,
            resolve: {
                items: function () {
                    return {
                        item: item,
                        bridgeInfo: $scope.bridgeInfo,
                        passageInfo: $scope.passageInfo,
                        branchInfo: $scope.branchInfo
                    }
                }

            }
        });

        modalInstance.result.then(function (selectedItem) {
            getPlanData();
        }, function () {
            $log.info('Modal dismissed at: ' + new Date());
        });
    };




    async function getPlanData() {
        let getSmallPlan = '/Testing/select_small_plan?id=' + items.id;
        await $http.get(getSmallPlan).then((res) => {
            console.log(res.data)
            $scope.smallData = res.data;
            for (let item of $scope.smallData) {
                if (item.facilities_type == '0') {
                    item.facilities_type = '常规检测';
                } else {
                    item.facilities_type = '荷载试验';
                };

                if (item.plan_type == '0') {
                    item.plan_type = '桥梁';
                } else {
                    item.plan_type = '人行通道';
                };


            }
        });

    };
    getPlanData();

    /*    [$scope.planInfo, $scope.totalItems, $scope.planInfoNow] = [[], [], []];
       [$scope.currentPage, $scope.itemsPerPage, $scope.maxSize] = [1, 5, 6];
    */
    /*   // 返回当前页对应的数据
      function getCurrentTimes() {
  
          var start = ($scope.currentPage - 1) * $scope.itemsPerPage;
          $scope.planInfoNow = $scope.planInfo.slice(start, start + $scope.itemsPerPage);
      }
  
      // 切换分页
      $scope.changePage = function () {
          getCurrentTimes();
      }; */

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
        return Y + '-' + M + '-' + D;
    }

}])