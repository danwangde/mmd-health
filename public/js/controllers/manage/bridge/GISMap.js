'use strict';

app.controller('manageBridgeMap_controller', ['$scope', '$http', '$window', function ($scope, $http) {


    var map = new BMap.Map("container");
    $scope.longitude = 117.106836;
    $scope.latitude = 36.668542;

    var point = new BMap.Point($scope.longitude, $scope.latitude);
    var geoc = new BMap.Geocoder();
    map.addEventListener("click", function (e) {
        var pt = e.point;
        geoc.getLocation(pt, function (rs) {
            console.log('rs', rs);
        });
    });
    var local = new BMap.LocalSearch(map, {
        renderOptions: { map: map }
    });
    local.search("敏文");
    map.centerAndZoom(point, 15);
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
    async function getData() {
        /*   let getUrl = '/bridgeinfo/select_lon_lat?uid=' + $scope.app.globalInfo.userid;
          await $http.get(getUrl).then((res) => {
              console.log(res.data);
              $scope.data_position = res.data;
          }); */
        let getBridge = '/bridgeinfo/select_bridgeinfo?uid=' + $scope.app.globalInfo.userid;
        await $http.get(getBridge).then((res) => {
            console.log(res.data);
            $scope.data_info = res.data;
        });
        for (var i = 0; i < $scope.data_info.length; i++) {

            var marker = '';
            marker = new BMap.Marker(new BMap.Point($scope.data_info[i].BridgeLON, $scope.data_info[i].BridgeLAT), { icon: addIcon($scope.app.globalInfo.status[i].state) });  // 创建标注
            var content =
                `桥梁名称:${$scope.data_info[i].BridgeName} <br>
                 地址:${$scope.data_info[i].BridgeRoad} <br>
                 桥梁结构:${$scope.data_info[i].MainStructType} <br>
                 养护等级:${$scope.data_info[i].CuringGrade}<br>
                 <a href="#/app/basic/manageBridgeInfo" style="color:#000;"> 查看详情</a>&nbsp&nbsp&nbsp&nbsp&nbsp;
                 <a href="#/app/basic/manageBridgeInfo" style="color:#000;"> 常规检测</a> &nbsp&nbsp&nbsp&nbsp&nbsp;
                 <a href="#/app/basic/manageBridgeInfo" style="color:#000;">病害维修</a> &nbsp&nbsp&nbsp&nbsp&nbsp`;

            map.addOverlay(marker);               // 将标注添加到地图中
            marker.setAnimation(BMAP_ANIMATION_BOUNCE); //跳动的动画
            marker.enableDragging();           // 不可拖拽
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


    function addIcon(state) {
        var myIcon = null;
        if (state == 0) {
            myIcon = new BMap.Icon('../img/bridge_icon.png', new BMap.Size(50, 50), {
                anchor: new BMap.Size(48, 48)
            })
        } else if (state == 1) {
            myIcon = new BMap.Icon('../img/bridge_icon.png', new BMap.Size(50, 50), {
                anchor: new BMap.Size(48, 48)
            })
        }
        else {
            myIcon = new BMap.Icon('../img/bridge_icon.png', new BMap.Size(50, 50), {
                anchor: new BMap.Size(48, 48)
            })
        }
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
}]);