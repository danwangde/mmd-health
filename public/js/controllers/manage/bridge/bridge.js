'use strict';
app.controller('addDocumentCtrl', ['$scope', '$modalInstance', 'data', '$compile', '$http', '$modal', function ($scope, $modalInstance, data, $compile, $http, $modal) {
    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    }
    $scope.ducumentData = data;
    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
    $scope.saveDocument = function () {
        let fd = new FormData();
        let upload_file = document.getElementById("file1").files[0];
        console.log(upload_file)
        fd.append('file', upload_file);
        fd.append('BridgeID', $scope.ducumentData.BridgeID);
        fd.append('DocumentName', $scope.ducumentData.DocumentName);
        fd.append('DocumentType', $scope.ducumentData.DocumentType);
        fd.append('DocumentUnit', $scope.ducumentData.DocumentUnit);
        $http.post('/documentation/insert_file', fd, { headers: { 'Content-Type': undefined }, transformRequest: angular.identity }).then(function (req) {
            if (req.data == 1) {
                $modalInstance.close();
            }
        });

    }
}]);
app.controller('addHistoryCtrl', ['$scope', '$modalInstance', 'data', '$compile', '$http', '$modal', function ($scope, $modalInstance, data, $compile, $http, $modal) {
    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    }
    $scope.history = data;
    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
    $scope.saveHistory = function () {
        if ($scope.history.title == '新增历史') {
            $http.post('/history/insert', $scope.history).then(function (req) {
                if (req.data == 1) {
                    alert('新增成功');
                    $modalInstance.close();
                } else {
                    alert('新增失败')
                }
            })
        } else if ($scope.history.title == '修改历史') {
            $http.post('/history/update', $scope.history).then(function (req) {
                console.log(req.data)
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
    $scope.id = data.BridgeID;
    $scope.facilities_type = 0;
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
            }else{
                alert('新增失败');
            }
        });
    };
}]);
app.controller('addVideoCtrl', ['$scope', '$modalInstance', 'data', '$compile', '$http', '$modal', function ($scope, $modalInstance, data, $compile, $http, $modal) {
    $scope.title = '新增视频';
    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    }
    $scope.id = data.BridgeID;
    $scope.facilities_type = 0;
    $scope.saveImage = async function () {
        let fd = new FormData();
        let upload_file = document.getElementById("file2").files[0];
        fd.append('file', upload_file);
        fd.append('facilities_id', data.BridgeID);
        fd.append('facilities_type', 0);
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
app.controller('addComponentCtrl', ['$scope', '$modalInstance', 'data', '$compile', '$http', '$modal', function ($scope, $modalInstance, data, $compile, $http, $modal) {
    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    }
    console.log(data)
    $scope.title = data.title;
    $scope.addData = {
        ComponentNum: $scope.ComponentNum,
        ComponentName: $scope.ComponentName,
        ComponentTypeName: $scope.ComponentTypeName,
        BridgeLineID: data.BridgeLineID,
        SuperStructure: data.componentId,
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
        $scope.addData.evalvalue = $scope.evaluate;
        console.log($scope.evaluate)
        $scope.addData.comattr = $scope.resattr;
        $http.post("/component/add", $scope.addData).then(function (req) {

            if (req.data == 1) {
                $modalInstance.close(data.componentId);
            } else {
                alert('构件新增失败');
            }
        })
    };
    $scope.changeComponenType = function () {
        $scope.evaluate = [];
        $scope.resattr = [];
        let selpubUrl = '/component/selpub?MainStructType=' + data.bridgeType + '&ComponentTypeName=' + $scope.addData.ComponentTypeName.ComponentTypeName + "&SuperStructure=" + data.componentId;
        console.log(selpubUrl)
        $http.get(selpubUrl).then(function (req) {
            if (req.data !== 0) {
                $scope.evaluate = req.data.evaluate;
                $scope.resattr = req.data.resattr;
                for (let x of $scope.resattr) {
                    x.tempatle = tempatle.get(x.showtype)
                }
            } else {
            }
            /* $scope.reseval=[{id:123,name:'PC或RC梁氏构件',select:false},{id:456,name:'钢结构物',select:false}];
             $scope.resattr = [
                 {
                     attrname: '下拉框',
                     showtype: '031001',
                     showvalue: [{id: 1, name: 111, select: false}, {id: 2, name: 222, select: false}]
                 },
                 {
                     attrname: '多选框',
                     showtype: '031002',
                     showvalue: [{id: 1, name: 11, select: false}, {id: 2, name: 22, select: false}, {
                         id: 3,
                         name: 33,
                         select: false
                     }]
                 },
                 // {attrname:'单选框',show:'031003',default:[{name:11},{name:22},{name:33}]},
                 {attrname: '文本框', showtype: '031004', showvalue:[{name: '123'}]}
             ];
             for (let x of  $scope.resattr) {
                 x.tempatle = tempatle.get(x.showtype)
             }*/

        });
    };
    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };

    function getComponenType() {
        let url = '/component/selType?type=' + $scope.addData.SuperStructure + '&MainStructType=' + data.bridgeType;
        console.log(url)
        $http.get(url).then(function (req) {
            $scope.ComponentType = req.data;
        })
    }

    getComponenType();
}]);
app.controller('updataComponentCtrl', ['$scope', '$modalInstance', 'data', '$compile', '$http', '$modal', function ($scope, $modalInstance, data, $compile, $http, $modal) {

    $scope.title = data.title;
    $scope.SuperStructure = data.res.SuperStructure;

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
        $http.post("/component/update", $scope.updateData).then(function (req) {

            console.log($scope.updateData)
            if (req.data == 1) {
                $modalInstance.close(data.res.SuperStructure);
            } else {
                alert('构件修改失败');
            }
        })
    }
}]);
app.controller('bridgeInfoCtrl', ['$scope', '$modalInstance', 'data', '$compile','$filter', '$http', '$modal', function ($scope, $modalInstance, data, $compile, $filter, $http, $modal) {
    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    }
    let treeBranch;
    $scope.my_data = data.brigeTree;
    $scope.manageType = data.manageType;
    console.log(data.manageType)
    $scope.bridgeDetail = data.bridgeDetail[0];
    console.log( $scope.bridgeDetail);
    $scope.bridgeType = $scope.bridgeDetail.MainStructType;
    $scope.checkData = data.checkData;
    for (let item of $scope.checkData) {
        if ($scope.bridgeDetail.CheckUint == item.id) {
            item.select = true;
        } else {
            item.select = false;
        }
    };
    $scope.curingData = data.curingData;
    for (let item of $scope.curingData) {
        if ($scope.bridgeDetail.CuringUnit == item.id) {
            item.select = true;
        } else {
            item.select = false;
        }
    };
    $scope.basicInfoBtn = function () {
        let url = '/bridgeInfo/selInfo?BridgeID='+data.BridgeID;
        $http.get(url).then(function (response) {
            console.log(response);
            $scope.bridgeDetail = response.data[0];
        });
    };
    $scope.historyBtn = function () {
        $http({
            method: 'post',
            url: '/history/select',
            data: { BridgeID: data.BridgeID }
        }).then(function (response) {
            $scope.historyData = response.data;
            console.log(response.data)
            for(let item of $scope.historyData) {
                item.BuildDate = get_date_str(new Date(item.BuildDate));
            }
            [...$scope.historyDataNow] = $scope.historyData;
        });
    };
    $scope.his = {histype:'',histime:''};
    $scope.searchHis = function () {
        $scope.historyDataNow = $filter('BriHis')($scope.historyData, $scope.his.histype, $scope.his.histime);
    };
    $scope.documentBtn = function () {
        $http.get('/documentation/select_file?BridgeID=' + data.BridgeID).then(function (req) {
            $scope.document = req.data;
            [...$scope.documentNow] = $scope.document;
        })
    };
    $scope.document = {documentname:'',documenttype:''};
    $scope.searchDocu = function () {
        $scope.documentNow = $filter('document')($scope.document, $scope.document.documentname, $scope.document.documenttype);
    };

    $scope.imageBtn = async function() {

        let getUrl = '/bridgeinfo/select_photos?facilities_id=' + data.BridgeID + '&facilities_type=0';
        let res = await $http.get(getUrl);
        $scope.$apply(function () {
            $scope.items = res.data;
            console.log($scope.items)
            $scope.num = 0;
            $scope.changeImg = function (item) {
                $scope.num = item;

            };
        })

    };
    async function getVideo () {
        let getUrl = '/bridgeinfo/select_video?facilities_id=' + data.BridgeID + '&facilities_type=0';
        let res = await $http.get(getUrl);
        $scope.$apply(function () {
            $scope.videos = res.data;
        });
    }
    $scope.videoBtn = async function () {
        getVideo ()
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
                    return data;
                }
            }
        });
        modalInstance.result.then(function () {
            $scope.videoBtn();
        }, function () {

        });
        
    };

    $scope.delVideo = async function(x){
        if (confirm('确认删除该视频吗?')) {
            let delUrl = '/bridgeinfo/delete_video?id='+x.id;
            let res = await $http.get(delUrl);
            if(res.data=='1'){
                alert('删除成功');
                getVideo();
            }else{
                alert('删除失败')
            };
        }
       

    };
    $scope.addDocument = function (item) {

        item.title = '新增文档';
        item.DocumentName = '';
        item.DocumentType = '';

        item.BridgeID = data.BridgeID;

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
            $http.get('/documentation/delete_file?BridgeDocumentID=' + item.BridgeDocumentID + '&file=' + item.FileName).then(function (req) {
                if (req.data == 1) {
                    $scope.documentBtn();
                    alert('删除成功')
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
        item.BridgeID = data.BridgeID;
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
            $http.post('/history/delete', item).then(function (req) {
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
                    return data;
                }
            }
        });
        modalInstance.result.then(function () {
            $scope.imageBtn();
        }, function () {

        });
    }
    $scope.delImage = async function (item) {
        console.log(item)
        if (confirm('确认删除该照片吗?')) {
            let url = '/bridgeinfo/deleteImage?id='+$scope.items[$scope.num].id;
            let res = await $http.get(url);
            if(res.data == 1) {
                alert('删除成功')
                $scope.imageBtn();
            }
        }
       
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

    function type(bid, lineid) {
        let lineInfoUrl = '/line/select?BridgeID=' + bid + '&BridgeLineID=' + lineid;
        $http.get(lineInfoUrl).then(
            function (response) {
                $scope.dataType = response.data[0].MainStructType
            }
        )
    }

    function lineBtn(bid, lineid) {
        let lineInfoUrl = '/line/select?BridgeID=' + bid + '&BridgeLineID=' + lineid;
        $http.get(lineInfoUrl).then(
            function (response) {
                $scope.line = response.data[0]
            }
        )
    }

    function abutmentBtn(bid, lineid, abutmentId) {
        let spanInfoUrl = '/abument/select?BridgeID=' + bid + '&BridgeLineID=' + lineid + '&BridgeAbuID=' + abutmentId;
        $http.get(spanInfoUrl).then(
            function (response) {
                $scope.Cominfo = response.data.data2;
                $scope.type = '001002';
            }
        )
    }

    function pierBtn(bid, lineid, pierId) {
        let spanInfoUrl = '/pier/select?BridgeID=' + bid + '&BridgeLineID=' + lineid + '&BridgePierID=' + pierId;
        $http.get(spanInfoUrl).then(
            function (response) {
                $scope.Cominfo = response.data.data2;
                $scope.type = '001003';
            }
        )
    }

    function spanBtn(bid, lineid, spanid) {
        let spanInfoUrl = '/span/select?BridgeID=' + bid + '&BridgeLineID=' + lineid + '&BridgeSpanID=' + spanid;
        $http.get(spanInfoUrl).then(
            function (response) {
                $scope.span = response.data.data1[0];
                $scope.Cominfo = response.data.data2;
                $scope.type = '001001';
            }
        )
    }
    function comBtn(typeid, lineid, id) {
        let url = '/bridgeInfo/selcom?BridgeLineID=' + lineid + '&typeid=' + typeid + '&id=' + id;
        $http.get(url).then(function (req) {
            $scope.Cominfo = req.data;
            if (typeid == 3) {
                $scope.type = '001004';
            } else if (typeid == 4) {
                $scope.type = '001006';
            } else if (typeid == 5) {
                $scope.type = '001005';
            }
        })
    }

    let html, template, mobileDialogElement;
    $scope.bigImg = function (num) {
        if (num == 1) {
            html = "<img src='../img/4.jpg' style='max-width:80%;margin-left:50%;margin-top:50px;transform: translate(-50%, -0%);' >";
        } else if (num == 2) {
            html = "<img src='../img/signinbg1.jpg' style='max-width:80%;margin-left:50%;margin-top:50px;transform: translate(-50%, -0%);' >";
        }
        template = angular.element(html);
        mobileDialogElement = $compile(template)($scope);

        angular.element("#bigImg").append(mobileDialogElement);
    };
    $scope.clickImg = function () {
        if (mobileDialogElement) {
            mobileDialogElement.remove();
        }
    };
    $scope.lookVideo = function () {
        html = "<video style='max-width:80%;max-height:800px;margin-left:50%;margin-top:50px;transform: translate(-50%, -0%);' controls><source src='../img/ceshi.mp4' type='video/mp4'></source></video>";
        template = angular.element(html);
        mobileDialogElement = $compile(template)($scope);

        angular.element("#bigImg").append(mobileDialogElement);
    };

    $scope.loadHtml = 'tpl/modal/bridgeDetail.html';
    $scope.my_tree_handler = async function (branch) {
        console.log(branch)
        $scope.BridgeLineID = branch.BridgeLineID
        $scope.bridgeId = branch.bridgeId
        treeBranch = branch;
        if (branch.level == 1) {
            await $scope.basicInfoBtn();
            $scope.loadHtml = 'tpl/modal/bridgeDetail.html';
        } else if (branch.level == 2) {
            await lineBtn(data.BridgeID, branch.BridgeLineID);
            $scope.loadHtml = 'tpl/modal/bridgeLine.html';
        }
        else if (branch.level == 3 && branch.surfaceid) {
            $scope.typeID = branch.typeID;
            $scope.StructureID = branch.surfaceid;
            comBtn(branch.typeID, branch.BridgeLineID, branch.surfaceid)
            $scope.basicsHtml = '';
            $scope.loadHtml = 'tpl/modal/component.html';
            return;
        }
        else if (branch.level == 3 && branch.attachmentid) {
            $scope.typeID = branch.typeID;
            $scope.StructureID = branch.attachmentid;
            comBtn(branch.typeID, branch.BridgeLineID, branch.attachmentid)
            $scope.basicsHtml = '';
            $scope.loadHtml = 'tpl/modal/component.html';
            return;
        }
        else if (branch.level == 3 && branch.antiknockid) {
            $scope.typeID = branch.typeID;
            $scope.StructureID = branch.antiknockid;
            comBtn(branch.typeID, branch.BridgeLineID, branch.antiknockid)
            $scope.basicsHtml = '';
            $scope.loadHtml = 'tpl/modal/component.html';
            return;
        }
        else if (branch.level == 3) {
            $scope.basicsHtml = '';
            $scope.loadHtml = '';
        }
        else if (branch.level == 4 && branch.spanID) {
            $scope.StructureID = branch.spanID;
            await spanBtn(data.BridgeID, branch.BridgeLineID, branch.spanID);
            $scope.loadHtml = 'tpl/modal/component.html';
            $scope.basicsHtml = 'tpl/modal/spanDetail.html';
        }
        else if (branch.level == 4 && branch.pierId) {
            $scope.StructureID = branch.pierId;
            await pierBtn(data.BridgeID, branch.BridgeLineID, branch.pierId);
            // $scope.loadHtml = 'tpl/modal/bridgePier.html';
            $scope.loadHtml = 'tpl/modal/component.html';
            $scope.basicsHtml = 'tpl/modal/pierDetail.html';
        }
        else if (branch.level == 4 && branch.abutmentId) {
            $scope.StructureID = branch.abutmentId;
            await abutmentBtn(data.BridgeID, branch.BridgeLineID, branch.abutmentId);
            // $scope.loadHtml = 'tpl/modal/bridgePier.html';
            $scope.loadHtml = 'tpl/modal/component.html';
            $scope.basicsHtml = 'tpl/modal/abutmentDetail.html';
        }

    };
    $scope.showMapPop=false;
    $scope.getLocation=function(){
       setTimeout(Map,100);
       $scope.showMapPop=true;
    };
    $scope.off = function () {
        $scope.showMapPop=false;
    };
    function Map(){
        var map = new BMap.Map("allmap");
        var geolocation = new BMap.Geolocation();
        if( $scope.bridgeDetail.BridgeLON =='' || $scope.bridgeDetail.BridgeLAT =='') {
            geolocation.getCurrentPosition(function(r){
                if(this.getStatus() == BMAP_STATUS_SUCCESS){
                    map.centerAndZoom(new BMap.Point( r.point.lng, r.point.lat), 11);
                    var mk = new BMap.Marker(r.point);
                    map.addOverlay(mk);
                    map.panTo(r.point);
                    console.log('您的位置：'+r.point.lng+','+r.point.lat);
                }
                else {
                    console.log('failed'+this.getStatus());
                }        
            },{enableHighAccuracy: true})
        }else{
            map.centerAndZoom(new BMap.Point( $scope.bridgeDetail.BridgeLON, $scope.bridgeDetail.BridgeLAT), 11);
            var new_point = new BMap.Point($scope.bridgeDetail.BridgeLON, $scope.bridgeDetail.BridgeLAT);
            var marker = new BMap.Marker(new_point);  // 创建标注
            map.addOverlay(marker);           
        }
        
        //map.centerAndZoom(new BMap.Point(116.404, 39.915), 11);
          // 将标注添加到地图中
        map.enableScrollWheelZoom(true);     //开启鼠标滚轮缩放
        
        function showInfo(e){
            $scope.bridgeDetail.locationInfo=e.point.lng + "," + e.point.lat;
            $scope.showMapPop=false;
        }
        map.addEventListener("click", showInfo);
    }
	$scope.saveBridge = function () {
        $scope.checkData = data.checkData;
        $scope.curingData = data.curingData;
        $http.post('/bridgeInfo/update', $scope.bridgeDetail).then(function (response) {
            if (response.data == 1) {
                alert('修改成功')
            } else {
                alert('修改失败')
            }
        })
    };
    $scope.saveLine = function () {
        $http.post('/line/update', $scope.line).then(function (response) {
            if (response.data == 1) {
                alert('修改成功')
            } else {
                alert('修改失败')
            }
        })
    };
    $scope.addItem = function () {
        if (treeBranch == undefined) {
            alert("请选择节点");
            return false
        }
        if (treeBranch.level == 1) {
            let linename = prompt("请输入新增线路名称", "");
            if (linename) {
                let url = `/line/insert?BridgeID=${treeBranch.bridgeId}&lineName=${linename}`;
                $http.get(url).then(function (response) {
                    if (response.data == 1) {
                        getTree()
                    } else {
                        alert('新增失败')
                    }
                })
            }
        }
        else if (treeBranch.level == 2) {
            alert("请选择其他节点");
        }
        else if (treeBranch.label == '上部结构') {
            let spanname = prompt("请输入新增跨名称", "");
            if (spanname) {
                $http.get('/span/insert?BridgeLineID=' + treeBranch.BridgeLineID + '&spanName=' + spanname).then(function (response) {
                    if (response.data == 1) {
                        getTree()
                    } else {
                        alert('新增失败')
                    }
                })
            }
        }
        else if (treeBranch.label == '下部结构') {
            let num = prompt("选择新增桥台，输入1，选择新增桥墩，输入2，", "");
            if (num == 1) {
                let abutmentName = prompt("请输入桥台名称", "");
                abutmentName = abutmentName.replace('#','%23')
                console.log(abutmentName)
                // if (abutmentName) {
                    $http.get('/abument/insert?BridgeLineID=' + treeBranch.BridgeLineID + '&abutmentName=' + abutmentName).then(function (response) {
                        if (response.data == 1) {
                            getTree()
                        } else {
                            alert('新增失败')
                        }
                    })
                // }
            } else if (num == 2) {
                let pierName = prompt("请输入桥墩名称", "");
                pierName = pierName.replace('#','%23')
                if (pierName) {
                    $http.get('/pier/insert?BridgeLineID=' + treeBranch.BridgeLineID + '&pierName=' + pierName).then(function (response) {
                        if (response.data == 1) {
                            getTree()
                        } else {
                            alert('新增失败')
                        }
                    })
                }
            } else if (num) {
                alert("请输入正确的数字")
            }

        }
        else {
            alert('请选择其他节点')
        }
    };
    $scope.delItem = function () {
        if (treeBranch == undefined) {
            alert("请选择节点");
            return false
        }
        if (treeBranch.level == 2) {
            if (confirm("确定删除该线路吗")) {
                $http.get('/line/delete?BridgeLineID=' + treeBranch.BridgeLineID).then(function (response) {
                    if (response.data == 1) {
                        getTree()
                    } else {
                        alert('删除失败')
                    }
                })
            }
        }
        else if (treeBranch.level == 4) {
            if (treeBranch.pierId) {
                if (confirm("确定删除该桥墩吗")) {
                    $http.get('/pier/delete?BridgePierID=' + treeBranch.pierId).then(function (response) {
                        if (response.data == 1) {
                            getTree()
                        } else {
                            alert('删除失败')
                        }
                    })
                }
            } else if (treeBranch.abutmentId) {
                if (confirm("确定删除该桥台吗")) {
                    $http.get('/abument/delete?BridgeAbuID=' + treeBranch.abutmentId).then(function (response) {
                        if (response.data == 1) {
                            getTree()
                        } else {
                            alert('删除失败')
                        }
                    })
                }
            } else if (treeBranch.spanID) {
                if (confirm("确定删除该跨吗")) {
                    $http.get('/span/delete?BridgeSpanID=' + treeBranch.spanID).then(function (response) {
                        if (response.data == 1) {
                            getTree()
                        } else {
                            alert('删除失败')
                        }
                    })
                }
            }

        }
        else {
            alert('该节点不能被删除')
        }
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
                        bridgeType: $scope.line.MainStructureType,
                        componentId: $scope.type,
                        BridgeLineID: $scope.BridgeLineID,
                        StructureID: $scope.StructureID
                    }
                }
            }
        });


        modalInstance.result.then(function (SuperStructure) {
            if (SuperStructure == '001001') {
                spanBtn($scope.bridgeId, $scope.BridgeLineID, $scope.StructureID)
            } else if (SuperStructure == '001002') {
                abutmentBtn($scope.bridgeId, $scope.BridgeLineID, $scope.StructureID)
            } else if (SuperStructure == '001003') {
                pierBtn($scope.bridgeId, $scope.BridgeLineID, $scope.StructureID)
            } else {
                comBtn($scope.typeID, $scope.BridgeLineID, $scope.StructureID)
            }
        }, function () {
        });

    };
    $scope.updateComponent = async function (x) {
        let updateComponentData;
        await $http.get('/component/select?ComponentID=' + x.ComponentID + '&MainStructType=' +  $scope.line.MainStructureType + "&SuperStructure=" + x.SuperStructure).then(function (req) {

            updateComponentData = req.data;
            updateComponentData.title = '修改构件';
            updateComponentData.res.SuperStructure = $scope.type;
            updateComponentData.res.BridgeLineID = $scope.BridgeLineID;
            updateComponentData.res.StructureID = $scope.StructureID;
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
            if (SuperStructure == '001001') {
                spanBtn($scope.bridgeId, $scope.BridgeLineID, $scope.StructureID)
            } else if (SuperStructure == '001002') {
                abutmentBtn($scope.bridgeId, $scope.BridgeLineID, $scope.StructureID)
            } else if (SuperStructure == '001003') {
                pierBtn($scope.bridgeId, $scope.BridgeLineID, $scope.StructureID)
            } else {
                comBtn($scope.typeID, $scope.BridgeLineID, $scope.StructureID)
            }
        }, function () {
        });
    };
    $scope.delComponent = function (x) {
        if (confirm('确认删除该构件吗')) {
            $http.get('/component/deleteCom?ComponentID=' + x.ComponentID).then(function (req) {
                if (req.data == 1) {
                    if (x.SuperStructure == '001001') {
                        spanBtn($scope.bridgeId, $scope.BridgeLineID, $scope.StructureID)
                    } else if (x.SuperStructure == '001002') {
                        abutmentBtn($scope.bridgeId, $scope.BridgeLineID, $scope.StructureID)
                    } else if (x.SuperStructure == '001003') {
                        pierBtn($scope.bridgeId, $scope.BridgeLineID, $scope.StructureID)
                    } else {
                        comBtn($scope.typeID, $scope.BridgeLineID, $scope.StructureID)
                    }
                } else {
                    alert('删除失败')
                }
            })
        }
    };
    $scope.saveSpanBasic = function () {
        $http.post('/span/update', $scope.span).then(function (response) {
            if (response.data == 1) {
                alert('修改成功')
            } else {
                alert('修改失败')
            }
        })
    };

    function getTree() {
        let getTreeUrl = "/bridgeInfo/tree?BridgeID=" + data.BridgeID + "&BridgeName=" + data.BridgeName;
        $http.get(getTreeUrl).then(function (response) {
            console.log(response.data)
            $scope.my_data = response.data;
        });
    }
}]);
app.controller('addBridgeCtrl', ['$scope', '$modalInstance', '$http', 'userid', function ($scope, $modalInstance, $http, userid, $modal) {
    $scope.bridge = {
        num: '',
        name: "",
        type: '',
        userid: userid
    };
    $scope.saveAddBridge = function () {
        $http.post('/bridgeInfo/insert', $scope.bridge).then(function (response) {
            if (response.data == 1) {
                $modalInstance.close();
                alert('新增桥梁成功');
            } else {
                alert('新增桥梁失败');
            }
        })
    };
    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    }
}]);

