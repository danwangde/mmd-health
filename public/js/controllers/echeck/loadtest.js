app.controller('loadtestCtrl', ['$scope', '$modalInstance', '$http', 'items', function ($scope, $modalInstance, $http, items) {
    $scope.detail = items.detail[0];
    $scope.num = items.index;
    console.log($scope.detail);
    $scope.detail.Inspection_date = get_date_str(new Date( $scope.detail.Inspection_date ))
    $scope.cancel = function () {
        $modalInstance.dismiss();
    }
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

app.controller('addLoadtestModalCtrl', ['$scope', '$modalInstance', '$http', 'items', function ($scope, $modalInstance, $http, items) {
    $scope.bridgeInfo = items.bridgeInfo;
    $scope.passageInfo = items.passageInfo;
    $scope.planData = items.planData;
    $scope.addLoadData = {
        bridge_id: '',
        plan_id: '',
        Inspection_date: '',
        Filling_person: '',
        Detection_range: '',
        Auditor: '',
        Reviewer: '',
        Detection_Content: '',
        detection_result: '',
        Detection_conclusion: '',
        Reform_scheme: '',
        recommended_measure: '',
        Test_Report: '',
        branch_id: JSON.parse(sessionStorage.getItem('msg')).branch_id
    };

    $scope.saveLoad = function () {
        let fd = new FormData();
        let upload_file = document.getElementById("file1").files[0];
        fd.append('file', upload_file);
        fd.append('bridge_id', $scope.addLoadData.bridge_id);
        fd.append('plan_id', $scope.addLoadData.plan_id);
        fd.append('Inspection_date', $scope.addLoadData.Inspection_date);
        fd.append('Filling_person', $scope.addLoadData.Filling_person);
        fd.append('Detection_range', $scope.addLoadData.Detection_range);
        fd.append('Auditor', $scope.addLoadData.Auditor);
        fd.append('Reviewer', $scope.addLoadData.Reviewer);
        fd.append('Detection_Content', $scope.addLoadData.Detection_Content);
        fd.append('detection_result', $scope.addLoadData.detection_result);
        fd.append('Detection_conclusion', $scope.addLoadData.Detection_conclusion);
        fd.append('Reform_scheme', $scope.addLoadData.Reform_scheme);
        fd.append('recommended_measure', $scope.addLoadData.recommended_measure);
        fd.append('Test_Report', $scope.addLoadData.Test_Report);
        fd.append('branch_id', $scope.addLoadData.branch_id);
        $http.post('/Testing/insert_load', fd, {
            headers: {
                'Content-Type': undefined
            },
            transformRequest: angular.identity
        }).then(function (req) {
            console.log(req.data)
            if (req.data == 1) {
                $modalInstance.close();
                alert('新增成功');
            }
        });


    }

}]);


app.controller('updateLoadCtrl', ['$scope', '$modalInstance', '$http', 'items', function ($scope, $modalInstance, $http, items) {

    $scope.detail = items.detail[0];
    $scope.bridgeInfo = items.bridgeInfo;
    for (let item of $scope.bridgeInfo) {
        if ($scope.detail.bridgename == item.BridgeName) {
            item.select = true;
        } else {
            item.select = false;
        }
    };
    $scope.passageInfo = items.passageInfo;
    $scope.planData = items.planData;
    for (let item of $scope.planData) {
        if ($scope.detail.plan_id == item.id) {
            item.select = true;
        } else {
            item.select = false;
        }
    };
    console.log($scope.planData)


    console.log($scope.detail)

    $scope.cancel = function () {
        $modalInstance.dismiss();
    }
    $scope.saveLoad = function () {
        let fd = new FormData();
        let upload_file = document.getElementById("file1").files[0];
        fd.append('file', upload_file);
        fd.append('bridge_id', $scope.detail.bridge_id);
        fd.append('plan_id', $scope.detail.plan_id);
        fd.append('Inspection_date', $scope.detail.Inspection_date);
        fd.append('Filling_person', $scope.detail.Filling_person);
        fd.append('Detection_range', $scope.detail.Detection_range);
        fd.append('Auditor', $scope.detail.Auditor);
        fd.append('Reviewer', $scope.detail.Reviewer);
        fd.append('Detection_Content', $scope.detail.Detection_Content);
        fd.append('detection_result', $scope.detail.detection_result);
        fd.append('Detection_conclusion', $scope.detail.Detection_conclusion);
        fd.append('Reform_scheme', $scope.detail.Reform_scheme);
        fd.append('recommended_measure', $scope.detail.recommended_measure);
        fd.append('Test_Report', $scope.detail.Test_Report);
        fd.append('branch_id', $scope.detail.branch_id);
        fd.append('id', items.item.id);
        $http.post('/Testing/update_load', fd, { headers: { 'Content-Type': undefined }, transformRequest: angular.identity }).then(function (req) {
            console.log(req.data)
            if (req.data == 1) {
                $modalInstance.close();
                alert('修改成功');
            }
        });

    }

}]);

app.controller('manageBridgeLoadtest_controller', ['$scope', '$http', '$filter', '$modal', '$log', function ($scope, $http, $filter, $modal, $log) {
    $scope.ok = async function (item) {
        if(confirm('确定要提交本次荷载检测数据吗？')){
            let url = '/Testing/update_state?small_id=' + item.small_id;
            let res = await $http.get(url);
            if(res.data == 1) {
                alert('提交成功');
                getLoadtest();
            }else{
                alert('提交失败');
            }
        }
    };
    $scope.showLoadtest = async function (x, index) {
        let getLoadtest = '/Testing/select_loadDetail?id=' + x.id;
        await $http.get(getLoadtest).then((res) => {
            $scope.detail = res.data;
            console.log(res.data);
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

    $scope.addLoadtest = async function () {
        let getBridge = '/Testing/select_bri_check?uid=' + $scope.app.globalInfo.userid;
        await $http.get(getBridge).then((res) => {
            $scope.bridgeInfo = res.data;
        });
        let getPassage = '/Testing/select_passage_check?uid=' + $scope.app.globalInfo.userid;
        await $http.get(getPassage).then((res) => {
            $scope.passageInfo = res.data;
            console.log(res.data);
        });
        let getPlan = '/Testing/select_check_plan1?branch_id=' + JSON.parse(sessionStorage.getItem('msg')).branch_id;
        await $http.get(getPlan).then((res) => {
            $scope.planData = res.data;
            console.log(res.data);
        });
        let modalInstance = $modal.open({
            templateUrl: 'addLoadtestModal.html',
            controller: 'addLoadtestModalCtrl',
            size: 'lg',
            backdrop: 'static',      
	        keyboard: false,
            resolve: {
                items: function () {
                    return {
                        bridgeInfo: $scope.bridgeInfo,
                        passageInfo: $scope.passageInfo,
                        planData: $scope.planData
                    }
                }

            }
        });
        modalInstance.result.then(function (fs) {
            getLoadtest();
        })
    };

    $scope.updateLoad = async function (item) {

        let getLoadtest = '/Testing/select_loadDetail?id=' + item.id;
        await $http.get(getLoadtest).then((res) => {
            $scope.detail = res.data;
            console.log(res.data);
        });
        let getBridge = '/Testing/select_bri_check?uid=' + $scope.app.globalInfo.userid;
        await $http.get(getBridge).then((res) => {
            $scope.bridgeInfo = res.data;
        });
        let getPassage = '/Testing/select_passage_check?uid=' + $scope.app.globalInfo.userid;
        await $http.get(getPassage).then((res) => {
            $scope.passageInfo = res.data;
            console.log(res.data);
        });
        let getPlan = '/Testing/select_check_plan1?branch_id=' + JSON.parse(sessionStorage.getItem('msg')).branch_id;
        await $http.get(getPlan).then((res) => {
            $scope.planData = res.data;
            console.log(res.data);
        });
        var modalInstance = $modal.open({
            templateUrl: 'updateLoad.html',
            controller: 'updateLoadCtrl',
            size: 'lg',
            backdrop: 'static',      
	        keyboard: false,
            resolve: {
                items: function () {
                    return {
                        item: item,
                        bridgeInfo: $scope.bridgeInfo,
                        passageInfo: $scope.passageInfo,
                        planData: $scope.planData,
                        detail: $scope.detail
                    }
                }

            }
        });

        modalInstance.result.then(function (selectedItem) {
            window.location.reload()
        }, function () {
            $log.info('Modal dismissed at: ' + new Date());
        });
    };

    $scope.delBtn = async function (x) {
        console.log(x)
        let delUrl = '/Testing/delete_load?id=' + x.id;
        $http.get(delUrl).then((res) => {
            if (res.data == 1) {
                alert("删除成功");
            } else {
                alert("删除失败");
            };
        });
        getLoadtest();
    };

    [$scope.loadTestInfo, $scope.totalItems, $scope.loadTestInfoNow] = [[], [], []];
    [$scope.currentPage, $scope.itemsPerPage, $scope.maxSize] = [1, 12, 3];
    async function getLoadtest() {
        let getLoadUrl = '/Testing/select_load_check?uid=' + $scope.app.globalInfo.userid;
        await $http.get(getLoadUrl).then((res) => {
            console.log(res.data);
            $scope.loadTestInfo = res.data;
            $scope.totalItems = $scope.loadTestInfo.length;
            getCurrentTimes();
            for (let item of $scope.loadTestInfo) {

                if (item.Inspection_date == null) {
                    item.Inspection_date = '';
                } else {

                    item.Inspection_date = get_date_str(new Date(item.Inspection_date));
                }
            }
        })
    };
    getLoadtest();

    $scope.search = function () {
        $scope.loadTestInfoNow = $filter('loadtest')($scope.loadTestInfo, $scope.projectName, $scope.reviever, $scope.date);
    };
    // 返回当前页对应的数据
    function getCurrentTimes() {

        var start = ($scope.currentPage - 1) * $scope.itemsPerPage;
        $scope.loadTestInfoNow = $scope.loadTestInfo.slice(start, start + $scope.itemsPerPage);
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