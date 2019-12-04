app.controller('echeckBridgeMap_controller',['$scope','$http',function ($scope,$http) {
   
    var map = new BMap.Map("container");

    var point = new BMap.Point(117.106836,36.668542);
    map.centerAndZoom(point,15);
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

    map.setCurrentCity("西安"); // 仅当设置城市信息时，MapTypeControl的切换功能才能可用

    //map.setMapType(BMAP_HYBRID_MAP); // 设置：使用混合地图 // [117.106836,36.668542,"桥梁名称：山东省市场监督管理局","地址:山东省","桥梁结构:梁桥","养护等级：I等","查看详情","常规检测","病害维修"]
    var points =[];
    $scope.data_position=[
        {x:117.106836,y:36.668542},
        {x:116.105000,y:36.658542},
        {x:115.106000,y:36.648542},
        {x:117.104000,y:36.548542},
        {x:117.103110,y:36.545542},
        {x:117.105800,y:36.548342},
        {x:117.105000,y:36.543542},
        {x:117.106700,y:36.558542},
        {x:117.102700,y:36.547542},
        {x:117.109700,y:36.568542},
        {x:117.122700,y:36.541542},
        {x:117.110700,y:36.549542},
        {x:117.105700,y:36.546542}
    ];
    $scope.app.globalInfo.status = [
        {state:0}, {state:1}, {state:2},{state:0} ,{state:1} ,{state:2}, {state:0}, {state:1}, {state:2}, {state:0}, {state:1}, {state:2}, {state:0}
    ];
    $scope.data_info = [
        {bridgename:'胜利路桥',bridgeaddress:'山东省市场监督管理局',bridgestru:'梁桥',bridgecur:'I等',bridgedata1:'查看详情',bridgedata2:'常规检测'},
        {bridgename:'八一路桥',bridgeaddress:'山东省市场监督管理局',bridegstru:'梁桥',bridgecur:'I等',bridgedata1:'查看详情',bridgedata2:'常规检测'},
        {bridgename:'红旗路桥',bridgeaddress:'山东省督管理局',bridgestru:'梁桥',bridgecur:'I等',bridgedata1:'查看详情',bridgedata2:'常规检测'},
        {bridgename:'人民路桥',bridgeaddress:'山东省市场监督管理局',bridgestru:'梁桥',bridgecur:'I等',bridgedata1:'查看详情',bridgedata2:'常规检测'},
        {bridgename:'解放路桥',bridgeaddress:'山市场监督管理局',bridgestru:'梁桥',bridgecur:'I等',bridgedata1:'查看详情',bridgedata2:'常规检测'},
        {bridgename:'沂源路桥',bridgeaddress:'山东省市场理局',bridgestru:'梁桥',bridgecur:'I等',bridgedata1:'查看详情',bridgedata2:'常规检测'},
        {bridgename:'周村路桥',bridgeaddress:'山东场监督管理局',bridgestru:'梁桥',bridgecur:'I等',bridgedata1:'查看详情',bridgedata2:'常规检测'},
        {bridgename:'淄川路桥',bridgeaddress:'山东场监督管理局',bridgestru:'梁桥',bridgecur:'I等',bridgedata1:'查看详情',bridgedata2:'常规检测'},
        {bridgename:'张店路桥',bridgeaddress:'山东场监督管理局',bridgestru:'梁桥',bridgecur:'I等',bridgedata1:'查看详情',bridgedata2:'常规检测'},
        {bridgename:'高青路桥',bridgeaddress:'山东场监督管理局',bridgestru:'梁桥',bridgecur:'I等',bridgedata1:'查看详情',bridgedata2:'常规检测'},
        {bridgename:'南部山区桥',bridgeaddress:'山东场监督管理局',bridgestru:'梁桥',bridgecur:'I等',bridgedata1:'查看详情',bridgedata2:'常规检测'},
        {bridgename:'兴隆路桥',bridgeaddress:'山东场监督管理局',bridgestru:'梁桥',bridgecur:'I等',bridgedata1:'查看详情',bridgedata2:'常规检测'},
        {bridgename:'南北康桥',bridgeaddress:'山东场监督管理局',bridgestru:'梁桥',bridgecur:'I等',bridgedata1:'查看详情',bridgedata2:'常规检测'}
    ];
    var opts = {
        width : 220,     // 信息窗口宽度
        height: 150,     // 信息窗口高度
        borderRadius:10,
        title : "桥梁信息" , // 信息窗口标题
        enableMessage:true//设置允许信息窗发送短息
    };
    for(var i=0;i<$scope.data_info.length;i++){

        var marker ='';
        marker= new BMap.Marker(new BMap.Point($scope.data_position[i].x,$scope.data_position[i].y),{icon: addIcon($scope.app.globalInfo.status[i].state)});  // 创建标注
        var content=
            `桥梁名称:${$scope.data_info[i].bridgename} <br>
             地址:${$scope.data_info[i].bridgeaddress} <br>
             桥梁结构:${$scope.data_info[i].bridgestru} <br>
             养护等级:${$scope.data_info[i].bridgecur}<br> 
             <a href="#/app/basic/manageBridgeInfo" style="color:#000;"> ${$scope.data_info[i].bridgedata1}</a>&nbsp&nbsp&nbsp&nbsp&nbsp;
             <a href="#/app/echeckBridgeRegular" style="color:#000;"> ${$scope.data_info[i].bridgedata2}</a> &nbsp&nbsp&nbsp&nbsp&nbsp`;

        map.addOverlay(marker);               // 将标注添加到地图中
        addClickHandler(content,marker);
    }

    function addIcon(state) {
        var myIcon = null;
        if(state==0){
            myIcon = new BMap.Icon('../img/bridge_icon.png',new BMap.Size(50,50),{
                anchor: new BMap.Size(48,48)
            })
        }else if(state==1){
            myIcon = new BMap.Icon('../img/bridge_icon.png',new BMap.Size(50,50),{
                anchor: new BMap.Size(48,48)
            })
        }
        else{
            myIcon = new BMap.Icon('../img/bridge_icon.png',new BMap.Size(50,50),{
                anchor: new BMap.Size(48,48)
            })
        }
        return myIcon;
    }

    function addClickHandler(content,marker){
        marker.addEventListener("click",function(e){
            openInfo(content,e)}
        );
    }
    function openInfo(content,e){
        var p = e.target;
        var point = new BMap.Point(p.getPosition().lng, p.getPosition().lat);
        var infoWindow = new BMap.InfoWindow(content,opts);  // 创建信息窗口对象
        map.openInfoWindow(infoWindow,point); //开启信息窗口
    }
    
}])