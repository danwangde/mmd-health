app.controller('structureCtrl', ['$scope', '$modalInstance', '$http', '$modal', 'items', function ($scope, $modalInstance, $http, $modal, items) {
    $scope.type =JSON.parse(sessionStorage.getItem('msg')).usertype;
    $scope.structureInfo = items.structureInfo;
    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
    async function getStruct(){
        let getStructure = '/Testing/select_structure?uid=' +JSON.parse(sessionStorage.getItem('msg')).userid + '&Facility_type=' + items.x.Facility_type+'&id='+items.x.id;
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
        console.log(x)
        //console.log($scope.app.globalInfo);
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
                        bridgeInfo:items.bridgeInfo,
                        passageInfo:items.passageInfo
                    }
                }
            }
        });
        modalInstance.result.then(function (fs) {
            getStruct();
        })
    };

    $scope.updateStruct = async function(x){
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
                        item:x,
                        Facility_type:items.x.Facility_type,
                        dataInfo:$scope.dataInfo,
                        bridgeInfo:items.bridgeInfo,
                        passageInfo:items.passageInfo
                    }
                }
            }
        });
        modalInstance.result.then(function (fs) {
            getStruct();
        })
    }

    $scope.delStruct =async function(x){
        let delUrl = '/Testing/delete_struct?id='+x.id;
        let res = await $http.get(delUrl);
        if(res.data==1){
            alert("删除成功");
        }else{
            alert("删除失败");
        };
        getStruct();
    }
}]);
app.controller('structureDetailCtrl', ['$scope', '$modalInstance', '$http', 'items', function ($scope, $modalInstance, $http, items) {
    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };

    $scope.reinforced_concrete = items.dataInfo.reinforced_concrete;
    $scope.carbonization = items.dataInfo.carbonization;
    $scope.concrete_strength = items.dataInfo.concrete_strength;
    $scope.chloride_ion = items.dataInfo.chloride_ion;
    $scope.resistivity = items.dataInfo.resistivity;
    $scope.potential = items.dataInfo.potential;
}]);

app.controller('addRegularCtrl', ['$scope', '$modalInstance', '$http', 'items', function ($scope, $modalInstance, $http, items) {
    console.log(items);

}]);

app.controller('regularDetailCtrl', ['$scope', '$modalInstance', '$http', 'items', function ($scope, $modalInstance, $http, items) {
    console.log(items);
    $scope.regularDetail = items.regularDetail;
    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };

}]);

