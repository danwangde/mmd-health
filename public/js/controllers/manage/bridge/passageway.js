'use strict';
app.controller('addDocumentCtrl', ['$scope', '$modalInstance', 'data', '$compile', '$http', '$modal', function ($scope, $modalInstance, data, $compile, $http, $modal) {
    $scope.ducumentData = data;
    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
    $scope.saveDocument = function () {
        let fd = new FormData();
        let upload_file = document.getElementById("file6").files[0];
        console.log(upload_file)
        fd.append('file', upload_file);
        fd.append('PassagewayID', $scope.ducumentData.PassagewayID);
        fd.append('DocumentName', $scope.ducumentData.DocumentName);
        fd.append('DocumentType', $scope.ducumentData.DocumentType);
        fd.append('DocumentUnit', $scope.ducumentData.DocumentUnit);
        $http.post('/pdocumentation/insert_file', fd, { headers: { 'Content-Type': undefined }, transformRequest: angular.identity }).then(function (req) {
            if (req.data == 1) {
                $modalInstance.close();
            }
        });

    }
}]);
app.controller('addHistoryCtrl', ['$scope', '$modalInstance', 'data', '$compile', '$http', '$modal', function ($scope, $modalInstance, data, $compile, $http, $modal) {

    $scope.history = data;
    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
    $scope.saveHistory = function () {
        if ($scope.history.title == '新增历史') {
            $http.post('/phistory/insert', $scope.history).then(function (req) {
                if (req.data == 1) {
                    alert('新增成功');
                    $modalInstance.close();
                } else {
                    alert('新增失败')
                }
            })
        } else if ($scope.history.title == '修改历史') {
            $http.post('/phistory/update', $scope.history).then(function (req) {
                if (req.data == 1) {
                    alert('修改成功');
                    $modalInstance.close();
                } else {
                    alert('修改失败')
                }
            })
        }
    }
}]);

