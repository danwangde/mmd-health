app.controller('addMemoCtrl',['$scope','$modal','$modalInstance','items','$http',function ($scope,$modal,$modalInstance,items,$http) {
    console.log(items);
    $scope.addInfo = items;
    if(items.title=='insert') {
        $scope.title = '新增';
    }else{
        $scope.title = '修改';
    }
    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
    $scope.saveMemo = async  function () {
        if(items.title=='insert') {
            let fd = new FormData();
            let upload_file = document.getElementById("file4").files[0];
            fd.append('file', upload_file);
            fd.append('content', $scope.addInfo.content);
            fd.append('creat_time', $scope.addInfo.creat_time);
            fd.append('theme', $scope.addInfo.theme);
            fd.append('branch_id', $scope.addInfo.branch_id);
            $http.post('/memo/insert_memorandum', fd, {
                headers: {
                    'Content-Type': undefined
                },
                transformRequest: angular.identity
            }).then(function (req) {
                if (req.data == 1) {
                    $modalInstance.close();
                    alert('新增成功');
                }
                else {
                    alert('新增失败');
                }
            });
        }else {
            let fd = new FormData();
            let upload_file = document.getElementById("file4").files[0];
            fd.append('file', upload_file);
            fd.append('content', $scope.addInfo.content);
            fd.append('creat_time', $scope.addInfo.creat_time);
            fd.append('theme', $scope.addInfo.theme);
            fd.append('branch_id', $scope.addInfo.branch_id);
            fd.append('memorandum_id', $scope.addInfo.memorandum_id);
            fd.append('path', $scope.addInfo.path);
            $http.post('/memo/update_memorandum', fd, {
                headers: {
                    'Content-Type': undefined
                },
                transformRequest: angular.identity
            }).then(function (req) {
                if (req.data == 1) {
                    $modalInstance.close();
                    alert('修改成功');
                }
                else {
                    alert('修改失败');
                }
            });
        }

    }

}]);

app.controller('manageMemo_controller',['$scope','$modal','$http','$filter',function ($scope,$modal,$http,$filter) {
    $scope.deleteMemo = async function (item) {
        if (confirm('确认删除该条备忘录吗?')) {
            let url = '/memo/delete_memorandum?memorandum_id='+item.memorandum_id;
            let res = await $http.get(url);
            if(res.data==1) {
                alert('删除成功');
                getMemo();
            }else{
                alert('删除失败');
            }
        }
       
    };
    $scope.addInfo = {content:'',creat_time:'',theme:'',branch_id:JSON.parse(sessionStorage.getItem('msg')).branch_id};
    $scope.addMemo = function (num,item) {
        if(num ==1) {
            item.title = 'insert';
        }
        else{
            item.title = 'update';
        }
        var modalInstance = $modal.open({
            templateUrl: 'addMemo.html',
            controller: 'addMemoCtrl',
            size: '',
            backdrop: 'static',      
	        keyboard: false,
            resolve: {
                items: function () {
                    return item;
                }

            }
        });

        modalInstance.result.then(function () {
            getMemo();
            $scope.addInfo = {content:'',creat_time:'',theme:'',branch_id:JSON.parse(sessionStorage.getItem('msg')).branch_id};
        }, function () {

        });
    };
    
    
    [$scope.memoData, $scope.totalItems, $scope.memoDataNow] = [[], [], []];
    [$scope.currentPage, $scope.itemsPerPage, $scope.maxSize] = [1, 12, 3];
    async function getMemo() {
        let url = '/memo/select_memorandum?branch_id='+JSON.parse(sessionStorage.getItem('msg')).branch_id;
        await $http.get(url).then((res) => {
            $scope.memoData = res.data;
            [...$scope.memoDataNow] = $scope.memoData;
            $scope.totalItems = $scope.memoData.length;
            getCurrentTimes();
            console.log(res.data);
            for(let item of $scope.memoData) {
                if (item.creat_time !== '0000-00-00 00:00:00') {
                    item.creat_time =get_date_str(new Date(item.creat_time))
                }
            }
        });

    };
    getMemo();
    $scope.search = function () {
        $scope.memoDataNow = $filter('memo')($scope.memoData, $scope.theme, $scope.time);
    }
     // 返回当前页对应的数据
     function getCurrentTimes() {

        var start = ($scope.currentPage - 1) * $scope.itemsPerPage;
        $scope.memoDataNow = $scope.memoData.slice(start, start + $scope.itemsPerPage);
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
        return Y + '-' + M + '-' + D + ' ' + H + ':' + Mi + ':' + S;
    }
}]);



