'use strict';


app.controller('ProcessCtrl', ['$scope', '$http', '$modalInstance', 'items', '$modal', function ($scope, $http, $modalInstance, items, $modal) {

    let step = new Map();
    step.set('病害上报', '0');
    step.set('工单派发', '1');
    step.set('竣工申报', '2');
    step.set('验收确认', '3');

    $scope.reportData = items.reportData;

    console.log($scope.reportData.Reporting_time)
    $scope.completeData = items.completeData;


    $scope.confirmData = items.confirmData;
    console.log($scope.reportData);
    $scope.title = $scope.reportData.stepID;
    $scope.reportData.stepID = step.get(items.stepID);
    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
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
        })
    };
    $scope.submitDis = async function () {
        if ($scope.completeData !== undefined) {
            $scope.completeData.Reporting_time = get_date_str(new Date());
        };
        $scope.reportData.Reporting_time = get_date_str(new Date());
        let addSubmit = '/curing/insert_disease';
        let res = await $http.post(addSubmit, $scope.reportData);
        if (res.data == 1) {
            $modalInstance.close();
            alert('病害上报成功');
        } else {
            alert('病害上报失败');
        }
    };
    $scope.completeDeclara = async function () {
        $scope.completeData.Odd_Numbers = $scope.reportData.Odd_Numbers;
        $scope.completeData.Reporting_time = get_date_str(new Date());
        let addComplete = '/curing/insert_finished';
        let res = await $http.post(addComplete, $scope.completeData);
        console.log(res.data);
        if (res.data == 1) {
            $modalInstance.close();
            alert('申报成功');
        } else {
            alert('申报失败');
        }
    };
    $scope.openModal = async function () {
        let modalInstance = $modal.open({
            templateUrl: 'maintainModal.html',
            controller: 'maintainModalCtrl',
            backdrop: false,
            size: 'lg',
            backdrop: 'static',      
	        keyboard: false,
            resolve: {
                items: function () {
                    return {
                        reportData: $scope.reportData
                    }
                }

            }
        });
        modalInstance.result.then(function (selectedItem) {
            $scope.selected = selectedItem;
        }, function () {
            //$log.info('Modal dismissed at: ' + new Date());
        });
    };
    $scope.openList = function () {
        let modalInstance = $modal.open({
            templateUrl: 'disdescList.html',
            controller: 'disdescListCtrl',
            backdrop: false,
            size: 'lg',
            resolve: {
                items: function () {
                    return {
                        id: $scope.reportData.id
                    }
                }

            }
        });
        modalInstance.result.then(function (rs) {
            console.log(rs);
            if ($scope.completeData.length !== 0) {
                $scope.completeData.Cost = rs.message;
            }

        }, function () {
            //$log.info('Modal dismissed at: ' + new Date());
        });
    };

    $scope.usertype = JSON.parse(sessionStorage.getItem('msg')).usertype;
    $scope.submitImage = async function () {
        let imageUrl = '/Curing/select_photo?baseinfo_id=' + $scope.reportData.id + '&photo_type=0';
        await $http.get(imageUrl).then((res) => {
            console.log(res.data);
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
                        stepID: $scope.reportData.stepID,
                        id: $scope.reportData.id,
                        usertype: $scope.usertype,
                        items: $scope.items
                    }
                }

            }
        });

        modalInstance.result.then(function (selectedItem) {
            $scope.selected = selectedItem;
        }, function () {

        });
    };

    $scope.submitImageCom = async function () {
        let imageUrl = '/Curing/select_photo?baseinfo_id=' + $scope.reportData.id + '&photo_type=1';
        await $http.get(imageUrl).then((res) => {
            console.log(res.data);
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
                        id: $scope.reportData.id,
                        usertype: $scope.usertype,
                        items: $scope.items
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

            console.log(res.data);
            $scope.items = res.data;
        })
        console.log(1)
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
                        id: $scope.reportData.id,
                        usertype: $scope.usertype
                    }
                }

            }
        });

        modalInstance.result.then(function (selectedItem) {
            $scope.selected = selectedItem;
        }, function () {

        });
    };
    $scope.cancel = function () {
        $modalInstance.close();
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


app.controller('imageModalCtrl', ['$scope', '$modalInstance', 'items', '$modal', '$http', '$log', function ($scope, $modalInstance, items, $modal, $http, $log) {

    $scope.cancel = function () {
        $modalInstance.close();
    };
    $scope.items = items.items;
    $scope.usertype = items.usertype;
    $scope.stepID = items.stepID;
    $scope.id = items.id;
    $scope.addImage = async function () {
        let fd = new FormData();
        let upload_file = document.getElementById("file1").files[0];
        fd.append('file', upload_file);
        fd.append('photo_type', $scope.stepID);
        fd.append('baseinfo_id', $scope.id);
        console.log(fd)
        $http.post('/Curing/insert_photo', fd, {
            headers: {
                'Content-Type': undefined
            },
            transformRequest: angular.identity
        }).then(function (req) {
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


app.controller('disdescListCtrl', ['$scope', '$modalInstance', 'items', '$modal', '$http', '$log', function ($scope, $modalInstance, items, $modal, $http, $log) {

    async function getQuantity() {
        let getList = '/curing/select_list?id=' + items.id;
        await $http.get(getList).then((res) => {
            $scope.quantityList = res.data;
            for (let item of $scope.quantityList) {
                item.total = parseFloat(item.Unit_Price * item.Check_num);
            };
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
            console.log(res.data);
        });
    };
    getQuantity();

    $scope.cancel = function () {
        $modalInstance.close({
            message: $scope.totalCost
        });
    }

    $scope.addList = async function () {
        let getDisList = '/curing/select_data?id=' + items.id;
        await $http.get(getDisList).then((res) => {
            console.log(res.data)
            $scope.disData = res.data;
        });

        let getDis1 = '/curing/select_date_1';
        await $http.get(getDis1).then((res) => {
            $scope.disProject = res.data;
        });



        let modalInstance = $modal.open({
            templateUrl: 'addQuanList.html',
            controller: 'addQuanListCtrl',
            backdrop: false,
            size: 'lg',
            backdrop: 'static',      
	        keyboard: false,
            resolve: {
                items: function () {
                    return {
                        quantityList: $scope.quantityList,
                        disProject: $scope.disProject,
                        disData: $scope.disData,
                        id: items.id
                    }
                }

            }
        });
        modalInstance.result.then(function (selectedItem) {
            getQuantity();
        }, function () {
            //$log.info('Modal dismissed at: ' + new Date());
        });
    };

    $scope.delDis = async function (x) {
        console.log(x);
        let delUrl = '/curing/delete_date?id=' + x.id;
        let res = await $http.get(delUrl);
        if (res.data == 1) {
            alert('删除成功');

        } else {
            alert('删除失败');
        }
        getQuantity();
    }

}]);

app.controller('addQuanListCtrl', ['$scope', '$modalInstance', 'items', '$modal', '$http', '$log', function ($scope, $modalInstance, items, $modal, $http, $log) {
    console.log(items);
    $scope.disData = items.disData;
    $scope.disProject = items.disProject;
    console.log($scope.disProject)
    $scope.disInfo = {
        Material: '',
        Reported_quantity: '',
        unit: '',
        Unit_Price: '',
        id: '',
        disease_name: '',
        declare_num: '',
        Check_num: '',
        projects_id: items.id,
        Features: ''
    };
    $scope.cancel = function () {
        $modalInstance.close();
    };
    $scope.count = function () {
        $scope.declareTotal = parseFloat($scope.disInfo.declare_num * $scope.disInfo.Unit_Price);

    };
    $scope.count1 = function () {

        $scope.checkTotal = parseFloat($scope.disInfo.Check_num * $scope.disInfo.Unit_Price);
    }

    $scope.showNum = function () {
        for (let item of $scope.disData) {
            if ($scope.disInfo.disease_name == item.disease_curing_id) {
                $scope.disInfo.Reported_quantity = item.Reported_quantity
                $scope.disInfo.Material = item.Material
            }
        }
    }
    $scope.ce = function () {
        for (let item of $scope.disProject) {
            if ($scope.disInfo.id == item.id) {
                $scope.disInfo.unit = item.unit;
                $scope.disInfo.Unit_Price = item.Unit_Price;
                $scope.disInfo.Features = item.Features;
            }

        };

        $scope.addQuant = async function () {
            let addUrl = '/curing/insert_list';
            let res = await $http.post(addUrl, $scope.disInfo);
            if (res.data == 1) {
                $modalInstance.close();
                alert('新增成功');

            } else {
                alert('新增失败');
            }

        }

    }

}]);


app.controller('maintainModalCtrl', ['$scope', '$modalInstance', 'items', '$modal', '$http', '$log', function ($scope, $modalInstance, items, $modal, $http, $log) {

    $scope.reportData = items.reportData;
    async function getDisease() {
        let getDetails = '/curing/select_disease?id=' + $scope.reportData.id;
        console.log(getDetails)
        await $http.get(getDetails).then((res) => {
            $scope.disdetails = res.data;
            console.log($scope.disdetails)
        });
    }
    getDisease();
    console.log('cs')
    $scope.item = {
        disease_name: '',
        unit: '',
        Reported_quantity: '',
        Audit_quantity: '',
        Solution_Tips: '',
        MaterialID: '',
        id: $scope.reportData.id
    };
    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
    $scope.btn_addBH = async function (size) {
        let getDis = '/curing/select_diseases';
        await $http.get(getDis).then((res) => {
            $scope.disInfo = res.data;
        })

       /*  let getMater = '/curing/select_material';    //disInfo.disease_name
        await $http.get(getMater).then((res) => {
            console.log(res.data)
            $scope.materData = res.data;
        }); */

        let modalInstance = $modal.open({
            templateUrl: 'addMaintainDis.html',
            controller: 'addMaintainDisCtrl',
            backdrop: false,
            size: 'sm',
            backdrop: 'static',      
	        keyboard: false,
            resolve: {
                items: function () {
                    if ($scope.item.disease_name == '' && $scope.item.unit == '') {
                        $scope.item.title = 'insert'
                    } else {
                        $scope.item.title = 'update'
                    }

                    return {
                        size: size,
                        disInfo: $scope.disInfo,
                       /*  materData: $scope.materData */
                    }
                }

            }
        });

        modalInstance.result.then(function (selectedItem) {
            getDisease();
            $scope.item = {
                disease_name: '',
                unit: '',
                Reported_quantity: '',
                Audit_quantity: '',
                Solution_Tips: '',
                MaterialID: '',
                id: $scope.reportData.id
            };
        }, function () {
            $log.info('Modal dismissed at: ' + new Date());
        });
    };
    $scope.delDis = async function (item) {
        let delUrl = '/curing/delete_Disease_details?id=' + item.id;
        let res = await $http.get(delUrl);
        if (res.data == 1) {

            alert('删除成功');

        } else {
            alert('删除失败');
        }
        getDisease();

    }

}]);

app.controller('addMaintainDisCtrl', ['$scope', '$modalInstance', 'items', '$modal', '$http', '$log', function ($scope, $modalInstance, items, $modal, $http, $log) {

    $scope.disCount = items.disInfo;
    $scope.disInfo = items.size;
    console.log(items.size)
    //$scope.materData = items.materData;

    $scope.ce = async function () {

        for (let item of $scope.disCount) {
            if ($scope.disInfo.disease_name == item.id) {
                $scope.disInfo.unit = item.unit
                $scope.disInfo.Solution_Tips = item.Solution_Tips;
                item.select = true;
            } else {
                item.select = false;
            }

        };

        let getMater = '/curing/select_material?id='+ $scope.disInfo.disease_name;    //disInfo.disease_name
        await $http.get(getMater).then((res) => {
            console.log(res.data)
            $scope.materData = res.data;
        });


    }
    for (let item of $scope.disCount) {
        console.log($scope.disInfo.disease_name)
        if ($scope.disInfo.disease_name == item.disease_name) {
            item.select = true;
        } else {
            item.select = false;
        }

    }
    console.log($scope.disCount)

    if (items.size.title == 'insert') {
        $scope.title = '新建病害';
    } else {
        $scope.title = '修改病害';
    }
    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
    $scope.addDis = async function () {
        if ($scope.title == '新建病害') {
            let addUrl = '/curing/add_disease';
            let res = await $http.post(addUrl, $scope.disInfo);
            if (res.data == 1) {
                $modalInstance.close();
                alert('新增成功');
            } else {
                alert('新增失败');
            };
        } else {

            let updateUrl = '/curing/update_Disease_details';
            let res = await $http.post(updateUrl, $scope.disInfo);
            if (res.data == 1) {
                $modalInstance.close();
                alert('修改成功');
            } else {
                alert('修改失败');
            }

        }
    };
    $scope.cancel = function () {
        $modalInstance.close();
    };
}]);



app.controller('dataStatics_controller', ['$scope', '$http','$filter', '$modal', '$log', function ($scope, $http,$filter, $modal, $log) {

    [$scope.diseaseInfo, $scope.totalItems, $scope.diseaseInfoNow] = [[], [], []];
    [$scope.currentPage, $scope.itemsPerPage, $scope.maxSize] = [1,12, 3];
    async function getData() {
        let gethome = '/bridgeinfo/select_curing_list?uid=' + $scope.app.globalInfo.userid+'&power='+JSON.parse(sessionStorage.getItem('msg')).usertype;
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

            console.log(res.data)
            $scope.diseaseInfo = res.data;
            $scope.totalItems = $scope.diseaseInfo.length;
            getCurrentTimes();
            for (let item of res.data) {
                if (item.Reporting_time !== '0000-00-00 00:00:00') {
                    item.Reporting_time = get_date_str(new Date(item.Reporting_time));
                }
                if(item.problem_source == 0) {
                    item.problem_source = '巡查'
                }else if( item.problem_source == 1){
                    item.problem_source = '检测'
                }else {
                    item.problem_source = '群众举报'
                }

            }
        })

    }
    getData();
    $scope.search = function () {
      console.log($scope.oddNumbers);
      //console.log($scope.facility);
        $scope.diseaseInfoNow = $filter('order')($scope.diseaseInfo, $scope.oddNumbers, $scope.facility);

    };

    // 返回当前页对应的数据
    function getCurrentTimes() {

        var start = ($scope.currentPage - 1) * $scope.itemsPerPage;
        $scope.diseaseInfoNow = $scope.diseaseInfo.slice(start, start + $scope.itemsPerPage);
    }

    // 切换分页
    $scope.changePage = function () {
        getCurrentTimes();
    };


    $scope.clickModal = async function (item) {

        let getReport = '/curing/select_ReportDis?uid=' + $scope.app.globalInfo.userid+'&id='+item.id;
        await $http.get(getReport).then((res) => {
            console.log(res.data)
            $scope.reportData = res.data[0];
            if ($scope.reportData.Reporting_time !== '0000-00-00 00:00:00') {
                $scope.reportData.Reporting_time = get_date_str(new Date($scope.reportData.Reporting_time));
            }
        });


        let getComplete = '/curing/complete?Odd_Numbers=' + $scope.reportData.Odd_Numbers;
        await $http.get(getComplete).then((res) => {
            $scope.completeData = res.data[0];
            for (let item of res.data) {
                if (item.Completion_time !== '0000-00-00 00:00:00') {
                    item.Completion_time = get_date_str(new Date(item.Completion_time));
                };
                if (item.Reporting_time !== '0000-00-00 00:00:00') {
                    item.Reporting_time = get_date_str(new Date(item.Reporting_time));
                };
            };
            console.log($scope.completeData);
        });

        let getConfirm = '/curing/select_confirm?Odd_Numbers=' + $scope.reportData.Odd_Numbers;
        await $http.get(getConfirm).then((res) => {
            $scope.confirmData = res.data[0];
            for (let item of res.data) {
                if (item.curing_Sign_time !== '0000-00-00 00:00:00') {
                    item.curing_Sign_time = get_date_str(new Date(item.curing_Sign_time));
                };
                if (item.manage_Sign_time !== '0000-00-00 00:00:00') {
                    item.manage_Sign_time = get_date_str(new Date(item.manage_Sign_time));
                }
            };
            console.log(res.data);
        });



        var modalInstance = $modal.open({
            templateUrl: 'maintainProcess.html',
            controller: 'ProcessCtrl',
            backdrop: false,
            size: 'lg',
            backdrop: 'static',      
	        keyboard: false,
            resolve: {
                items: function () {
                    return {
                        reportData: $scope.reportData,
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
    }

    $scope.delDis = async function (item) {
        console.log(item);
        let delUrl = '/curing/delete_process?id=' + item.id;
        try {
            let res = await $http.get(delUrl);
            if (res.data == 1) {
                alert('删除成功');
                getData();
            } else {
                alert('删除失败');
            }
        } catch (e) {
            console.log('delete data ' + e);
        }
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
    };
}])
