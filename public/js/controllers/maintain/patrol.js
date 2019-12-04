app.controller('showJournalCtrl', ['$scope', '$modalInstance', 'items', '$http', function ($scope, $modalInstance, items, $http) {
    $scope.Journa = items.Journa;
    for(let item of $scope.Journa){
       item.Inspection_date = get_date_str(new Date(item.Inspection_date));
    }

    console.log($scope.Journa)
    $scope.printBtn = function () {
        console.log(123)
        window.print()

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
        return Y + '-' + M + '-' + D + ' ';
    }

}]);

app.controller('addPatrolCtrl', ['$scope', '$modalInstance', 'items', '$http', function ($scope, $modalInstance, items, $http) {
    console.log(items);
    $scope.Journa = {
        Bearing: new Array(5),
        Bridge_brand: new Array(5),
        Bridge_connection: new Array(5),
        Drainage_facilities: new Array(5),
        Limit_height_load: new Array(5),
        Railing: new Array(5),
        Roadway: new Array(5),
        Sidewalk: new Array(5),
        Substructure: new Array(5),
        Superstructure: new Array(5),
        expansion_joint: new Array(5),
        Whether_construction: '',
        other_disease: '',
        weather: '',
        branch1:items.branch
    };
    $scope.patrItem = {
        Inspection_date: '',
        plan:'',
        BridgeName: '',
        A_Signin_date: '',
        B_Signin_date: '',
        branch: JSON.parse(sessionStorage.getItem('msg')).branch_id,
        Inspecting_Officer: '',
        task_id: '',
        Odd_Numbers: '',
        Other: '',
        Reporting_time: '',
        facilities_type:''
    };
    $scope.selType = async function(){
        let getUrl = '/curing/select_bridge?facilities_type=' +$scope.patrItem.facilities_type + '&uid='+JSON.parse(sessionStorage.getItem('msg')).userid;
        await $http.get(getUrl).then((res)=>{
            console.log(res.data);
            $scope.bridgeInfo = res.data;
        })
    }

    $scope.planInfo = items.planInfo;
    console.log( $scope.planInfo);

    $scope.addPatrol = async function () {
        $scope.addData = $.extend($scope.patrItem, $scope.Journa);
        let url = '/curing/insert_into';
        console.log($scope.addData);
        let res = await $http.post(url, $scope.addData);
        if (res.data == 1) {
            $modalInstance.close();
            alert('新建成功');
        } else {
            alert('新建失败');
        }
        console.log(res.data);

    }

    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    }



}]);


app.controller('manageBridgePatrol_controller', ['$scope', '$http','$filter', '$modal', '$log', function ($scope, $http,$filter, $modal, $log) {

    $scope.addPatrol = async function () {
        let selBranch ='/curing/select_branchname_id?branch_id='+JSON.parse(sessionStorage.getItem('msg')).branch_id;
        await $http.get(selBranch).then((res)=>{
            $scope.branch = res.data[0].branch;
        })

       /*  let getBridge = '/curing/select_bridge?uid='+$scope.app.globalInfo.userid;
        await $http.get(getBridge).then((res) => {
            $scope.bridgeName = res.data;
        }); */

        let getPlan = '/curing/select_plan?branch_id='+JSON.parse(sessionStorage.getItem('msg')).branch_id;
        await $http.get(getPlan).then((res)=>{
            $scope.planInfo = res.data;
        })

        var modalInstance = $modal.open({
            templateUrl: 'addPatrol.html',
            controller: 'addPatrolCtrl',
            size: 'lg',
            resolve: {
                items: function () {
                    return {
                        planInfo: $scope.planInfo,
                        branch:$scope.branch
                    }
                }

            }
        });
        modalInstance.result.then(function () {
            patrolInfoFn();
        }, function () {});
    };
    [$scope.patrolInfo, $scope.totalItems, $scope.patrolInfoNow] = [[], [], []];
    [$scope.currentPage, $scope.itemsPerPage, $scope.maxSize] = [1, 12, 3];
    function patrolInfoFn() {
        let patrolInfoUrl = '/curing/select_home_maintain?uid=' + $scope.app.globalInfo.userid;
        $http.get(patrolInfoUrl).then(function (req) {
            console.log(req.data);
            $scope.patrolInfo = req.data;
            $scope.totalItems = $scope.patrolInfo.length;
            getCurrentTimes();
            for (let item of $scope.patrolInfo) {
                if(item.A_Signin_date!== '0000-00-00 00:00:00') {
                    item.A_Signin_date = get_date_str(new Date(item.A_Signin_date));
                };
                if(item.B_Signin_date !=='0000-00-00 00:00:00') {
                    item.B_Signin_date = get_date_str(new Date(item.B_Signin_date));
                };
            }
        })
    }
    patrolInfoFn();

    $scope.search = function () {
        $scope.patrolInfoNow = $filter('patrol')($scope.patrolInfo, $scope.number, $scope.start,$scope.end,$scope.patrol);
    };

     // 返回当前页对应的数据
     function getCurrentTimes() {

        var start = ($scope.currentPage - 1) * $scope.itemsPerPage;
        $scope.patrolInfoNow = $scope.patrolInfo.slice(start, start + $scope.itemsPerPage);
    }

    // 切换分页
    $scope.changePage = function () {
        getCurrentTimes();
    };
    $scope.showJournal = async function (item) {
        let getJournaUrl = '/curing/select_Daily_inspection?id=' + item.task_id +'&facilities_type='+item.facilities_type;
        await $http.get(getJournaUrl).then(function (req) {
            console.log(req.data);
            $scope.Journa = req.data;

        });
        var modalInstance = $modal.open({
            templateUrl: 'showJournal.html',
            controller: 'showJournalCtrl',
            size: 'lg',
            backdrop: 'static',      
	        keyboard: false,
            resolve: {
                items: function () {
                    return {
                        Journa: $scope.Journa,
                        patrolItem: item
                    }
                }

            }
        });
        modalInstance.result.then(function () {}, function () {});
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
        return Y + '-' + M + '-' + D ;
    }

}]);