app.controller('addStructCtrl', ['$scope', '$modalInstance', '$http', 'items', function ($scope, $modalInstance, $http, items) {
    console.log(items.item);
    $scope.structData = items.item;
    $scope.bridgeInfo = items.bridgeInfo;
    $scope.passageInfo = items.passageInfo;
    $scope.arrData = [];
    $scope.getComponent =async function(){
        let url = '/Testing/select_struct?uid='+JSON.parse(sessionStorage.getItem('msg')).userid+'&BridgeID='+ $scope.structData.Facility_id;
        await $http.get(url).then((res)=>{
            console.log(res.data);
            $scope.component = res.data;
            let data = [];
            $scope.arr = [];
            $scope.str = '';
            for(let item of $scope.component){
                data= Object.keys(item).map((key)=>{
                    return item[key];
                });
                $scope.arr.push(data)
            };

            for(let item of $scope.arr){
                $scope.str = item.join("-");
                $scope.arrData.push(  $scope.str);

            };
            console.log( $scope.arrData);

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
    $scope.Facility_type = items.Facility_type=='桥梁'?'0':"1";
    $scope.reinforced_concrete = items.dataInfo.reinforced_concrete;
    $scope.carbonization = items.dataInfo.carbonization;
    $scope.concrete_strength = items.dataInfo.concrete_strength;
    $scope.chloride_ion = items.dataInfo.chloride_ion;
    $scope.resistivity = items.dataInfo.resistivity;
    $scope.potential = items.dataInfo.potential;
    $scope.bridgeInfo = items.bridgeInfo;
    for(let item of $scope.bridgeInfo){
        if($scope.bridgename==item.BridgeName){
            item.select = true;
        }else{
            item.select = false;
        }
    };
    $scope.passageInfo = items.passageInfo;
    for(let item of $scope.passageInfo){
        if( $scope.PassagewayName==item.PassagewayName){
            item.select = true;
        }else{
            item.select = false;
        }
    };


    $scope.addSaveStruct = async function () {

    $scope.updateData = {
        id:items.item.id,
        bridgename:$scope.bridgename,
        PassagewayName:$scope.PassagewayName,
        diameter:$scope.reinforced_concrete[0].diameter,
        steel_min:$scope.reinforced_concrete[0].steel_min,
        steel_max:$scope.reinforced_concrete[0].steel_max,
        steel_avg:$scope.reinforced_concrete[0].steel_avg,
        steel_set_up:$scope.reinforced_concrete[0].steel_set_up,
        protect_min:$scope.reinforced_concrete[0].protect_min,
        protect_max:$scope.reinforced_concrete[0].protect_max,
        protect_avg:$scope.reinforced_concrete[0].protect_avg,
        protect_set_up:$scope.reinforced_concrete[0].protect_set_up,
        protect_Features:$scope.reinforced_concrete[0].protect_Features,
        protect_evaluate:$scope.reinforced_concrete[0].protect_evaluate,
        avg:$scope.carbonization[0].avg,
        strength:$scope.concrete_strength[0].Strength,
        design:$scope.concrete_strength[0].Design,
        Lmin:$scope.chloride_ion[0].min,
        Lmax:$scope.chloride_ion[0].max,
        Dmin:$scope.resistivity[0].min,
        Dmax:$scope.resistivity[0].max,
        Gmin:$scope.potential[0].min,
        Gmax:$scope.potential[0].max
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

app.controller('diseaseCtrl', ['$scope', '$modalInstance', '$http', 'items', function ($scope, $modalInstance, $http, items) {
    console.log(items);
    $scope.type =JSON.parse(sessionStorage.getItem('msg')).usertype;
    $scope.diseaseInfo = items.diseaseInfo;

    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
}]);

app.controller('manageBridgeRegular_controller', ['$scope', '$http','$filter', '$modal', '$log', function ($scope, $http,$filter, $modal, $log) {

    $scope.showTable = false;
    $scope.show = function () {
        $scope.showTable = !$scope.showTable
    };
    $scope.addRegular = async function () {
        let getBridge = '/Testing/select_bri?uid=' + $scope.app.globalInfo.userid;
        await $http.get(getBridge).then((res) => {
            $scope.bridgeInfo = res.data;
        });
        let getPassage = '/Testing/select_passage?uid=' + $scope.app.globalInfo.userid;
        await $http.get(getPassage).then((res) => {
            $scope.passageInfo = res.data;
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
                        passageInfo: $scope.passageInfo
                    }
                }

            }
        });
        modalInstance.result.then(function (fs) {
            console.log(fs);
        })
    };

    $scope.delRegular = async function (x) {
        let delUrl = '/Testing/delete_Record?Odd_Numbers=' + x.Odd_Numbers;
        let res = await $http.get(delUrl);
        if (res.data == 1) {
            alert("删除成功");
        } else {
            alert("删除失败");
        };
        getRegular();
    };

    $scope.openRegular = async function (x) {
        let openRegularUrl = '/Testing/select_details_manage?Facility_type=' + x.Facility_type + '&uid=' + $scope.app.globalInfo.userid + '&id=' + x.id;
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

        let getBridge = '/Testing/select_bri?uid=' + $scope.app.globalInfo.userid;
        await $http.get(getBridge).then((res) => {
            $scope.bridgeInfo = res.data;
        });
        let getPassage = '/Testing/select_passage?uid=' + $scope.app.globalInfo.userid;
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
                        x:x,
                        structureInfo: $scope.structureInfo,
                        bridgeInfo:$scope.bridgeInfo,
                        passageInfo:$scope.passageInfo
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
        let getDiseaseUrl = '/regular/select_disease_detection?id=' + x.id+ '&Facility_type=' + x.Facility_type;
        await $http.get(getDiseaseUrl).then((res) => {
            console.log(res.data)
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
            console.log(fs);
        })
    };

    [$scope.regularInfo, $scope.totalItems, $scope.regularInfoNow]=[[],[],[]];
    [$scope.currentPage, $scope.itemsPerPage, $scope.maxSize] = [1,12,3];
    async function getRegular() {
        let getRegularUrl = '/Testing/select_routine?uid=' + $scope.app.globalInfo.userid;
        await $http.get(getRegularUrl).then((res) => {
            console.log(res.data);
            $scope.regularInfo=[];
           for(let item of res.data){
              if(item){
                  for(let item1 of item){
                    $scope.regularInfo.push(item1);
                  }
              }
           }

            console.log($scope.regularInfo);

            for (let item of $scope.regularInfo) {
                if (item.Facility_type == '桥梁') {
                    item.facilityName = item.bridgename
                } else {
                    item.facilityName = item.passagewayname
                };
                item.Inspection_date = get_date_str(new Date(item.Inspection_date));
            };

            $scope.totalItems = $scope.regularInfo.length;
            getCurrentTimes();
        });
    }
    getRegular();

    $scope.search = function () {
        $scope.regularInfoNow = $filter('regular')($scope.regularInfo, $scope.type, $scope.name,$scope.unit);
    };

    // 返回当前页对应的数据
    function getCurrentTimes() {

       var start = ($scope.currentPage - 1) * $scope.itemsPerPage;
       $scope.regularInfoNow = $scope.regularInfo.slice(start, start + $scope.itemsPerPage);
   }

   // 切换分页
   $scope.changePage = function() {
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
