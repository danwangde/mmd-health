app.controller('managePublicDiseases_controller', ['$scope', '$http', '$modal', '$log','$filter', function ($scope, $http, $modal, $log, $filter) {

    $scope.damageType = [{
        name: '桥梁构件'
    },
    {
        name: '人行通道构件'
    }
    ];

    [$scope.disBank, $scope.totalItems, $scope.disBankNow] = [[], [], []];
    [$scope.currentPage, $scope.itemsPerPage, $scope.maxSize] = [1, 12, 3];

    function diseaseBtn() {
        let url = '/disease/select';
        $http.get(url).then(function (response) {
            $scope.disBank = response.data;
            console.log(response.data);
            [...$scope.disBankNow] = $scope.disBank;
            $scope.totalItems = $scope.disBank.length;
            getCurrentTimes();
            for (let item of response.data) {
                switch (item.CompType) {
                    case '104001':
                        item.CompType = 'PC或RC梁氏构件';
                        break;
                    case '104002':
                        item.CompType = '钢结构物';
                        break;
                    case '104003':
                        item.CompType = '横向联系';
                        break;
                    case '104004':
                        item.CompType = '支座';
                        break;
                    case '104005':
                        item.CompType = '防落梁装置';
                        break;
                    case '104006':
                        item.CompType = '拱桥横向联系';
                        break;
                    case '104007':
                        item.CompType = '主拱圈';
                        break;
                    case '104008':
                        item.CompType = '实腹式';
                        break;
                    case '104009':
                        item.CompType = '空腹式';
                        break;
                    case '104010':
                        item.CompType = '外部装饰板';
                        break;
                }
            }
            angular.forEach($scope.disBank, function (v, i) {
                switch ($scope.disBank[i].Type) {
                    case "030001":
                        $scope.disBank[i].Type = '桥梁构件';
                        break;
                    case "030002":
                        $scope.disBank[i].Type = '人行通道构件';
                        break;
                }
            })
        })
    }
    diseaseBtn();
    $scope.search = function () {
        $scope.disBankNow = $filter('disease')($scope.disBank, $scope.daType, $scope.type);
    }
    // 返回当前页对应的数据
    function getCurrentTimes() {
        var start = ($scope.currentPage - 1) * $scope.itemsPerPage;
        $scope.disBankNow = $scope.disBank.slice(start, start + $scope.itemsPerPage);
    }

    // 切换分页
    $scope.changePage = function () {
        getCurrentTimes();
    };



    $scope.add = function () {
        let data = {
            datadis: {
                Type: '',
                RelateSites: '',
                CompType: '',
                DamageType: '',
                DiseaseDefine: '',
                DamageExplain: ''
            },
            datascore: [{
                DamGrade: '',
                Score: ''
            }]
        };
        var modalInstance = $modal.open({
            templateUrl: 'myModalContent.html',
            controller: 'ModalInstanceCtrl',
            size: 'lg',
            backdrop: 'static',
	        keyboard: false,
            resolve: {
                data: function () {
                    return data;
                }

            }
        });

        modalInstance.result.then(function (rs) {
            diseaseBtn();
        }, function () {
            $log.info('Modal dismissed at: ' + new Date());
        });
    }
    $scope.update = async function (size) {
        let datascore = [];

        let url = '/disease/selScore?DiseaseID=' + size.DiseaseID;
        let res = await $http.get(url);
        datascore = res.data;
        console.log(datascore);
        if (size.Type == '桥梁构件') {
            size.Type = '030001';
        } else if (size.Type == '人行通道构件') {
            size.Type = '030002';
        }
        let data = {
            datadis: size,
            datascore: datascore
        };
        var modalInstance = $modal.open({
            templateUrl: 'myModalContent1.html',
            controller: 'ModalInstanceCtrl1',
            size: 'lg',
            backdrop: 'static',
	        keyboard: false,
            resolve: {
                items: function () {
                    return data;
                }

            }
        });

        modalInstance.result.then(function (rs) {
            diseaseBtn();
        }, function () {
            $log.info('Modal dismissed at: ' + new Date());
        });
    }


    $scope.delete = async function (item) {
        let url = '/disease/delete?DiseaseID=' + item.DiseaseID;
        try {
            let res = await $http.get(url);
            if (res.data == 1) {
                alert('病害删除成功');
            } else {
                alert('病害删除成功');
            }
            diseaseBtn();
        } catch (e) {

        }
    }


}]);

