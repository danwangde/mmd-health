'use strict';
app.controller('addComponentTypeCtrl', ['$scope', '$modalInstance', 'data', '$compile', '$http', '$modal', function ($scope, $modalInstance, data, $compile, $http, $modal) {
    console.log(data);
    $scope.typeData = data;
    if (!$scope.typeData.dataattr.length) {
        $scope.typeData .dataattr = [{attrname: '', showtype: 1, showvalue: ''}]
    }
    let attrObj = {attrname: '', showtype: 1, showvalue: ''};
    $scope.addAttr = function () {
        $scope.typeData.dataattr.push(angular.copy(attrObj))
    };
    $scope.delete = async function (index) {
       $scope.typeData.dataattr.splice(index,1)
    };

    $scope.saveAddComponenType = function () {
        if($scope.typeData.datacom.title == '新建构件类型'){
            $http.post('/compontype/add', $scope.typeData).then(function (req) {
                console.log($scope.typeData);
                if (req.data == 1) {
                    $modalInstance.close();
                    alert('构件类型添加成功')
                } else {
                    alert('构件类型添加失败')
                }
            })
        }else if($scope.typeData.datacom.title == '修改构件类型'){
            $http.post('/compontype/updateattr', $scope.typeData).then(function (req) {
                console.log($scope.typeData);
                if (req.data == 1) {
                    $modalInstance.close();
                    alert('构件类型修改成功')
                } else {
                    alert('构件类型修改失败')
                }

            })
        }

    };
    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    }
}]);
app.controller('componentWeightCtrl', ['$scope', '$modalInstance', 'data', '$compile', '$http', '$modal', function ($scope, $modalInstance, data, $compile, $http, $modal) {
    $scope.typewData=data;
   let weightObj={
       ComponentType:data.ComponentType,
       ComponentTypeID:data.ComponentTypeID
   };
    $http.get('/compontype/selweight?ComponentTypeID='+data.ComponentTypeID).then(function(req){
        $scope.weightData=req.data;
        weightObj.weightData= $scope.weightData;
        angular.forEach( $scope.weightData,function(v,i){
            switch ($scope.weightData[i].typename) {
                case "035001":
                    $scope.weightData[i].name = '梁桥';
                    break;
                case "035002":
                    $scope.weightData[i].name = '悬臂+挂梁';
                    break;
                case "035003":
                    $scope.weightData[i].name = '桁架桥';
                    break; case "035004":
                $scope.weightData[i].name = '刚构桥';
                break; case "035005":
                $scope.weightData[i].name = '钢结构拱桥';
                break;
                case "035006":
                    $scope.weightData[i].name = '圬工拱桥（无拱上结构）';
                    break; case "035007":
                $scope.weightData[i].name = '圬工拱桥（有拱上结构）';
                break; case "035008":
                $scope.weightData[i].name = '钢筋混凝土拱桥';
                break;
                case "035009":
                    $scope.weightData[i].name = '人行天桥（梁桥）';
                    break;
                case "035010":
                    $scope.weightData[i].name = '人行天桥（钢桁架桥）';
                    break;
            }
        })
    });

    $scope.saveComponenTypeWeight=function(){
        $http.post('/compontype/updateweight',weightObj).then(function (req) {
            if (req.data == 1) {
                $modalInstance.close();
                alert('权重修改成功')
            } else {
                alert('权重修改添加失败')
            }

        })
    }
    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    }
}]);
app.controller('managePublicComponents_controller', ['$scope', '$modal', '$http','$filter', function ($scope, $modal, $http, $filter) {
    let data;
    [$scope.compontype, $scope.totalItems, $scope.compontypeNow] = [[], [], []];
    [$scope.currentPage, $scope.itemsPerPage, $scope.maxSize] = [1, 12, 3];

    async function getComponType() {
        $http.get('/compontype/select').then(function (req) {
            $scope.compontype = req.data;
            [...$scope.compontypeNow] = $scope.compontype;
            $scope.totalItems = $scope.compontype.length;
            getCurrentTimes();
            angular.forEach( $scope.compontype,function(v,i){
                switch ($scope.compontype[i].ComponentType) {
                    case "030001":
                        $scope.compontype[i].ComponentTypeCN = '桥梁构件';
                        break;
                    case "030002":
                        $scope.compontype[i].ComponentTypeCN = '人行通道构件';
                        break;
                }
                switch ($scope.compontype[i].SuperStructure) {
                    case "001001":
                        $scope.compontype[i].SuperStructureCN = '跨';
                        break;
                    case "001002":
                        $scope.compontype[i].SuperStructureCN = '桥台';
                        break;
                    case "001003":
                        $scope.compontype[i].SuperStructureCN = '桥墩';
                        break;
                    case "001004":
                        $scope.compontype[i].SuperStructureCN = '桥面系';
                        break;
                    case "001006":
                        $scope.compontype[i].SuperStructureCN = '附属设施';
                        break;
                    case "001005":
                        $scope.compontype[i].SuperStructureCN = '抗震设施';
                        break;
                    case "079001":
                        $scope.compontype[i].SuperStructureCN = '主体构造物';
                        break;
                    case "079002":
                        $scope.compontype[i].SuperStructureCN = '出入口';
                        break;
                    case "079003":
                        $scope.compontype[i].SuperStructureCN = '道面';
                        break;
                    case "079004":
                        $scope.compontype[i].SuperStructureCN = '排水系统';
                        break;
                    case "079005":
                        $scope.compontype[i].SuperStructureCN = '附属设施';
                        break;
                }
                switch ($scope.compontype[i].SuperBridgeAttr) {
                    case "032001":
                        $scope.compontype[i].SuperBridgeAttrCN = '市政';
                        break;
                    case "032002":
                        $scope.compontype[i].SuperBridgeAttrCN = '公路';
                        break;
                    case "032003":
                        $scope.compontype[i].SuperBridgeAttrCN = '市政和公路';
                        break;

                }
            })


            console.log($scope.compontype)
        })
    }
    getComponType();
    $scope.search = function () {
        $scope.compontypeNow = $filter('component')($scope.compontype, $scope.componentName, $scope.type);
    }
    // 返回当前页对应的数据
    function getCurrentTimes() {
        var start = ($scope.currentPage - 1) * $scope.itemsPerPage;
        $scope.compontypeNow= $scope.compontype.slice(start, start + $scope.itemsPerPage);
    }

    // 切换分页
    $scope.changePage = function () {
        getCurrentTimes();
    };

    $scope.addBtn = function () {
        data = {
            datacom: {
                title: '新建构件类型',
                ComponentType: '',
                SuperStructure: '',
                ComponentTypeName: '',
                SuperBridgeAttr: ''
            },
            dataattr: [{attrname: '', showtype: 1, showvalue: ''}]
        };
        let modalInstance = $modal.open({
            templateUrl: 'addComponentType.html',
            controller: 'addComponentTypeCtrl',
            size: 'lg',
            backdrop: 'static',
	        keyboard: false,
            resolve: {
                data: function () {
                    return data
                }
            }
        });
        modalInstance.result.then(function () {
            getComponType()
        }, function () {

        });
    };
    $scope.weightBtn = function (x) {
        let modalInstance = $modal.open({
            templateUrl: 'componentWeight.html',
            controller: 'componentWeightCtrl',
            size: '',
            backdrop: 'static',
	        keyboard: false,
            resolve: {
                data: function () {
                    return x
                }
            }
        });
        modalInstance.result.then(function () {
        }, function () {

        });
    };
    $scope.updateBtn = async function (x) {
        x.title = '修改构件类型';

        await $http.get('/compontype/selattr?ComponentTypeID=' + x.ComponentTypeID).then(function (req) {
            data = {
                datacom: x,
                dataattr: req.data
            }
        });
        let modalInstance = $modal.open({
            templateUrl: 'addComponentType.html',
            controller: 'addComponentTypeCtrl',
            size: 'lg',
            backdrop: 'static',
	        keyboard: false,
            resolve: {
                data: function () {
                    return data
                }
            }
        });
        modalInstance.result.then(function () {
            getComponType()
        }, function () {

        });
    };
    $scope.delBtn = function (x) {
        $http.get('/compontype/delete?ComponentTypeID=' + x.ComponentTypeID).then(function (req) {
            if (req.data == 1) {
                alert('删除成功')
            } else {
                alert('删除失败')
            }
            getComponType();
        })
    };


}]);
