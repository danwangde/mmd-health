'use strict';
app.controller('userModelCtrl', ['$scope', '$modalInstance', 'items', '$http','$modal', function ($scope, $modalInstance, items, $http,$modal) {
    console.log(items);
    $scope.user = items.userObj;

    $scope.saveAccount = function () {
        console.log( $scope.user );
       if($scope.user.title == "新建用户"){
           $http.post('/loginCheck/insert_user',$scope.user).then(function(req){
               console.log(req.data)
              if(req.data == 1){
                  alert('新建成功');
                  $modalInstance.close();
              }else if(req.data == 2){
                  alert('用户名重复');
              }else if(req.data == 3){
                  alert('部门重复');
              }else{
                  alert('新建失败')
              }
           })
       }else if($scope.user.title == "修改用户"){
           $http.post('/loginCheck/update_user',$scope.user).then(function(req){
               if(req.data == 1){
                   alert('修改成功');
                   $modalInstance.close();
               }else{
                   alert('修改失败')
               }
           })
       }
    };
    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
    $scope.selectpower=function(){
        if($scope.user.power == 1){
            $scope.brunchData = items.brunchData.manage;
        }else if($scope.user.power == 2){
            $scope.brunchData = items.brunchData.curing;
        }else if($scope.user.power == 3){
            $scope.brunchData = items.brunchData.check;
        }
    };
    $scope.selectpower();
}]);
app.controller('addCodeCtrl', ['$scope', '$modalInstance', 'items', '$http','$modal', function ($scope, $modalInstance, items, $http,$modal) {
    $scope.addData = {equipmentcode:'',uid: items.uid, Users:''};
    $scope.saveCode = async function () {
        let url ='/loginCheck/insert_code';
        let res = await $http.post(url,$scope.addData);
        if(res.data == 1){
            $modalInstance.close();
            alert('添加成功');
        }
    }
    let url = '/loginCheck/select_code?uid='+items.uid;
    $http.get(url).then((response) =>{
        $scope.codeData =response.data;
    });
    $scope.delCode = async function (item) {
        let url ='/loginCheck/delete_code?codeid=' +item.codeid;
        let res = await $http.get(url);
        if(confirm('确认删除该设备码吗?')){
            if(res.data == 1){
                $modalInstance.close();
                alert('删除成功');
            }else {
                alert('删除失败')
            }
        }
    };
    $scope.cancel = function () {
        $modalInstance.dismiss();
    }
}]);

app.controller('managePublicAccount_controller', function ($scope, $modal, $http, $filter) {
    let branch;
    async function getUsers() {
        $http({
            method: 'post',
            url: '/loginCheck/select_user',
            data: {registrant_id: $scope.app.globalInfo.userid}
        }).then(function (response) {
            console.log(response.data)
            $scope.sysAccount = response.data;
            [...$scope.sysAccountNow] = $scope.sysAccount;
        }, function (x) {
            console.log(x)
        })
    }
    getUsers();
    $scope.search = function () {
        $scope.sysAccountNow =  $filter('account')($scope.sysAccount, $scope.unit, $scope.name);
    }
    $scope.openUserModel = function (num, item) {
        let obj={};
        if (num == 1) {
            obj = item;
            obj.title = "修改用户";
        } else if (num == 0) {
            obj.user_name='';
            obj.state='';
            obj.power='';
            obj.title = "新建用户";
            obj.branch = "";
        }
        obj.registrant_id=$scope.app.globalInfo.userid;
        let modalInstance =$modal.open({
            templateUrl: 'userModel.html',
            controller: 'userModelCtrl',
            size: '',
            backdrop: 'static',
	        keyboard: false,
            resolve: {
                items: function () {
                    return {
                        userObj:obj,
                        brunchData: branch
                    }
                }
            }
        });
        modalInstance.result.then(function () {
            getUsers();
        }, function () {
        });
    };
    $scope.delUser = async function (item) {
        if (confirm("您确定删除" + item.user_name + "?")) {
            $http({
                method: 'post',
                url: '/loginCheck/delete_user',
                data: {user_id:item.id}
            }).then(function (response) {
                getUsers();
            }, function (x) {
                console.log(x)
            })
        }
    };
    $scope.addCode = async function (item) {
        let modalInstance =$modal.open({
            templateUrl: 'addCode.html',
            controller: 'addCodeCtrl',
            size: '',
            backdrop: 'static',
	        keyboard: false,
            resolve: {
                items: function () {
                    return {
                        uid:item.id
                    }
                }
            }
        });
        modalInstance.result.then(function () {
            getUsers();
        }, function () {
        });
    };
    function getBranch(){
        let getBranchUrl='/branch/select?user_id='+$scope.app.globalInfo.userid+'&branch_id='+JSON.parse(sessionStorage.getItem('msg')).branch_id;
        console.log(getBranchUrl);
        $http.get(getBranchUrl).then(function(response){
            branch=response.data;
            console.log(branch)
        })
    }
    getBranch();

});