app.controller('addImageCtrl', ['$scope', '$modalInstance', 'data', '$compile', '$http', '$modal', function ($scope, $modalInstance, data, $compile, $http, $modal) {
    $scope.title = '新增图片';
    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
    $scope.id = data.PassagewayID;
    $scope.facilities_type = 1;
    $scope.saveImage = async function () {
        let fd = new FormData();
        let upload_file = document.getElementById("file").files[0];
        fd.append('file', upload_file);
        fd.append('facilities_id', $scope.id);
        fd.append('facilities_type', $scope.facilities_type);
        $http.post('/bridgeinfo/insert_photos', fd, { headers: { 'Content-Type': undefined }, transformRequest: angular.identity }).then(function (req) {

            if (req.data == 1) {
                $modalInstance.close();
                alert('新增成功');
            }
        });
    };
}]);
app.controller('addVideoCtrl', ['$scope', '$modalInstance', 'data', '$compile', '$http', '$modal', function ($scope, $modalInstance, data, $compile, $http, $modal) {
    $scope.title = '新增视频';
    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    }
    $scope.id = data;
    $scope.facilities_type = 1;
    $scope.saveImage = async function () {
        let fd = new FormData();
        let upload_file = document.getElementById("file2").files[0];
        fd.append('file', upload_file);
        fd.append('facilities_id', data);
        fd.append('facilities_type', 1);
        $http.post('/bridgeinfo/insert_video', fd, { headers: { 'Content-Type': undefined }, transformRequest: angular.identity }).then(function (req) {

            if (req.data == 1) {
                $modalInstance.close();
                alert('新增成功');
            }else{
                alert('新增失败');
            };
            
        });
    };
}]);
app.controller('ModalInstanceCtrl', ['$scope', '$http', '$modalInstance', 'data', '$modal','$filter', function ($scope, $http, $modalInstance, data, $modal, $filter) {

    let treeBranch;
    $scope.my_data = data.passagewayTree;
    $scope.manageType = data.manageType;
    $scope.passagewayDetail = data.passagewayDetail[0];
    $scope.passagewayItem = data.passagewayItem;
    $scope.checkData = data.checkData;
    for (let item of $scope.checkData) {
        if ($scope.passagewayDetail.CheckUint == item.id) {
            item.select = true;
        } else {
            item.select = false;
        }
    }
    $scope.curingData = data.curingData;
    for (let item of $scope.curingData) {
        if ($scope.passagewayDetail.CuringUnit == item.id) {
            item.select = true;
        } else {
            item.select = false;
        }
    }
    function selInfo() {
        $http.post('/passagewayinfo/selInfo', $scope.passagewayItem.PassagewayID).then(function (req) {
            $scope.passagewayDetail = req.data
        });
    }
    $scope.showMapPop = false;
    $scope.getLocation = function () {
        setTimeout(Map, 100);
        $scope.showMapPop = true;
    };
    $scope.off = function () {
        $scope.showMapPop = false;
    };
    function Map() {
        var map = new BMap.Map("allmap");
        var geolocation = new BMap.Geolocation();
        if ($scope.passagewayDetail.ChannelLongitude == '' || $scope.passagewayDetail.ChannelLatitude == '') {
            geolocation.getCurrentPosition(function (r) {
                if (this.getStatus() == BMAP_STATUS_SUCCESS) {
                    map.centerAndZoom(new BMap.Point(r.point.lng, r.point.lat), 11);
                    var mk = new BMap.Marker(r.point);
                    map.addOverlay(mk);
                    map.panTo(r.point);
                    console.log('您的位置：' + r.point.lng + ',' + r.point.lat);
                }
                else {
                    console.log('failed' + this.getStatus());
                }
            }, { enableHighAccuracy: true })
        } else {
            map.centerAndZoom(new BMap.Point($scope.passagewayDetail.ChannelLongitude, $scope.passagewayDetail.ChannelLatitude), 11);
            var new_point = new BMap.Point($scope.passagewayDetail.ChannelLongitude, $scope.passagewayDetail.ChannelLatitude);
            var marker = new BMap.Marker(new_point);  // 创建标注
            map.addOverlay(marker);
        }

        //map.centerAndZoom(new BMap.Point(116.404, 39.915), 11);
        // 将标注添加到地图中
        map.enableScrollWheelZoom(true);     //开启鼠标滚轮缩放

        function showInfo(e) {
            $scope.passagewayDetail.locationInfo = e.point.lng + "," + e.point.lat;
            $scope.showMapPop = false;
        }
        map.addEventListener("click", showInfo);
    }
    $scope.savePassageway = function () {
        $http.post('/passagewayinfo/update', $scope.passagewayDetail).then(function (req) {
            if (req.data == "修改成功") {
                selInfo();
                alert(req.data)
            }
        })
    };


    function getComponent(typeid, pid, id) {
        $http.get('/passagewayinfo/selcom?typeid=' + typeid + '&PassagewayID=' + pid + '&id=' + id).then(function (req) {
            $scope.Cominfo = req.data;
        })
    }
    function getEntrance(eid, pid) {
        $http.get('/entrance/select?EntranceID=' + eid + '&PassagewayID=' + pid).then(function (req) {
            $scope.Cominfo = req.data.data2;
            $scope.entranceData = req.data.data1[0];
        })
    }
    function getRoadsurface(rid, pid) {
        $http.get('/surface/select?RoadSurfaceID=' + rid + '&PassagewayID=' + pid).then(function (req) {
            $scope.Cominfo = req.data.data2;
            $scope.roadsurfaceData = req.data.data1[0];
        })
    }
    $scope.loadHtml = 'tpl/modal/passagewayDetail.html';
    $scope.my_tree_handler = async function (branch) {
        $scope.type = branch.type;
        treeBranch = branch;
        if (branch.level == 1) {
            await selInfo();
            $scope.loadHtml = 'tpl/modal/passagewayDetail.html';
        } else if (branch.level == 2 && (branch.typeid == 5 || branch.typeid == 1 || branch.typeid == 4)) {
            $scope.StructureID = branch.id;
            $scope.StructureTypeid = branch.typeid;
            await getComponent(branch.typeid, $scope.passagewayItem.PassagewayID, branch.id);
            $scope.loadHtml = 'tpl/modal/component.html';
            $scope.basicsHtml = '';
            return
        }
        else if (branch.level == 2 && branch.typeid == 2 || branch.typeid == 3) {
            $scope.loadHtml = '';
            $scope.basicsHtml = '';
        }
        else if (branch.level == 3 && branch.entranceid) {
            $scope.StructureID = branch.entranceid;
            await getEntrance(branch.entranceid, $scope.passagewayItem.PassagewayID);
            $scope.loadHtml = 'tpl/modal/component.html';
            $scope.basicsHtml = 'tpl/modal/entranceDetail.html';
        }
        else if (branch.level == 3 && branch.roadsurfaceid) {
            $scope.StructureID = branch.roadsurfaceid;
            await getRoadsurface(branch.roadsurfaceid, $scope.passagewayItem.PassagewayID);
            $scope.loadHtml = 'tpl/modal/component.html';
            $scope.basicsHtml = 'tpl/modal/roadsurfaceDetail.html';
        }

    };
    $scope.addItem = function () {
        if (treeBranch == undefined) {
            alert("请选择节点");
            return false
        }
        if (treeBranch.typeid == 2) {
            let EntranceName = prompt("请输入新增出入口名称", "");
            if (EntranceName) {
                let obj = {
                    PassagewayID: $scope.passagewayDetail.PassagewayID,
                    EntranceName: EntranceName
                };
                $http.post("/entrance/insert", obj).then(function (response) {
                    if (response.data == 1) {
                        getTree()

                    } else {
                        alert('新增失败')
                    }
                })
            }
        } else if (treeBranch.typeid == 3) {
            let surfaceName = prompt("请输入新增道面名称", "");
            if (surfaceName) {
                let obj = {
                    PassagewayID: $scope.passagewayDetail.PassagewayID,
                    SurfaceName: surfaceName
                };
                $http.post("/surface/insert", obj).then(function (response) {
                    if (response.data == 1) {
                        getTree()

                    } else {
                        alert('新增失败')
                    }
                })
            }
        } else {
            alert('请选择出入口或道面增加节点')
        }
    };
    $scope.delItem = function () {

        if (treeBranch == undefined) {
            alert("请选择节点");
            return false
        }
        if (treeBranch.level == 3 && treeBranch.entranceid) {
            if (confirm("确定删除" + treeBranch.label + "吗")) {
                $http.get('/entrance/delete?EntranceID=' + treeBranch.entranceid).then(function (req) {
                    if (req.data == 1) {
                        getTree()
                    } else {
                        alert('删除失败')
                    }
                })
            }
        }
        else if (treeBranch.level == 3 && treeBranch.roadsurfaceid) {
            if (confirm("确定删除" + treeBranch.label + "吗")) {
                $http.get('/surface/delete?RoadSurfaceID=' + treeBranch.roadsurfaceid).then(function (req) {
                    if (req.data == 1) {
                        getTree()
                    } else {
                        alert('删除失败')
                    }
                })
            }
        }
        else {
            alert('该节点不能被删除')
        }

    }
    function getTree() {
        let getTree = "/passagewayinfo/tree?PassagewayID=" + $scope.passagewayDetail.PassagewayID + "&PassagewayName=" + $scope.passagewayDetail.PassagewayName;
        $http.get(getTree).then(function (response) {
            $scope.my_data = response.data;
        });
    }
    $scope.saveRoadsurface = function () {
        $http.post('/surface/update', $scope.roadsurfaceData).then(function (req) {
            if (req.data == 1) {
                alert('修改成功');
                getRoadsurface($scope.roadsurfaceData.RoadSurfaceID, $scope.roadsurfaceData.PassagewayID)
            } else {
                alert('修改失败')
            }
        })
    };
    $scope.saveEntrance = function () {
        $http.post('/entrance/update', $scope.entranceData).then(function (req) {
            if (req.data == 1) {
                alert('修改成功')
                getEntrance($scope.entranceData.EntranceID, $scope.entranceData.PassagewayID)
            } else {
                alert('修改失败')
            }
        })
    };
    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
    $scope.addComponent = function () {
        let modalInstance = $modal.open({
            templateUrl: 'addComponent.html',
            controller: 'addComponentCtrl',
            size: '',
            backdrop: 'static',      
	        keyboard: false,
            resolve: {
                data: function () {
                    return {
                        title: '新增构件',
                        type: $scope.type,
                        StructureID: $scope.StructureID,
                        PassagewayID: $scope.passagewayDetail.PassagewayID
                    }
                }
            }
        });
        modalInstance.result.then(function (SuperStructure) {
            if (SuperStructure == '079002') {
                getEntrance($scope.StructureID, $scope.passagewayItem.PassagewayID);
            } else if (SuperStructure == '079003') {
                getRoadsurface($scope.StructureID, $scope.passagewayItem.PassagewayID);
            } else {
                getComponent($scope.StructureTypeid, $scope.passagewayItem.PassagewayID, $scope.StructureID);
            }
        }, function () {
        });

    };
    $scope.updateComponent = async function (x) {
        let updateComponentData;
        await $http.get('/pcomponent/select?ComponentID=' + x.ComponentID).then(function (req) {
            updateComponentData = req.data;
            updateComponentData.title = '修改构件';
            updateComponentData.res.SuperStructure = $scope.type;
            updateComponentData.res.StructureID = $scope.StructureID;
            updateComponentData.res.PassagewayID = $scope.passagewayDetail.PassagewayID;
            updateComponentData.res.ComponentID = x.ComponentID;
        });
        let modalInstance = $modal.open({
            templateUrl: 'updataComponent.html',
            controller: 'updataComponentCtrl',
            size: '',
            backdrop: 'static',      
	        keyboard: false,
            resolve: {
                data: function () {
                    return updateComponentData
                }
            }
        });
        modalInstance.result.then(function (SuperStructure) {
            if (SuperStructure == '079002') {
                getEntrance($scope.StructureID, $scope.passagewayItem.PassagewayID);
            } else if (SuperStructure == '079003') {
                getRoadsurface($scope.StructureID, $scope.passagewayItem.PassagewayID);
            } else {
                getComponent($scope.StructureTypeid, $scope.passagewayItem.PassagewayID, $scope.StructureID);
            }
        }, function () {
        });
    };
    $scope.delComponent = function (x) {
        if (confirm('确认删除该构件吗')) {
            $http.get('/pcomponent/deleteCom?ComponentID=' + x.ComponentID).then(function (req) {
                if (req.data == 1) {
                    if (x.SuperStructure == '079002') {
                        getEntrance($scope.StructureID, $scope.passagewayItem.PassagewayID);
                    } else if (x.SuperStructure == '079003') {
                        getRoadsurface($scope.StructureID, $scope.passagewayItem.PassagewayID);
                    } else {
                        getComponent($scope.StructureTypeid, $scope.passagewayItem.PassagewayID, $scope.StructureID);
                    }
                } else {
                    alert('删除失败')
                }
            })
        }
    };
    $scope.historyBtn = function () {
        $http({
            method: 'post',
            url: '/phistory/select',
            data: { PassagewayID: $scope.passagewayDetail.PassagewayID }
        }).then(function (response) {
            $scope.historyData = response.data;
            console.log(response.data)
            for (let item of $scope.historyData) {
                item.BuildDate = get_date_str(new Date(item.BuildDate));
            }
            [...$scope.historyDataNow] = $scope.historyData;
        });
    };
    $scope.his = { histype: '', histime: '' };
    $scope.searchHis = function () {
        $scope.historyDataNow = $filter('BriHis')($scope.historyData, $scope.his.histype, $scope.his.histime);
    };
    $scope.documentBtn = function () {
        $http.get('/pdocumentation/select_file?PassagewayID=' + $scope.passagewayDetail.PassagewayID).then(function (req) {
            $scope.document = req.data;

            [...$scope.documentNow] = $scope.document;
        })
    };
    $scope.document = { documentname: '', documenttype: '' };
    $scope.searchDocu = function () {
        $scope.documentNow = $filter('document')($scope.document, $scope.document.documentname, $scope.document.documenttype);
    };
    $scope.imageBtn = async function () {
        let getUrl = '/bridgeinfo/select_photos?facilities_id=' + $scope.passagewayDetail.PassagewayID + '&facilities_type=1';
        let res = await $http.get(getUrl);
        $scope.$apply(function () {
            $scope.items = res.data;
            $scope.num = 0;
            $scope.changeImg = function (item) {
                $scope.num = item;

            };
        })
    };
    $scope.videoBtn = async function () {
        let getUrl = '/bridgeinfo/select_video?facilities_id=' + $scope.passagewayDetail.PassagewayID + '&facilities_type=1';
        let res = await $http.get(getUrl);
        $scope.$apply(function () {
            $scope.videos = res.data;
        })
    };
    $scope.addVideo = async function () {
        var modalInstance = $modal.open({
            templateUrl: 'addVideo.html',
            controller: 'addVideoCtrl',
            size: '',
            backdrop: 'static',      
	        keyboard: false,
            resolve: {
                data: function () {
                    return $scope.passagewayDetail.PassagewayID;
                }
            }
        });
        modalInstance.result.then(function () {
            $scope.videoBtn();
        }, function () {

        });
    };

    $scope.delVideo = async function (x) {
        if (confirm('确认删除该视频吗?')) {
            let delUrl = '/bridgeinfo/delete_video?id=' + x.id;
            let res = await $http.get(delUrl);
            if (res.data == '1') {
                alert('删除成功');
                $scope.videoBtn();
            } else {
                alert('删除失败')
            };
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
        return Y + '-' + M + '-' + D;
    }

    $scope.addDocument = function (item) {
        item.title = '新增文档';
        item.DocumentName = '';
        item.DocumentType = '';
        item.PassagewayID = $scope.passagewayDetail.PassagewayID;
        var modalInstance = $modal.open({
            templateUrl: 'addDocument.html',
            controller: 'addDocumentCtrl',
            size: '',
            backdrop: 'static',      
	        keyboard: false,
            resolve: {
                data: function () {
                    return item
                }
            }
        });
        modalInstance.result.then(function () {
            $scope.documentBtn();
        }, function () {

        });
    };
    $scope.delDocument = function (item) {
        if (confirm('确认删除该文档吗')) {
            $http.get('/pdocumentation/delete_file?PassDocumentID=' + item.PassDocumentID + '&file=' + item.FileName).then(function (req) {
                if (req.data == 1) {
                    $scope.documentBtn();
                } else {
                    alert('删除失败')
                }
            })
        }
    };
    $scope.history = function (item, num) {
        if (num == 1) {
            item.title = '修改历史'
        } else if (num == 0) {
            item.title = '新增历史'
        }
        item.PassagewayID = $scope.passagewayDetail.PassagewayID;
        var modalInstance = $modal.open({
            templateUrl: 'addHistory.html',
            controller: 'addHistoryCtrl',
            size: '',
            backdrop: 'static',      
	        keyboard: false,
            resolve: {
                data: function () {
                    return item
                }
            }
        });
        modalInstance.result.then(function () {
            $scope.historyBtn();
        }, function () {

        });
    };
    $scope.delHistory = function (item) {
        if (confirm('确认删除该历史记录吗')) {
            $http.post('/phistory/delete', item).then(function (req) {
                if (req.data == 1) {
                    $scope.historyBtn();
                    alert('删除成功')
                } else {
                    alert('删除失败')
                }
            })
        }
    };

    $scope.addImage = function () {
        var modalInstance = $modal.open({
            templateUrl: 'addImage.html',
            controller: 'addImageCtrl',
            size: '',
            backdrop: 'static',      
	        keyboard: false,
            resolve: {
                data: function () {
                    return $scope.passagewayDetail;
                }
            }
        });
        modalInstance.result.then(function () {
            $scope.imageBtn()
        }, function () {

        });
    };
    $scope.delImage = async function (item) {
        console.log(item)
        if (confirm('确认删除该照片吗?')) {
            let url = '/bridgeinfo/deleteImage?id=' + $scope.items[$scope.num].id;
            let res = await $http.get(url);
            if (res.data == 1) {
                alert('删除成功')
                $scope.imageBtn();
            }
        }

    }
}]);
app.controller('addComponentCtrl', ['$scope', '$modalInstance', 'data', '$compile', '$http', '$modal', function ($scope, $modalInstance, data, $compile, $http, $modal) {

    $scope.title = data.title;
    $scope.addData = {
        ComponentNum: $scope.ComponentNum,
        ComponentName: $scope.ComponentName,
        ComponentTypeName: $scope.ComponentTypeName,
        PassagewayID: data.PassagewayID,
        SuperStructure: data.type,
        StructureID: data.StructureID,
    };
    let tempatle = new Map([
        ['031001', ' <div class="form-group">\n' +
            '            <label class="col-lg-2 control-label">{{item.attrname}}\n' +
            '            </label>\n' +
            '            <div class="col-lg-8">\n' +
            '                <select class="form-control" ng-model="item.select"  ng-options="x.name for x in item.showvalue">\n' +
            '                </select>\n' +
            '            </div>\n' +
            '        </div>'],
        ['031002', ' <div class="form-group">\n' +
            '            <label class="col-lg-2 control-label">{{item.attrname}}</label>\n' +
            '            <div class="col-lg-8">\n' +
            '                <label class="checkbox-inline" ng-repeat="x in item.showvalue">\n' +
            '                    <input type="checkbox" value="option1" ng-model="x.select"><i></i> {{x.name}}\n' +
            '                </label>\n' +
            '            </div>\n' +
            '        </div>'],
        // ['031003', '<div class="form-group"><lable class="col-lg-2 control-label">{{item.attrname}}</lable><div class="col-lg-8"> \n' +
        // '              <label ng-repeat="x in item.default" class="radio-inline">\n' +
        // '                <input type="radio" name="optionsRadios"  value={{x}}  ng-model=item.select>\n' +
        // '              {{x.name}}\n' +
        // '              </label>\n' +
        // '            </div></div>'],
        ['031004', '<div class="form-group"> <label class="col-lg-2 control-label">{{item.attrname}}</label><div class="col-lg-8"> <input type="text" class="form-control" ng-model="item.showvalue[0].name"></div></div>']]);
    $scope.saveAddComponent = function () {
        for (let x of $scope.resattr) {
            delete x.tempatle;
        }
        $scope.addData.comattr = $scope.resattr;
        $http.post("/pcomponent/add", $scope.addData).then(function (req) {
            if (req.data == 1) {
                $modalInstance.close($scope.addData.SuperStructure);
            } else {
                alert('构件新增失败');
            }
        })
    };
    $scope.changeComponenType = async function () {
        $scope.resattr = [];
        let selpubUrl = '/pcomponent/selpub?ComponentTypeName=' + $scope.addData.ComponentTypeName.ComponentTypeName;
        await $http.get(selpubUrl).then(function (req) {
            if (req.data !== 0) {
                $scope.resattr = req.data.resattr;
                for (let x of $scope.resattr) {
                    x.tempatle = tempatle.get(x.showtype)
                }

            } else {
            }

        });
    };
    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };

    function getComponenType() {
        $http.get('/pcomponent/selType?type=' + data.type).then(function (req) {
            $scope.ComponentType = req.data;
        })
    }
    getComponenType();
}]);
app.controller('updataComponentCtrl', ['$scope', '$modalInstance', 'data', '$compile', '$http', '$modal', function ($scope, $modalInstance, data, $compile, $http, $modal) {

    $scope.title = data.title;
    $scope.updateData = data.res;
    $scope.rescom = data.rescom;
    let tempatle = new Map([
        ['031001', ' <div class="form-group">\n' +
            '            <label class="col-lg-2 control-label">{{item.attrname}}\n' +
            '            </label>\n' +
            '            <div class="col-lg-8">\n' +
            '                <select class="form-control" ng-model="item.select"><option ng-repeat="x in item.showvalue"  value={{x.name}} ng-selected={{x.select}}>{{x.name}}</option> \n' +
            '                </select>\n' +
            '            </div>\n' +
            '        </div>'],
        ['031002', ' <div class="form-group">\n' +
            '            <label class="col-lg-2 control-label">{{item.attrname}}</label>\n' +
            '            <div class="col-lg-8">\n' +
            '                <label class="checkbox-inline" ng-repeat="x in item.showvalue">\n' +
            '                    <input type="checkbox" value="option1" ng-model="x.select"><i></i> {{x.name}}\n' +
            '                </label>\n' +
            '            </div>\n' +
            '        </div>'],
        // ['031003', '<div class="form-group"><lable class="col-lg-2 control-label">{{item.attrname}}</lable><div class="col-lg-8"> \n' +
        // '              <label ng-repeat="x in item.default" class="radio-inline">\n' +
        // '                <input type="radio" name="optionsRadios"  value={{x}}  ng-model=item.select>\n' +
        // '              {{x.name}}\n' +
        // '              </label>\n' +
        // '            </div></div>'],
        ['031004', '<div class="form-group"> <label class="col-lg-2 control-label">{{item.attrname}}</label><div class="col-lg-8"> <input type="text" class="form-control" ng-model="item.showvalue[0].name"></div></div>']]);
    for (let x of $scope.rescom) {
        x.tempatle = tempatle.get(x.showtype)
    }

    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
    $scope.saveUpdateComponent = function () {
        for (let x of $scope.rescom) {
            delete x.tempatle;
        }
        $scope.updateData.comattr = $scope.rescom;

        $http.post("/pcomponent/update", $scope.updateData).then(function (req) {
            if (req.data == 1) {
                $modalInstance.close($scope.updateData.SuperStructure);
            } else {
                alert('构件修改失败');
            }
        })
    }
}]);
app.controller('addPassagewayCtrl', ['$scope', '$modalInstance', '$http', 'data', function ($scope, $modalInstance, $http, data) {
    $scope.passageway = data;
    $scope.saveAddPassageway = function () {
        $http.post('/passagewayinfo/insert', $scope.passageway).then(function (response) {
            if (response.data == 1) {
                $modalInstance.close();
                alert('新增通道成功');
            } else {
                alert('新增通道失败');
            }
        })
    };
    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    }
}]);
app.controller('manageBridgePassageway_controller', ['$scope', '$http', '$modal', '$filter', '$log', function ($scope, $http, $modal, $filter, $log) {


    $scope.search = function () {

        $scope.passagewayInfoNow = $filter('passage')($scope.passagewayInfo, $scope.passagename, $scope.passagenum);
    };

    [$scope.passagewayInfo, $scope.totalItems, $scope.passagewayInfoNow] = [[], [], []];
    [$scope.currentPage, $scope.itemsPerPage, $scope.maxSize] = [1, 12, 3];

    function getPassagewayInfo() {
        let url = '/passagewayinfo/select?userid=' + $scope.app.globalInfo.userid + '&usertype=' + JSON.parse(sessionStorage.getItem('msg')).usertype;

        $http.get(url).then(function (req) {
            $scope.passagewayInfo = req.data;
            $scope.totalItems = $scope.passagewayInfo.length;
            getCurrentTimes();
            $scope.loadHtml = 'tpl/modal/passagewayDetail.html';
        })
    }
    getPassagewayInfo();
    // 返回当前页对应的数据
    function getCurrentTimes() {

        var start = ($scope.currentPage - 1) * $scope.itemsPerPage;
        $scope.passagewayInfoNow = $scope.passagewayInfo.slice(start, start + $scope.itemsPerPage);
    };

    function total(item) {
        $scope.totalItems = item.length;
        return $scope.totalItems
    }

    // 切换分页
    $scope.changePage = function () {
        getCurrentTimes();
    };
    $scope.addPassageway = function () {
        var modalInstance = $modal.open({
            templateUrl: "addPassageway.html",
            controller: "addPassagewayCtrl",
            size: "",
            backdrop: 'static',      
	        keyboard: false,
            resolve: {
                data: function () {
                    return {
                        num: '',
                        name: "",
                        userid: $scope.app.globalInfo.userid
                    };
                }
            }
        });

        modalInstance.result.then(
            function () {
                getPassagewayInfo()
            },
            function () {
                $log.info("Modal dismissed at: " + new Date());
            }
        );
    };

    $scope.remove = async function (index) {
        if (confirm('确认删除该通道吗')) {
            let url = `/passagewayinfo/delete?PassagewayID=${index.PassagewayID}`;
            try {
                var res = await $http.get(url);
                getPassagewayInfo();
            } catch (e) {
                console.log("get data err" + e);
            }
        }
    };

    $scope.clickPassageway = async function (item) {
        await $http({
            method: 'post',
            url: '/passagewayinfo/selInfo',
            data: { PassagewayID: item.PassagewayID }
        }).then(function (response) {
            $scope.passagewayDetail = response.data;
        });
        let getTree = "/passagewayinfo/tree?PassagewayID=" + item.PassagewayID + "&PassagewayName=" + item.PassagewayName;
        await $http.get(getTree).then(function (response) {
            $scope.passagewayTree = response.data;
        });
        let getCheck = '/bridgeInfo/selCheck?manageid=' + $scope.app.globalInfo.userid;
        await $http.get(getCheck).then(function (response) {
            $scope.checkData = response.data;
        });
        let getCuring = '/bridgeInfo/selCuring?manageid=' + $scope.app.globalInfo.userid;
        await $http.get(getCuring).then(function (response) {
            $scope.curingData = response.data;
        });

        $modal.open({
            templateUrl: "myModalContent.html",
            controller: "ModalInstanceCtrl",
            size: "lg",   
	        keyboard: false,
            resolve: {
                data: function () {
                    return {
                        manageType: $scope.app.globalInfo.manageType,
                        passagewayDetail: $scope.passagewayDetail,
                        passagewayTree: $scope.passagewayTree,
                        passagewayItem: item,
                        checkData: $scope.checkData,
                        curingData: $scope.curingData,
                    }
                }
            }
        });
    }


}]);
app.directive('compile', function ($compile) {
    return function (scope, element, attrs) {
        scope.$watch(
            function (scope) {

                return scope.$eval(attrs.compile);
            },
            function (value) {
                element.html(value);
                $compile(element.contents())(scope);
            }
        );
    };
});