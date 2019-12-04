'use strict';
app.controller('manageBridgeIndex_controller', ['$scope', '$http', '$window', function ($scope, $http) {
    $scope.full = function () {
        //var width =  window.screen.width;
        //var height =   window.screen.height;
        var elem = document.getElementById("container");
        requestFullScreen(elem);
    };
    function requestFullScreen(element) {
        if (element.requestFullscreen) {
            element.requestFullscreen();
        }
        //FireFox
        else if (element.mozRequestFullScreen) {
            element.mozRequestFullScreen();
        }
        //Chrome等
        else if (element.webkitRequestFullScreen) {
            element.webkitRequestFullScreen();
        }
        //IE11
        else if (element.msRequestFullscreen) {
            element.msRequestFullscreen();
        }
    };

    var map = new BMap.Map("container");
    console.log(map)
    $scope.longitude = 117.106836;
    $scope.latitude = 36.668542;

    var point = new BMap.Point($scope.longitude, $scope.latitude);
    var geoc = new BMap.Geocoder();
    map.addEventListener("click", function (e) {
        var pt = e.point;
        geoc.getLocation(pt, function (rs) {
        });
    });
    var local = new BMap.LocalSearch(map, {
        renderOptions: { map: map }
    });
    local.search("敏文");
    map.centerAndZoom(point, 11);
    map.enableScrollWheelZoom();   //启用滚轮放大缩小，默认禁用
    map.enableContinuousZoom();    //启用地图惯性拖拽，默认禁用




    map.addControl(new BMap.NavigationControl());

    //地图平移缩放控件
    map.addControl(new BMap.NavigationControl());
    //比例尺控件
    map.addControl(new BMap.ScaleControl());
    //缩略地图控件
    map.addControl(new BMap.OverviewMapControl());
    //地图类型控件
    map.addControl(new BMap.MapTypeControl());

    map.setCurrentCity("济南"); // 仅当设置城市信息时，MapTypeControl的切换功能才能可用

    //map.setMapType(BMAP_HYBRID_MAP); // 设置：使用混合地图 // [117.106836,36.668542,"桥梁名称：山东省市场监督管理局","地址:山东省","桥梁结构:梁桥","养护等级：I等","查看详情","常规检测","病害维修"]
    var points = [];
    $scope.app.globalInfo.status = [
        { state: 0 }, { state: 1 }, { state: 2 }, { state: 0 }, { state: 1 }, { state: 2 }, { state: 0 }, { state: 1 }, { state: 2 }, { state: 0 }, { state: 1 }, { state: 2 }, { state: 0 }
    ];

    async function getData() {

        let getBridge = '/bridgeinfo/select_bridgeinfo?uid=' + $scope.app.globalInfo.userid+'&power='+JSON.parse(sessionStorage.getItem('msg')).usertype;
        await $http.get(getBridge).then((res) => {
            $scope.data_info = res.data;
        });
        for (var i = 0; i < $scope.data_info.length; i++) {

            var marker = '';
            marker = new BMap.Marker(new BMap.Point($scope.data_info[i].BridgeLON, $scope.data_info[i].BridgeLAT), { icon: addIcon() });  // 创建标注
            var content =
                `桥梁名称:${$scope.data_info[i].BridgeName} <br>
                 地址:${$scope.data_info[i].BridgeRoad} <br>
                桥梁结构:${$scope.data_info[i].MainStructType=='035001'?'梁桥':$scope.data_info[i].MainStructType=='035002'?'悬臂+挂梁'
                        :$scope.data_info[i].MainStructType=='035003'?'桁架桥':$scope.data_info[i].MainStructType=='035004'?'刚构桥'
                        :$scope.data_info[i].MainStructType=='035005'?'钢结构拱桥':$scope.data_info[i].MainStructType=='035006'?'圬工拱桥（无拱上构造）'
                        :$scope.data_info[i].MainStructType=='035007'?'圬工拱桥（有拱上构造）':$scope.data_info[i].MainStructType=='035008'?'钢筋混凝土拱桥'
                        :$scope.data_info[i].MainStructType=='035009'?'人行天桥（梁桥）':$scope.data_info[i].MainStructType=='035010'?'人行天桥（钢桁架桥）':'???'} <br>
                 养护等级:${$scope.data_info[i].CuringGrade=='044001'?'I等':$scope.data_info[i].CuringGrade=='044002'?'II等':
                            $scope.data_info[i].CuringGrade=='044003'?'III等':'???'}<br>
                 <a href="#/app/basic/manageBridgeInfo" style="color:#000;"> 查看详情</a>&nbsp&nbsp&nbsp&nbsp&nbsp;
                 <a href="#/app/basic/manageBridgeInfo" style="color:#000;"> 常规检测</a> &nbsp&nbsp&nbsp&nbsp&nbsp;
                 <a href="#/app/basic/manageBridgeInfo" style="color:#000;">病害维修</a> &nbsp&nbsp&nbsp&nbsp&nbsp`;

            map.addOverlay(marker);               // 将标注添加到地图中
            //marker.setAnimation(BMAP_ANIMATION_BOUNCE); //跳动的动画
            //marker.enableDragging();           // 不可拖拽
            addClickHandler(content, marker);
        }

    };
    getData();


    var opts = {
        width: 220,     // 信息窗口宽度
        height: 150,     // 信息窗口高度
        borderRadius: 10,
        title: "桥梁信息", // 信息窗口标题
        enableMessage: true//设置允许信息窗发送短息
    };


    function addIcon() {
        var myIcon = null;
        myIcon = new BMap.Icon('../img/bridge_icon.png', new BMap.Size(50, 50), {
            anchor: new BMap.Size(48, 48)
        })
        return myIcon;
    }

    function addClickHandler(content, marker) {
        marker.addEventListener("click", function (e) {
            openInfo(content, e)
        }
        );
    }
    function openInfo(content, e) {
        var p = e.target;
        var point = new BMap.Point(p.getPosition().lng, p.getPosition().lat);
        var infoWindow = new BMap.InfoWindow(content, opts);  // 创建信息窗口对象
        map.openInfoWindow(infoWindow, point); //开启信息窗口
    };
    // 用经纬度设置地图中心点
    $scope.theLocation = function () {
        for (var i = 0; i < $scope.data_info.length; i++) {
            if ($scope.address == $scope.data_info[i].BridgeName || $scope.grade == $scope.data_info[i].CuringGrade) {
                var new_point = new BMap.Point($scope.data_info[i].BridgeLON, $scope.data_info[i].BridgeLAT);
                var marker = new BMap.Marker(new_point);  // 创建标注
                map.addOverlay(marker);              // 将标注添加到地图中
                map.panTo(new_point);
            }
        }
    };

    $scope.lineOption = {};

    async function getDis() {
        var dataArr = [];
        var data = new Date();
        var year = data.getFullYear();
        data.setMonth(data.getMonth() + 1, 1)//获取到当前月份,设置月份
        for (var i = 0; i < 12; i++) {
            data.setMonth(data.getMonth() - 1);//每次循环一次 月份值减1
            var m = data.getMonth() + 1;
            m = m < 10 ? "0" + m : m;
            dataArr.push(data.getFullYear() + "-" + (m))
        };
        let arr5 = dataArr.reverse();

        /* ...................................................................................... */
        let getBridgeFinish = '/bridgeinfo/select_discount?uid=' + $scope.app.globalInfo.userid+'&power='+JSON.parse(sessionStorage.getItem('msg')).usertype;
        let res1 = await $http.get(getBridgeFinish);
        let arr1 = [];
        let arrbfinish = [];
        for (let item of res1.data) {
            arr1.push(item.COUNT);
            arrbfinish.push(item.DATE);
        };


        let bfinish = {
            name: '已修复桥梁',
            showSymbol: false,
            type: 'line',
            data: arr1
        };
        let arrBF = new Array(12);
        for (let i = 0; i < dataArr.length; i++) {
            if (res1.data.length !== 0) {
                for (let item of res1.data) {
                    if (item.DATE == dataArr[i]) {
                        arrBF[i] = item.COUNT;
                    } else {
                        arrBF[i] = 0;
                    }
                }
            } else {
                arrBF = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
            }
        };

        /* ...................................................................................... */

        let getUnfinish = '/bridgeinfo/select_discount1?uid=' + $scope.app.globalInfo.userid+'&power='+JSON.parse(sessionStorage.getItem('msg')).usertype;
        let res2 = await $http.get(getUnfinish);
        console.log(res2.data);
        let arr2 = [];
        let arrbnfinish = [];
        for (let item of res2.data) {
            arrbnfinish.push(item.DATE);
        };


        let bunfinish = {
            name: '未修复桥梁',
            showSymbol: false,
            type: 'line',
            data: arr2
        };
        let arrBUF = new Array(12);
        for (let i = 0; i < dataArr.length; i++) {
            if (res2.data.length !== 0) {
                for (let item of res2.data) {
                    if (item.DATE == dataArr[i]) {
                        arrBUF[i] = item.COUNT;
                    } else {
                        arrBUF[i] = 0;
                    }
                }
            } else {
                arrBUF = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
            }
        };
        /* ...................................................................................... */
        let getpfinish = '/bridgeinfo/select_discount2?uid=' + $scope.app.globalInfo.userid+'&power='+JSON.parse(sessionStorage.getItem('msg')).usertype;
        let res3 = await $http.get(getpfinish);
        let arr3 = [];
        let arrpnfinish = [];
        for (let item of res3.data) {
            arr3.push(item.COUNT);
            arrpnfinish.push(item.DATE);
        };

        let pfinish = {
            name: '未修复人行通道',
            showSymbol: false,
            type: 'line',
            data: arr3
        };
        let arrPUF = new Array(12);
        for (let i = 0; i < dataArr.length; i++) {
            if (res3.data.length !== 0) {
                for (let item of res3.data) {
                    if (item.DATE == dataArr[i]) {
                        arrPUF[i] = item.COUNT;
                    } else {
                        arrPUF[i] = 0;
                    }
                }
            } else {
                arrPUF = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
            }
        };
        /* ...................................................................................... */

        let getpUnfinish = '/bridgeinfo/select_discount3?uid=' + $scope.app.globalInfo.userid+'&power='+JSON.parse(sessionStorage.getItem('msg')).usertype;
        let res4 = await $http.get(getpUnfinish);
        let arr4 = [];
        let arrpfinish = [];
        for (let item of res4.data) {
            arr4.push(item.COUNT);
            arrpfinish.push(item.DATE);
        };
        let punfinish = {
            name: '已修复人行通道',
            showSymbol: false,
            type: 'line',
            data: arr4
        };
        let arrPF = new Array(12);
        for (let i = 0; i < dataArr.length; i++) {
            if (res4.data.length !== 0) {
                for (let item of res4.data) {
                    if (item.DATE == dataArr[i]) {
                        arrPF[i] = item.COUNT;
                    } else {
                        arrPF[i] = 0;
                    }
                }
            } else {
                arrPF = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
            }
        };


        $scope.lineOption = createOption(arrBF, arrBUF, arrPUF, arrPF, dataArr);


    };
    getDis();


    function createOption(data1, data2, data3, data4, data5) {
        let lineOption = {
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    type: 'cross',
                    label: {
                        backgroundColor: '#6a7985'
                    },
                }
            },
            legend: {
                data: ['已修复桥梁', '未修复桥梁', '未修复人行通道', '已修复人行通道'],
                x: 'right'
            },
            color: ["#d560fe", "#0eb8f6"],
            toolbox: {
            },
            grid: {
                left: '0%',
                right: '0%',
                bottom: '0%',
                containLabel: true
            },
            xAxis: [
                {
                    type: 'category',
                    boundaryGap: ['40%', '40%'],
                    data: data5
                }
            ],
            yAxis: [
                {
                    type: 'value'
                }
            ],
            series: [

                {
                    name: '已修复桥梁',
                    type: 'line',
                    data: data1
                },
                {
                    name: '未修复桥梁',
                    type: 'line',

                    data: data2
                },
                {
                    name: '未修复人行通道',
                    type: 'line',
                    data: data4
                }
            ]
        };
        return lineOption;
    }

    function options(data, item, inner) {

        let option = {
            tooltip: {
                trigger: 'item',
                formatter: "{a} <br/>{b}: {c} ({d}%)"
            },
            legend: {
                orient: 'vertical',
                x: 'left',
                data: data
            },
            series: [
                {
                    name: '数量统计',
                    type: 'pie',
                    radius: ['30%', '55%'],
                    center: ['65%', '45%'],

                    data: item
                }
            ]
        };
        return option;
    };
    async function getOrigin() {
        let getNum = '/bridgeinfo/select_number?uid=' + $scope.app.globalInfo.userid+'&power='+JSON.parse(sessionStorage.getItem('msg')).usertype;
        let res = await $http.get(getNum);
        $scope.numbers = res.data[0];

        let getCost = '/bridgeinfo/select_sumcost?uid=' + $scope.app.globalInfo.userid+'&power='+JSON.parse(sessionStorage.getItem('msg')).usertype;
        res = await $http.get(getCost);
        $scope.cost = res.data[0].suma;

        let getTotal = '/bridgeinfo/select_sumnum?uid=' + $scope.app.globalInfo.userid+'&power='+JSON.parse(sessionStorage.getItem('msg')).usertype;
        res = await $http.get(getTotal);

        $scope.totalNum = res.data[0].SUMNUM;

        let getFinish = '/bridgeinfo/select_num?uid=' + $scope.app.globalInfo.userid+'&power='+JSON.parse(sessionStorage.getItem('msg')).usertype;
        res = await $http.get(getFinish);
        $scope.$apply(function () {
            if(res.data[0].NUM) {
                $scope.finishNum = res.data[0].NUM;
            }

        });
        let getCuring = '/bridgeinfo/select_setp?uid=' + $scope.app.globalInfo.userid+'&power='+JSON.parse(sessionStorage.getItem('msg')).usertype;
        res = await $http.get(getCuring);
        $scope.$apply(function () {
            $scope.report = res.data[0].step_one;
            $scope.oddNum = res.data[0].step_two;
            $scope.complete = res.data[0].step_three;
            $scope.check = res.data[0].step_four;
        });



    };
    getOrigin();



    $scope.lineOptions = {};
    $scope.lineOptions1 = {};
    $scope.lineOptions2 = {};
    async function getData1() {
        let getbriType = '/bridgeinfo/select_classnum?uid=' + $scope.app.globalInfo.userid+'&power='+JSON.parse(sessionStorage.getItem('msg')).usertype;
        let res = await $http.get(getbriType);
        let data1 = Object.keys(res.data[0]);
        let changeData = objToArr(res.data[0]);
        let data4 = changeData.map(function (item) {
            let obj = {};

            obj.value = item[Object.keys(item)];
            obj.name = Object.keys(item)[0];
            return obj;
        });
        let item1 = data4.slice(0, 2);
        $scope.lineOptions = options(data1, data4, item1);
    };
    getData1();

    async function getData2() {
        let getbriType = '/bridgeinfo/select_func?uid=' + $scope.app.globalInfo.userid+'&power='+JSON.parse(sessionStorage.getItem('msg')).usertype;
        let res = await $http.get(getbriType);
        let data2 = Object.keys(res.data[0]);
        let changeData = objToArr(res.data[0]);
        let data5 = changeData.map(function (item) {
            let obj = {};

            obj.value = item[Object.keys(item)];
            obj.name = Object.keys(item)[0];
            return obj;
        });
        let item2 = data5.slice(0, 2);
        $scope.lineOptions1 = options(data2, data5, item2);
    };
    getData2();

    async function getData3() {
        let getbriType = '/bridgeinfo/select_grade_sql?uid=' + $scope.app.globalInfo.userid+'&power='+JSON.parse(sessionStorage.getItem('msg')).usertype;
        let res = await $http.get(getbriType);
        let data3 = Object.keys(res.data[0]);
        let changeData = objToArr(res.data[0]);
        let data6 = changeData.map(function (item) {
            let obj = {};

            obj.value = item[Object.keys(item)];
            obj.name = Object.keys(item)[0];
            return obj;
        });
        let item3 = data6.slice(0, 2);
        $scope.lineOptions2 = options(data3, data6, item3);
    };
    getData3();



    function objToArr(obj) {
        var arr = []
        for (let i in obj) {
            let o = {};
            o[i] = obj[i];
            arr.push(o)

        }
        return arr;
    }

}])
