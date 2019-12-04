app.controller('addPlanCtrl', ['$scope', '$modalInstance', 'items', '$http', function ($scope, $modalInstance, items, $http) {
    console.log(items);
    $scope.planData = items.item;
    $scope.bridgeInfo = items.bridgeInfo;
    $scope.passageInfo = items.passageInfo;
    $scope.branchInfo = items.branchInfo;
    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
    $scope.savePlan = function () {
        let fd = new FormData();
        let upload_file = document.getElementById("file1").files[0];
        fd.append('file', upload_file);
        fd.append('plan_type', $scope.planData.plan_type);
        fd.append('facilities_type', $scope.planData.facilities_type);
        fd.append('plan_name', $scope.planData.plan_name);
        fd.append('facilityName', $scope.planData.facilityName);
        fd.append('branch', $scope.planData.branch);
        fd.append('start_time', $scope.planData.start_time);
        fd.append('end_time', $scope.planData.end_time);
        $http.post('/Testing/insert_file', fd, { headers: { 'Content-Type': undefined }, transformRequest: angular.identity }).then(function (req) {
            if (req.data == 1) {
                $modalInstance.close();
                alert('新增成功');
            }
        });

    }


}]);

app.controller('updatePlanCtrl', ['$scope', '$modalInstance', 'items', '$http', function ($scope, $modalInstance, items, $http) {

    console.log(items.item);
    $scope.planData = items.item;
    $scope.bridgeInfo = items.bridgeInfo;
    for (let item of $scope.bridgeInfo) {
        if ($scope.planData.bridgename == item.BridgeName) {
            item.select = true;
        } else {
            item.select = false;
        }
    };

    console.log($scope.bridgeInfo);
    $scope.passageInfo = items.passageInfo;
    for (let item of $scope.passageInfo) {
        if ($scope.planData.PassagewayName == item.PassagewayName) {
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
        let fd = new FormData();
        let upload_file = document.getElementById("file1").files[0];
        fd.append('file', upload_file);
        fd.append('plan_type', $scope.planData.plan_type);
        fd.append('facilities_type', $scope.planData.facilities_type);
        fd.append('plan_name', $scope.planData.plan_name);
        fd.append('facilityName', $scope.planData.facilityName);
        fd.append('branch_id', $scope.planData.branch_id);
        fd.append('start_time', $scope.planData.start_time);
        fd.append('end_time', $scope.planData.end_time);
        fd.append('id', $scope.planData.id);
        fd.append('File_name', $scope.planData.File_name);
        $http.post('/Testing/update_plan', fd, { headers: { 'Content-Type': undefined }, transformRequest: angular.identity }).then(function (req) {
            console.log(req.data);
            if (req.data == 1) {
                $modalInstance.close();
                alert('修改成功')
            }
        });

    }


}]);
app.controller('manageBridgePlan_controller', ['$scope', '$http','$filter', '$modal', '$log', function ($scope, $http,$filter, $modal, $log) {

    $scope.addPlan = async function (item) {
        console.log(item);

        let getBridge = '/Testing/select_bri?uid=' + $scope.app.globalInfo.userid;
        await $http.get(getBridge).then((res) => {
            $scope.bridgeInfo = res.data;
        });
        console.log($scope.app.globalInfo)
        let getPassage = '/Testing/select_passage?uid=' + $scope.app.globalInfo.userid;
        await $http.get(getPassage).then((res) => {
            $scope.passageInfo = res.data;
            console.log(res.data);
        });
        let getBranch = '/Testing/select_branchs?id=' + JSON.parse(sessionStorage.getItem('msg')).branch_id;
        await $http.get(getBranch).then((res) => {
            $scope.branchInfo = res.data;
        });
        item.plan_type = '';
        item.facilities_type = '';
        item.facilityName = '';
        item.plan_name = '';
        item.branch = '';
        item.File_name = '';
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

    $scope.updatePlan = async function (item) {
        console.log(item);

        let getBridge = '/Testing/select_bri?uid=' + $scope.app.globalInfo.userid;
        await $http.get(getBridge).then((res) => {
            $scope.bridgeInfo = res.data;
        });
        let getPassage = '/Testing/select_passage?uid=' + $scope.app.globalInfo.userid;
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

    $scope.delPlan = async function (x) {
        let delUrl = '/Testing/delete_plan?id=' + x.id;
        let res = await $http.get(delUrl);
        if (res.data == 1) {
            alert("删除成功");
        } else {
            alert("删除失败");
        };
        getPlanData();
    }

    [$scope.planInfo, $scope.totalItems, $scope.planInfofoNow] = [[], [], []];
    [$scope.currentPage, $scope.itemsPerPage, $scope.maxSize] = [1, 12, 3];
    async function getPlanData() {
        let getPlanUrl = '/Testing/select_small?branch_id=' + JSON.parse(sessionStorage.getItem('msg')).branch_id;
        await $http.get(getPlanUrl).then((res) => {
            console.log(res.data);
            $scope.planInfo = res.data;
            $scope.totalItems = $scope.planInfo.length;
            getCurrentTimes();
            for (let item of $scope.planInfo) {
                if(item.facilities_type=='0'){
                    item.facilities_type = '常规检测';
                }else{
                    item.facilities_type = '荷载试验';
                };
                if (item.plan_type == 0) {
                    item.plan_type = '桥梁';
                    item.facilityName = item.bridgename;
                } else {
                    item.plan_type = '人行通道';
                    item.facilityName = item.PassagewayName;
                };
                item.start_time = get_date_str(new Date(item.start_time));
                item.end_time = get_date_str(new Date(item.end_time));
            }

        })
    };
    getPlanData();

    
    $scope.search = function () {
        
        $scope.planInfoNow = $filter('plan')($scope.planInfo, $scope.type,$scope.name);
    };
    // 返回当前页对应的数据
    function getCurrentTimes() {
        var start = ($scope.currentPage - 1) * $scope.itemsPerPage;
        $scope.planInfoNow= $scope.planInfo.slice(start, start + $scope.itemsPerPage);
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

}])