app.controller('ModalInstanceCtrl1', ['$scope', '$modalInstance', 'items', '$http', function ($scope, $modalInstance, items, $http) {
    console.log(items)
    switch (items.datadis.CompType) {
        case 'PC或RC梁氏构件':
            items.datadis.CompType = '104001';
            break;
        case '钢结构物':
            items.datadis.CompType = '104002';
            break;
        case '横向联系':
            items.datadis.CompType = '104003';
            break;
        case '支座':
            items.datadis.CompType = '104004';
            break;
        case '防落梁装置':
            items.datadis.CompType = '104005';
            break;
        case '拱桥横向联系':
            items.datadis.CompType = '104006';
            break;
        case '主拱圈':
            items.datadis.CompType = '104007';
            break;
        case '实腹式':
            items.datadis.CompType = '104008';
            break;
        case '空腹式':
            items.datadis.CompType = '104009';
            break;
        case '外部装饰板':
            items.datadis.CompType = '104010';
            break;
    }
    $scope.addData = items;
    if ( !$scope.addData.datascore.length) {
        $scope.addData.datascore = [{DamGrade: "", Score: ""}];
    }
    let scoreObj = {
        DamGrade: '',
        Score: ''
    };

    function selCom() {
        if ($scope.addData.datadis.Type == '030001') {
            let url = '/disease/selComData?CompType=' + $scope.addData.datadis.CompType + '&type='+$scope.addData.datadis.Type;
            $http.get(url).then(function (res) {
                $scope.ComponentType = res.data.component;
                $scope.addData.select = res.data.select;
                console.log(res.data)
            })
        }else {
            let url = '/disease/selComDataPass?CompType=' + $scope.addData.datadis.CompType + '&type='+$scope.addData.datadis.Type;
            $http.get(url).then(function (res) {
                $scope.ComponentType = res.data.component;
                $scope.addData.select = res.data.select;
                console.log(res.data)
            })
        }
       
    }
    selCom();

    $scope.addScore = function () {
        $scope.addData.datascore.push(angular.copy(scoreObj));
    }
    $scope.delete = async function (index) {
        $scope.addData.datascore.splice(index,1)
    };
    $scope.saveUpdateDisease = async function () {
        let url = '/disease/update';
        try {
            let res = await $http.post(url, $scope.addData);
            console.log($scope.addData);
            if (res.data == 1) {
                $modalInstance.close();
                alert('病害修改成功');
            }
        } catch (e) {
            alert('病害修改失败');
        }
    }

    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    }

}]);
app.controller('ModalInstanceCtrl', ['$scope', '$modalInstance', 'data', '$http', function ($scope, $modalInstance, data, $http) {
    console.log(data);
    $scope.addData = data;
    let scoreObj = {
        DamGrade: '',
        Score: ''
    };
    $scope.addScore = function () {
        $scope.addData.datascore.push(angular.copy(scoreObj));
    }
    $scope.delete = async function (index) {
        $scope.addData.datascore.splice(index,1)
    };
    $scope.saveAddDisease = async function () {
        let url = '/disease/add';
        try {
            let res = await $http.post(url, $scope.addData);
            if (res.data == 1) {
                $modalInstance.close();
                alert('病害添加成功');
            } else {
                alert('病害添加失败');
            }

            diseaseBtn();
        } catch (e) {

        }
    }

    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    }

   $scope.getCom = async function(type) {
        
        if(type == '030001') {
            let url = '/disease/selCom?type='+type;
            $http.get(url).then(function (res) {
                $scope.ComponentType = res.data;
            })
        }else {
            let url = '/disease/selComPas?type='+type;
            $http.get(url).then(function (res) {
                $scope.ComponentType = res.data;
            })
        }
       
    }

}]);
