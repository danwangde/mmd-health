app.controller('structureCtrl', ['$scope', '$modalInstance', '$http', '$modal', '$location', 'items', function ($scope, $modalInstance, $http, $modal, $location, items) {
    $scope.path = $location.url();
    console.log(items.x)
    console.log($scope.path)
    $scope.type = JSON.parse(sessionStorage.getItem('msg')).usertype;
    $scope.cancel = function () {
        console.log(111)
        $modalInstance.dismiss();
    }
    $scope.structureInfo = items.structureInfo;
    async function getStruct() {
        let getStructure = '/Testing/select_structure_check?uid=' + JSON.parse(sessionStorage.getItem('msg')).userid + '&Facility_type=' + items.x.Facility_type + '&id=' + items.x.id;
        console.log(getStructure);
        await $http.get(getStructure).then((res) => {
            console.log(res.data);
            $scope.structureInfo = res.data;
        });
    };

    getStruct();
    $scope.open = async function (x) {

        let getStructUrl = '/Testing/select_Structural_details?Odd_Numbers=' + x.Odd_Numbers + '&id=' + x.id;
        console.log(getStructUrl);
        await $http.get(getStructUrl).then((res) => {
            console.log(res.data);
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
            console.log(fs);
        })
    };
    $scope.item = {

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
        console.log(x)
        //console.log($scope.app.globalInfo);
        $scope.item.Odd_Numbers = items.x.Odd_Numbers;
        $scope.item.id = items.x.id;
        $scope.item.Facility_type = items.x.Facility_type;
        $scope.item.Facility_id = items.x.BridgeID;
        $scope.item.facilityName = items.x.facilityName;

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
        console.log(getStructUrl);
        await $http.get(getStructUrl).then((res) => {
            console.log(res.data);
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
        if (confirm('确认删除该条结构性能检测记录吗?')) {
            let delUrl = '/Testing/delete_struct?id=' + x.id;
            let res = await $http.get(delUrl);
            if (res.data == 1) {
                alert("删除成功");
            } else {
                alert("删除失败");
            };
            getStruct();
        }
    }
}]);
app.controller('structureDetailCtrl', ['$scope', '$modalInstance', '$http', 'items', function ($scope, $modalInstance, $http, items) {

    $scope.reinforced_concrete = items.dataInfo.reinforced_concrete;
    $scope.carbonization = items.dataInfo.carbonization;
    $scope.concrete_strength = items.dataInfo.concrete_strength;
    $scope.chloride_ion = items.dataInfo.chloride_ion;
    $scope.resistivity = items.dataInfo.resistivity;
    $scope.potential = items.dataInfo.potential;
    $scope.cancel = function () {
        $modalInstance.close();
    }
}]);

app.controller('updateRegularCtrl', ['$scope', '$modalInstance', '$http', 'items', function ($scope, $modalInstance, $http, items) {
    console.log(items);
    $scope.bridgeInfo = items.bridgeInfo;
    $scope.passageInfo = items.passageInfo;
    $scope.planData = items.planData;
    $scope.regularDetail = items.item;
    console.log($scope.regularDetail)
    $scope.cancel = function () {
        $modalInstance.close();
    }
    $scope.saveBtn = async function () {
        console.log(1)
        let fd = new FormData();
        let upload_file = document.getElementById("file1").files[0];
        fd.append('file', upload_file);
        fd.append('Facility_type', $scope.regularDetail.Facility_type);
        fd.append('Facility_id', $scope.regularDetail.Facility_id);
        fd.append('Inspection_date', $scope.regularDetail.Inspection_date);
        fd.append('Patrol', $scope.regularDetail.Patrol);
        fd.append('Patrol_unit', $scope.regularDetail.Patrol_unit);
        fd.append('Test_Report', $scope.regularDetail.Test_Report);
        fd.append('plan_id', $scope.regularDetail.plan_id);
        fd.append('BCI', $scope.regularDetail.BCI);
        fd.append('id', $scope.regularDetail.id);
        $http.post('/Testing/update_routine', fd, {
            headers: {
                'Content-Type': undefined
            },
            transformRequest: angular.identity
        }).then(function (req) {
            console.log(req.data)
            if (req.data == 1) {
                $modalInstance.close();
                alert('修改成功');
            }
        });
    }

}]);

app.controller('addRegularCtrl', ['$scope', '$modalInstance', '$http', 'items', function ($scope, $modalInstance, $http, items) {

    console.log(items);
    $scope.bridgeInfo = items.bridgeInfo;
    $scope.passageInfo = items.passageInfo;
    $scope.planData = items.planData;
    console.log($scope.planData)
    $scope.addRegularData = {
        Facility_type: '',
        Facility_id: '',
        Inspection_date: '',
        Patrol: '',
        Patrol_unit: items.Patrol_unit,
        Test_Report: '',
        plan_id: ''

    };
    $scope.cancel = function () {
        $modalInstance.close();
    }
    $scope.saveBtn = async function () {
        let fd = new FormData();
        let upload_file = document.getElementById("file1").files[0];
        fd.append('file', upload_file);
        fd.append('Facility_type', $scope.addRegularData.Facility_type);
        fd.append('Facility_id', $scope.addRegularData.Facility_id);
        fd.append('Inspection_date', $scope.addRegularData.Inspection_date);
        fd.append('Patrol', $scope.addRegularData.Patrol);
        fd.append('Patrol_unit', $scope.addRegularData.Patrol_unit);
        fd.append('Test_Report', $scope.addRegularData.Test_Report);
        fd.append('plan_id', $scope.addRegularData.plan_id);
        $http.post('/Testing/insert_routine', fd, {
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
    }

}]);

app.controller('regularDetailCtrl', ['$scope', '$modalInstance', '$http', 'items', function ($scope, $modalInstance, $http, items) {
    console.log(items);
    $scope.regularDetail = items.regularDetail;
    $scope.regularDetail.Inspection_date = get_date_str(new Date($scope.regularDetail.Inspection_date));
    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
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

app.controller('addStructCtrl', ['$scope', '$modalInstance', '$http', 'items', function ($scope, $modalInstance, $http, items) {
    console.log(items.item);
    $scope.structData = items.item;
    $scope.bridgeInfo = items.bridgeInfo;
    $scope.passageInfo = items.passageInfo;
    $scope.arrData = [];
    getComponent();
    async function getComponent() {
        let url = '/Testing/select_struct_check?uid=' + JSON.parse(sessionStorage.getItem('msg')).userid + '&BridgeID=' + $scope.structData.Facility_id;
        await $http.get(url).then((res) => {
            console.log(res.data);
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
            console.log($scope.arrData);

        })
    }

    $scope.addSaveStruct = async function () {
        let addUrl = '/Testing/insert_struct';
        await $http.post(addUrl, $scope.structData).then((res) => {
            console.log(res.data);
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
    console.log(items.item)
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
            console.log(res.data);
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
//病害信息页面
app.controller('diseaseCtrl', ['$scope', '$modalInstance', '$http', '$modal', '$location', 'items', function ($scope, $modalInstance, $http, $modal, $location, items) {
    console.log(items);
    $scope.bciAdd = async function () {
        let url = '/BCI/calc?check_id=' + items.checkid;
        let res = $http.get(url);
        console.log(res)
        alert('BCI计算成功');
    }
    $scope.path = $location.url();
    console.log($scope.path)
    $scope.type = JSON.parse(sessionStorage.getItem('msg')).usertype;
    $scope.diseaseInfo = items.diseaseInfo;
    if (items.BridgeID) {
        $scope.id = items.BridgeID
    } else {
        $scope.id = items.PassagewayID
    }
    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };

    $scope.addDis = async function () {
        let modalInstance = $modal.open({
            templateUrl: 'addCheckDis.html',
            controller: 'addCheckDisCtrl',
            size: '',
            backdrop: 'static',      
	        keyboard: false,
            resolve: {
                items: function () {
                    return {
                        Facility_type: items.Facility_type,
                        id: $scope.id,
                        checkid: items.checkid,
                        facilityName: items.facilityName,
                        BridgeID: items.BridgeID
                    }
                }

            }
        });
        modalInstance.result.then(function (fs) {
            getInfo();
        })
    };
    $scope.delDis = async function (x) {
        if (confirm('确认删除该条病害信息吗?')) {
            let delUrl = '/Testing/delete_check_dis?id=' + x.id;
            await $http.get(delUrl).then((res) => {
                if (res.data == '1') {
                    alert('删除成功');
                } else {
                    alert('删除失败');
                };
            });
            getInfo();
        }

    }
    async function getInfo() {
        let getDiseaseUrl = '/regular/select_disease_detection?id=' + items.checkid + '&Facility_type=' + items.Facility_type;
        await $http.get(getDiseaseUrl).then((res) => {
            console.log(res.data)
            $scope.diseaseInfo = res.data;
        })
    };
    getInfo();
}]);
//病害新增弹窗
app.controller('addCheckDisCtrl', ['$scope', '$modalInstance', '$http', 'items', function ($scope, $modalInstance, $http, items) {
    console.log(items);
    let evalDataMap = new Map();
    evalDataMap.set('104001', 'PC或RC梁氏构件');
    evalDataMap.set('104002', '钢结构物');
    evalDataMap.set('104003', '横向联系');
    evalDataMap.set('104004', '支座');
    evalDataMap.set('104005', '防落梁装置');
    evalDataMap.set('104006', '拱桥横向联系');
    evalDataMap.set('104007', '主拱圈');
    evalDataMap.set('104008', '实腹式');
    evalDataMap.set('104009', '空腹式');
    evalDataMap.set('104010', '外部装饰板');
    $scope.addData = {
        ComponentID: '',
        eval: '',
        disease_id: '',
        position: '',
        disease_description: '',
        disease_level: '',
        Facility_type: items.Facility_type,
        check_id: items.checkid,
        BridgeName: items.facilityName,
        BridgeID: items.BridgeID

    };

    async function checkLine() {
        let getUrl = '/regular/select_line?Facility_type=' + items.Facility_type + '&id=' + items.id;
        await $http.get(getUrl).then((res) => {
            console.log(res.data);
            $scope.lineInfo = res.data;
        });
    };
    checkLine();
    $scope.getComponent = async function () {
        let getTree = "/Testing/tree?BridgeID=" + $scope.addData.BridgeID + "&BridgeName=" + $scope.addData.BridgeName + '&LineID=' + $scope.addData.LineID;
        let response = await $http.get(getTree);
        $scope.$apply(function () {
            $scope.bridgeTree = response.data[0].children;
        })
        console.log($scope.bridgeTree)


        /* let getUrl = '/regular/select_evaluate_component?Facility_type=' + items.Facility_type + '&id=' + items.id + '&LineID='+$scope.addData.LineID;
        await $http.get(getUrl).then((res) => {
            console.log(res.data);
            $scope.component = res.data;
        }); */
    };
    function getBranchArr(data) {
        for (var i in data) {
            if (data[i].$$isChecked == true) {
                $scope.addData.branch_arr.push(data[i].id);
            }
            getBranchArr(data[i].children);
        }
    }
    function seleval() {
        let getUrl = '/regular/select_evaluate?Facility_type=' + items.Facility_type + '&ComponentID=' + $scope.addData.ComponentID;
        $http.get(getUrl).then((res) => {
            console.log(res.data)
            if (res.data.length > 0 && res.data[0].evalvalue) {

                $scope.type = true;
                for (let item of res.data) {
                    $scope.evalData = item.evalvalue.split(",").map(function (item1) {
                        let obj = {};
                        obj.evalvalue = item1;
                        obj.evalName = evalDataMap.get(item1);
                        return obj;
                    })
                    $scope.addData.ComponentTypeName = item.ComponentTypeName;
                };
            } else {
                $scope.type = false
                $scope.disease = res.data;
                console.log($scope.disease);
            }
        })



    };

    $scope.getDisgrade = async function () {
        $scope.addData.branch_arr = [];
        await getBranchArr($scope.bridgeTree);
        $scope.addData.ComponentID = $scope.addData.branch_arr[0];
        console.log($scope.addData.branch_arr)
        console.log($scope.addData.ComponentID)
        await seleval();
        let url = '/regular/select_des?disease_id=' + $scope.addData.disease_id;
        let res = await $http.get(url);
        $scope.title = res.data[0].DiseaseDefine;
        let sel_url = '/Testing/select_score_grade?disease_id=' + $scope.addData.disease_id;
        let res_grade = await $http.get(sel_url);
        $scope.explain = res_grade.data[0].DamageExplain;
        console.log($scope.explain)
        let getUrl = '/Testing/select_score?DiseaseID=' + $scope.addData.disease_id;
        await $http.get(getUrl).then((res) => {
            console.log(res.data);
            $scope.disData = res.data;
        })
    }
    $scope.seldis = async function () {
        let getUrl = '/regular/select_disease_select?CompType=' + $scope.addData.eval;
        await $http.get(getUrl).then((res) => {
            console.log(res.data);
            $scope.disease = res.data;
        });
    };

    $scope.saveBtn = async function () {

        let addUrl = '/regular/insert_disease_detection';
        await $http.post(addUrl, $scope.addData).then((res) => {
            console.log(res.data);
            if (res.data == 1) {
                $modalInstance.close();
                alert('新增成功');
            } else {
                alert('新增失败');
            }
        })
    }
    $scope.cancel = function () {
        $modalInstance.close();
    }

}]);

app.controller('manageBridgeRegular_controller', ['$scope', '$http', '$filter', '$modal', '$log', function ($scope, $http, $filter, $modal, $log) {
    $scope.ok = async function (item) {
        if (confirm('确定要提交本次常规检测数据吗？')) {
            let url = '/Testing/update_state?small_id=' + item.small_id;
            let res = await $http.get(url);
            if (res.data == 1) {
                alert('提交成功');
                getRegular();
            } else {
                alert('提交失败');
            }
        }

    };
    $scope.addRegular = async function () {
        /* await getRegular();
        if ($scope.regularInfo.length !== 0) {
            $scope.Patrol_unit = $scope.regularInfo[0].Patrol_unit;
        } else {
            $scope.Patrol_unit = '';
        }
 */
        console.log($scope.regularInfo)
        let getBridge = '/Testing/select_bri_check?uid=' + $scope.app.globalInfo.userid;
        await $http.get(getBridge).then((res) => {
            $scope.bridgeInfo = res.data;
        });
        let getPassage = '/Testing/select_passage_check?uid=' + $scope.app.globalInfo.userid;
        await $http.get(getPassage).then((res) => {
            $scope.passageInfo = res.data;
            console.log(res.data);
        });
        let getPlan = '/Testing/select_check_plan?branch_id=' + JSON.parse(sessionStorage.getItem('msg')).branch_id;
        await $http.get(getPlan).then((res) => {
            $scope.planData = res.data;
            console.log(res.data);
        });
        let getBranch = '/Testing/select_check_branch?branch_id=' + JSON.parse(sessionStorage.getItem('msg')).branch_id;
        await $http.get(getBranch).then((res) => {
            $scope.branch = res.data[0].branch;
            console.log(res.data);
        });

        let modalInstance = $modal.open({
            templateUrl: 'addRegular.html',
            controller: 'addRegularCtrl',
            size: '',
            backdrop: 'static',      
	        keyboard: false,
            resolve: {
                items: function () {
                    return {
                        bridgeInfo: $scope.bridgeInfo,
                        passageInfo: $scope.passageInfo,
                        planData: $scope.planData,
                        Patrol_unit: $scope.branch

                    }
                }

            }
        });
        modalInstance.result.then(function (fs) {
            getRegular();
        })
    };

    $scope.updateRegular = async function (x) {
        /*   await getRegular();
          if ($scope.regularInfo.length !== 0) {
              $scope.Patrol_unit = $scope.regularInfo[0].Patrol_unit;
          }else{
              $scope.Patrol_unit = '';
          }

          console.log($scope.regularInfo) */
        let getBridge = '/Testing/select_bri_check?uid=' + $scope.app.globalInfo.userid;
        await $http.get(getBridge).then((res) => {
            $scope.bridgeInfo = res.data;
        });
        let getPassage = '/Testing/select_passage_check?uid=' + $scope.app.globalInfo.userid;
        await $http.get(getPassage).then((res) => {
            $scope.passageInfo = res.data;
            console.log(res.data);
        });
        let getPlan = '/Testing/select_check_plan?branch_id=' + JSON.parse(sessionStorage.getItem('msg')).branch_id;
        await $http.get(getPlan).then((res) => {
            $scope.planData = res.data;
            console.log(res.data);
        });
        let modalInstance = $modal.open({
            templateUrl: 'updateRegular.html',
            controller: 'updateRegularCtrl',
            size: '',
            backdrop: 'static',      
	        keyboard: false,
            resolve: {
                items: function () {
                    return {
                        item: x,
                        bridgeInfo: $scope.bridgeInfo,
                        passageInfo: $scope.passageInfo,
                        planData: $scope.planData,
                        Patrol_unit: $scope.Patrol_unit

                    }
                }

            }
        });
        modalInstance.result.then(function (fs) {
            getRegular();
        })
    };

    $scope.delRegular = async function (x) {
        let delUrl = '/Testing/delete_Record?id=' + x.id;
        let res = await $http.get(delUrl);
        console.log(res.data)
        if (res.data == 1) {
            alert("删除成功");
        } else {
            alert("删除失败");
        };
        getRegular();
    };

    $scope.openRegular = async function (x) {
        console.log(x)
        let openRegularUrl = '/Testing/select_details_check?Facility_type=' + x.Facility_type + '&uid=' + $scope.app.globalInfo.userid + '&id=' + x.id;
        console.log(openRegularUrl);
        await $http.get(openRegularUrl).then((res) => {
            console.log(res.data);
            $scope.regularDetail = res.data[0];
            $scope.regularDetail.facilityName = x.facilityName;
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
            console.log(fs);
        })
    };
    $scope.openStructure = async function (x) {

        let getBridge = '/Testing/select_bri_check?uid=' + $scope.app.globalInfo.userid;
        await $http.get(getBridge).then((res) => {
            $scope.bridgeInfo = res.data;
        });
        let getPassage = '/Testing/select_passage_check?uid=' + $scope.app.globalInfo.userid;
        await $http.get(getPassage).then((res) => {
            $scope.passageInfo = res.data;
            console.log(res.data);
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
            console.log(fs);
        })
    }
    $scope.openDisList = async function (x) {
        console.log(x)
        console.log(123)

        let modalInstance = $modal.open({
            templateUrl: 'diseaseModal.html',
            controller: 'diseaseCtrl',
            size: 'lg',
            backdrop: 'static',      
	        keyboard: false,
            resolve: {
                items: function () {
                    return {
                        diseaseInfo: $scope.diseaseInfo,
                        Facility_type: x.Facility_type,
                        checkid: x.id,
                        BridgeID: x.BridgeID,
                        PassagewayID: x.PassagewayID,
                        facilityName: x.facilityName
                    }
                }

            }
        });
        modalInstance.result.then(function (fs) {
            console.log(fs);
        })
    };
    [$scope.regularInfo, $scope.totalItems, $scope.regularInfoNow] = [[], [], []];
    [$scope.currentPage, $scope.itemsPerPage, $scope.maxSize] = [1, 12, 3];
    async function getRegular() {
        let getRegularUrl = '/Testing/select_routine_check?branch_id=' + JSON.parse(sessionStorage.getItem('msg')).branch_id;
        await $http.get(getRegularUrl).then((res) => {
            $scope.regularInfo = [];
            for (let item of res.data) {
                if (item) {
                    for (let item1 of item) {
                        $scope.regularInfo.push(item1);
                    }
                }
            };

            for (let item of $scope.regularInfo) {
                if (item.Facility_type == '桥梁') {
                    item.facilityName = item.bridgename;
                } else {
                    item.facilityName = item.passagewayname;
                };
                if (item.Inspection_date == null) {
                    item.Inspection_date = '';
                } else {

                    item.Inspection_date = get_date_str(new Date(item.Inspection_date));
                }

            };
            $scope.totalItems = $scope.regularInfo.length;
            getCurrentTimes();
        });

        console.log($scope.regularInfo)

    }
    getRegular();

    $http.get('/Testing/select_planname?uid='+$scope.app.globalInfo.userid).then(function (response) {
        console.log(response.data)
        $scope.planData = response.data;
    })

    $scope.search = function () {
        console.log($scope.plan_name)
        $scope.regularInfoNow = $filter('regularCheck')($scope.regularInfo, $scope.plan_name, $scope.type, $scope.name, $scope.unit);
        console.log($scope.regularInfoNow)
    };

    // 返回当前页对应的数据
    function getCurrentTimes() {

        var start = ($scope.currentPage - 1) * $scope.itemsPerPage;
        $scope.regularInfoNow = $scope.regularInfo.slice(start, start + $scope.itemsPerPage);
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
app.directive('treeView', [function () {

    return {
        restrict: 'E',
        templateUrl: '/treeView.html',
        scope: {
            treeData: '=',
            canChecked: '=',
            textField: '@',
            itemClicked: '&',
            itemCheckedChanged: '&',
            itemTemplateUrl: '@'
        },
        controller: ['$scope', function ($scope) {
            $scope.itemExpended = function (item, $event) {
                item.$$isExpend = !item.$$isExpend;
                $event.stopPropagation();
            };

            $scope.getItemIcon = function (item) {
                var isLeaf = $scope.isLeaf(item);

                if (isLeaf) {
                    return 'fa  fa-folder-o';
                }

                return item.$$isExpend ? 'fa fa-minus' : 'fa fa-plus';
            };

            $scope.isLeaf = function (item) {
                return !item.children || !item.children.length;
            };

            $scope.chk = function (callback, item) {
                var itemId = item.id;

            };

            $scope.warpCallback = function (callback, item, $event) {
                ($scope[callback] || angular.noop)({
                    $item: item,
                    $event: $event
                });
            };
        }]
    };
}]);