app.controller('manageBridgeInfo_controller', ['$scope', '$http', '$modal','$filter', '$log', '$compile', function ($scope, $http, $modal,$filter, $log, $compile) {

    $scope.clickBridge = async function (item) {
        /* var modalInstance = $modal.open({
             templateUrl: 'bridgeInfo.html',
             controller: 'bridgeInfoCtrl',
             size: 'lg',
             resolve: {
                 items: function () {
                     return $scope.items;
                 }

             }
         });

         modalInstance.result.then(function (selectedItem) {
             $scope.selected = selectedItem;
         }, function () {
             $log.info('Modal dismissed at: ' + new Date());
         });*/
        await $http.get('/bridgeInfo/selInfo?BridgeID='+item.BridgeID).then(function (response) {
            console.log(response)
            $scope.bridgeDetail = response.data;
        });
        let getTree = "/bridgeInfo/tree?BridgeID=" + item.BridgeID + "&BridgeName=" + item.BridgeName;
        await $http.get(getTree).then(function (response) {
            console.log(response.data)
            $scope.brigeTree = response.data;
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
            templateUrl: 'bridgeInfo.html',
            controller: 'bridgeInfoCtrl',
            size: 'lg',   
	        keyboard: false,
            resolve: {
                data: function () {
                    return {
                        bridgeDetail: $scope.bridgeDetail,
                        brigeTree: $scope.brigeTree,
                        manageType: $scope.app.globalInfo.manageType,
                        BridgeID: item.BridgeID,
                        BridgeName: item.BridgeName,
                        checkData: $scope.checkData,
                        curingData: $scope.curingData,
                    };
                }
            }
        });
    };
    $scope.delBridge = async function (item) {
        if (confirm('确认删除该桥梁吗')) {
            $http.get('/bridgeinfo/delete?BridgeID=' + item.BridgeID).then(
                function (response) {
                    if (response.data == 1) {
                        getBridge();
                    } else {
                        alert("桥梁删除失败")
                    }
                })
        }
    };
    $scope.addBridge = function () {
        let modalInstance = $modal.open({
            templateUrl: 'addBridge.html',
            controller: 'addBridgeCtrl',
            size: '',
            backdrop: 'static',      
	        keyboard: false,
            resolve: {
                userid: function () {
                    return $scope.app.globalInfo.userid
                }
            }
        });
        modalInstance.result.then(function () {
            getBridge()
        }, function () {

        });
    };

    $scope.search = function () {

        $scope.bridgeNow = $filter('search')($scope.bridge, $scope.bridgenum, $scope.bridgename);
    };

    [$scope.bridge, $scope.totalItems, $scope.bridgeNow] = [[], [], []];
    [$scope.currentPage, $scope.itemsPerPage, $scope.maxSize] = [1, 12, 3];
    async function getBridge() {
        let getBridgeUrl = '/bridgeInfo/select?userid=' + $scope.app.globalInfo.userid + '&usertype=' + JSON.parse(sessionStorage.getItem('msg')).usertype;
        await $http.get(getBridgeUrl).then(
            function (response) {
                console.log( response.data);
                $scope.bridge = response.data;
                $scope.totalItems = $scope.bridge.length;
                getCurrentTimes();
            }, function (response) {
            }
        )
    };

    getBridge();

    // 返回当前页对应的数据
    function getCurrentTimes() {

        var start = ($scope.currentPage - 1) * $scope.itemsPerPage;
        $scope.bridgeNow = $scope.bridge.slice(start, start + $scope.itemsPerPage);
    }

    // 切换分页
    $scope.changePage = function () {
        getCurrentTimes();
    };

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
