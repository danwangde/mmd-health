app.controller('showAlarmCtrl', ['$scope','$http','$modalInstance','data', function ($scope, $http, $modalInstance, data) {
  console.log(data.item);
  $scope.imageURL = data.item;
  $scope.full1 = function () {
    var elem = document.getElementById("image");
    requestFullScreen(elem);
  };
  $scope.cancel = function () {
    $modalInstance.close();
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
}]);

app.controller('firstBridgeDetailCtrl',  ['$scope','data','$http','$modalInstance','data', function ($scope, data, $http, $modalInstance, data) {
  $scope.bridgeDetail = data.bridgeDetail[0];
  $scope.cancel = function () {
    $modalInstance.close();
  }
}]);

app.controller('manageDiseaseCtrl',  ['$scope','data','$http','$modalInstance','data', function ($scope, data, $http, $modalInstance, data) {
  $scope.diseaseTotal = data;
  $scope.cancel = function () {
    $modalInstance.close();
  }
}]);
app.controller('showBridgeAssessCtrl',  ['$scope','data','$http','$modalInstance','data', function ($scope, data, $http, $modalInstance, data) {
  $scope.cancel = function () {
    $modalInstance.close();
  };
    async function assess () {
        let url = '/assess/select_assess?uid='+JSON.parse(sessionStorage.getItem('msg')).userid;
        let res = await $http.get(url);
        $scope.bridgeAssess = res.data;
        for (let item of $scope.bridgeAssess ) {
            item.Inspection_date = get_date_str(new Date(item.Inspection_date));
        }
    }
    assess();
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

app.controller('firstPage_controller',['$scope','$window','$modal','$state','$http','$interval',function ($scope, $window, $modal, $state, $http, $interval){
  $scope.windowHeight = {
    "height": $window.innerHeight + 'px'
  };
  $scope.full = function () {
    let elem = document.getElementById("map");
    requestFullScreen(elem);
    $('#mapSearch').css('display','block');
  };


  $scope.manageData = [
    {
      id: 1,
      path:'app_full.office'
    },
    {
      id: 2,
      path:'app_full.office'
    },
    {id: 3, path:''},
    {id: 4, path: ''},
  ];
  $scope.imageDatas = [
    [
      {image:'http://47.92.89.74:3000/pic/picALM/1_275-770-2019-7-23-16-25-57.jpg'},
      {image:'http://47.92.89.74:3000/pic/picALM/1_275-770-2019-7-23-12-23-23.jpg'},
      {image:'http://47.92.89.74:3000/pic/picALM/1_275-770-2019-7-22-11-28-50.jpg'},
      {image:'http://47.92.89.74:3000/pic/picALM/2_111-8193-2019-7-19-19-0-15.jpg'}
    ],
    [
      {image:'http://47.92.89.74:3000/pic/picALM/2_111-8193-2019-7-19-13-6-41.jpg'},
      {image:'http://47.92.89.74:3000/pic/picALM/2_111-8193-2019-7-19-0-51-50.jpg'},
      {image:'http://47.92.89.74:3000/pic/picALM/1_275-770-2019-7-23-12-23-23.jpg'},
      {image:'http://47.92.89.74:3000/pic/picALM/1_275-770-2019-7-23-16-25-57.jpg'}
    ],
    [
      {image:'http://47.92.89.74:3000/pic/picALM/1_275-770-2019-7-23-12-23-23.jpg'},
      {image:'http://47.92.89.74:3000/pic/picALM/2_111-8193-2019-7-19-13-6-41.jpg'},
      {image:'http://47.92.89.74:3000/pic/picALM/1_275-770-2019-7-23-16-25-57.jpg'},
      {image:'http://47.92.89.74:3000/pic/picALM/2_111-8193-2019-7-19-0-51-50.jpg'},
    ],
  ];
  $scope.showDetail = function (item) {
    let modalInstance = $modal.open({
      templateUrl: 'showAlarm.html',
      controller: 'showAlarmCtrl',
      size: 'lg',
      backdrop: 'static',
      keyboard: false,
      resolve: {
        data: function () {
          return {
            item: item
          }
        }
      }
    });
    modalInstance.result.then(function () {
    }, function () {

    });

  }
  $scope.num = 0;
  $scope.changeImg = function (index) {
    $scope.num = index;
  }
  $scope.lineoption = {};
  $scope.lineoption1 = {};
  $scope.lineoption2= {};
  $scope.lineoption3 = {};
  $scope.usertype = JSON.parse(sessionStorage.getItem('msg')).usertype;
  if ($scope.usertype == '0') {
    $scope.nav = 5;
  }else {
    $scope.nav = 2;
  }
  $scope.goItem = function (item,nav,name,childname) {
    if (item) {
      $scope.app.globalInfo.nav = nav;
      $scope.app.globalInfo.Bread.parent=name;
      $scope.app.globalInfo.Bread.child=childname;
      $scope.app.globalInfo.Bread.grandson="";
      $('.modal-backdrop').remove();
      $('body').removeClass('modal-open');
      $state.go(item);

    }else {
      alert('此功能正在加速开发中！请您莫急！')
    }

  };
  $scope.clickItem = function (item) {
    if (item) {
      $state.go($scope.manageData[item].path,{itemId:item});
    }else {
      alert('此功能正在加速开发中！请您莫急！')
    }

  };
  $scope.open = function(){
    window.open('http://47.92.89.74:3000/#/access/signin?id=105');
  };
  $scope.clickBridge = async function (item) {
    let getUrl = '/bridgeInfo/selInfo';
    console.log(item)
    let response = await  $http.post(getUrl, item);
    $scope.bridgeDetail = response.data;
    $modal.open({
      templateUrl: 'firstBridgeDetail.html',
      controller: 'firstBridgeDetailCtrl',
      size: 'lg',
      backdrop: 'static',
      keyboard: false,
      resolve: {
        data: function () {
          return {
            bridgeDetail: $scope.bridgeDetail
          };
        }
      }
    });
  };
  $scope.showDisease = async function () {

    let modalInstance = $modal.open({
      templateUrl: 'manageDisease.html',
      controller: 'manageDiseaseCtrl',
      size: 'lg',
      backdrop: 'static',
      keyboard: false,
      resolve: {
        data: function () {
          return $scope.diseaseTotal
        }
      }
    })
  };

  $scope.showAssess = async function () {

    let modalInstance = $modal.open({
      templateUrl: 'showBridgeAssess.html',
      controller: 'showBridgeAssessCtrl',
      size: 'lg',
      backdrop: 'static',
      keyboard: false,
      resolve: {
        data: function () {
          return 1
        }
      }
    })
  };
  $scope.no = function () {
    alert('该功能暂未开放！')
  };
  $scope.recovery = function () {
    $('.tbl-header ').css('z-index',999);
    //$('.tbl-header ').css('opacity',1);
  }
  $scope.cs = function () {
    $('.tbl-header ').css('z-index',0);
    //$('.tbl-header ').css('opacity',0);
  };

  var map = new BMap.Map("map");
  $scope.longitude = 117.106836;
  $scope.latitude = 36.668542;
  var point = new BMap.Point($scope.longitude, $scope.latitude);
  map.centerAndZoom(point, 12);
  map.setCurrentCity("济南市");
    // 定义一个控件类,即function
    function ZoomControl() {
        this.defaultAnchor = BMAP_ANCHOR_TOP_LEFT;
        this.defaultOffset = new BMap.Size(10, 10);
    }

    // 通过JavaScript的prototype属性继承于BMap.Control
    ZoomControl.prototype = new BMap.Control();

    // 自定义控件必须实现自己的initialize方法,并且将控件的DOM元素返回
    // 在本方法中创建个div元素作为控件的容器,并将其添加到地图容器中
    ZoomControl.prototype.initialize = function(map){
        // 创建一个DOM元素
        var div = document.createElement("div");
        div.setAttribute('id','mapSearch');
        div.innerHTML = `<div id="full" style="border: none;cursor: pointer;top:0;left:0;" ng-click="full()"> <i class="fa fa-arrows-alt" style="font-size: 20px;"></i></div>`;
        /*div.innerHTML = `<form class="form-inline ng-pristine ng-valid pull-left" role="form">
                <div class="form-group">
                    <label > 桥梁名称:</label>
                    <input type="text" class="form-control"  placeholder=""  ng-model="address">
                </div>
                <div class="form-group">
                    <label >养护等级:</label>
                    <select id="select" class="form-control" ng-model="grade" style="width: 140px;">
                        <option value="044001">I等</option>
                        <option value="044002">II等</option>
                        <option value="044003">III等</option>
                    </select>
                </div>
                <button id="btn" class="btn searchBtn" >查询</button>
            </form>`;
*/
        // 添加DOM元素到地图中
        map.getContainer().appendChild(div);
        // 将DOM元素返回
        return div;
    }

    // 创建控件
    var myZoomCtrl = new ZoomControl();
    // 添加到地图当中
    map.addControl(myZoomCtrl);
  var walking = new BMap.WalkingRoute(map, {
    renderOptions: {
      map: map,
      autoViewport: true
    }
  });
  map.enableScrollWheelZoom();   //启用滚轮放大缩小，默认禁用
  map.enableContinuousZoom();    //启用地图惯性拖拽，默认禁用
  //map.addControl(new BMap.NavigationControl());

  //地图平移缩放控件
  //map.addControl(new BMap.NavigationControl());
  //比例尺控件
  //map.addControl(new BMap.ScaleControl());
  //缩略地图控件
  //map.addControl(new BMap.OverviewMapControl());
  //地图类型控件
  map.addControl(new BMap.MapTypeControl());

  map.setCurrentCity("济南"); // 仅当设置城市信息时，MapTypeControl的切换功能才能可用
  $scope.state = {bridge: 1, road: 2, tunnel: 3};
  $scope.show_info = [];
  async function getData() {

    let getBridge = '/bridgeinfo/select_bridgeinfo?uid=' + $scope.app.globalInfo.userid+'&power='+JSON.parse(sessionStorage.getItem('msg')).usertype;
    let res =await $http.get(getBridge);
    $scope.data_info = res.data;
    $scope.show_info = $scope.data_info;
    console.log( $scope.show_info)
    mapData($scope.show_info );
  };

  getData();
  var opts = {
    width: 220,     // 信息窗口宽度
    height: 150,     // 信息窗口高度
    borderRadius: 10,
    title: "桥梁信息", // 信息窗口标题
    enableMessage: true//设置允许信息窗发送短息
  };

  function mapData(data) {
    for (var i = 0; i < data.length; i++) {
      var marker = '';
      marker = new BMap.Marker(new BMap.Point(data[i].BridgeLON, data[i].BridgeLAT), { icon: addIcon($scope.state.bridge) });  // 创建标注
      var content =
        `桥梁名称:${data[i].BridgeName} <br>
                 地址:${data[i].BridgeRoad} <br>
                桥梁结构:${data[i].MainStructType=='035001'?'梁桥':data[i].MainStructType=='035002'?'悬臂+挂梁'
          :data[i].MainStructType=='035003'?'桁架桥':data[i].MainStructType=='035004'?'刚构桥'
            :data[i].MainStructType=='035005'?'钢结构拱桥':data[i].MainStructType=='035006'?'圬工拱桥（无拱上构造）'
              :data[i].MainStructType=='035007'?'圬工拱桥（有拱上构造）':data[i].MainStructType=='035008'?'钢筋混凝土拱桥'
                :data[i].MainStructType=='035009'?'人行天桥（梁桥）':data[i].MainStructType=='035010'?'人行天桥（钢桁架桥）':'???'} <br>
                 养护等级:${data[i].CuringGrade=='044001'?'I等':data[i].CuringGrade=='044002'?'II等':
          data[i].CuringGrade=='044003'?'III等':'???'}<br>
                 <a href="#/app/basic/manageBridgeInfo" style="color:#000;"> 查看详情</a>&nbsp&nbsp&nbsp&nbsp&nbsp;
                 <a href="#/app/basic/manageBridgeInfo" style="color:#000;"> 常规检测</a> &nbsp&nbsp&nbsp&nbsp&nbsp;
                 <a href="#/app/basic/manageBridgeInfo" style="color:#000;">病害维修</a> &nbsp&nbsp&nbsp&nbsp&nbsp`;

      map.addOverlay(marker);               // 将标注添加到地图中
      //marker.setAnimation(BMAP_ANIMATION_BOUNCE); //跳动的动画
      //marker.enableDragging();           // 不可拖拽
      addClickHandler(content, marker);

    }
  };
  function addIcon(state) {
    var myIcon = null;
    if (state == $scope.state.bridge) {
      myIcon = new BMap.Icon('../img/location-norma.png', new BMap.Size(50, 50), {
        anchor: new BMap.Size(48, 48)
      })
    }else if (state == $scope.state.road) {
      myIcon = new BMap.Icon('../img/location-alarm.png', new BMap.Size(50, 50), {
        anchor: new BMap.Size(48, 48)
      })
    }else {
      myIcon = new BMap.Icon('../img/location-state.png', new BMap.Size(50, 50), {
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
$('#full').click(function () {
    let elem = document.getElementById("map");
    requestFullScreen(elem);
});
  function  theLocation() {
    $scope.search_data = [];
    map.clearOverlays();
      console.log($scope.data_info)
    for (let i = 0; i < $scope.data_info.length; i++) {
      if ($('input').val() === $scope.data_info[i].BridgeName || $('#select option:selected').val() === $scope.data_info[i].CuringGrade) {
        var new_point = new BMap.Point($scope.data_info[i].BridgeLON, $scope.data_info[i].BridgeLAT);
        map.centerAndZoom(new_point, 10);
        $scope.search_data.push($scope.data_info[i]);
        $scope.show_info = $scope.search_data;
        console.log($scope.show_info)
        mapData($scope.show_info );
        //map.panTo(new_point);
      }
    };


  };
  /*-----------------------------------------------------*/
  async function diseaseStatics() {
    let date = new Date();
    let year = date.getFullYear();
    let branch_id = JSON.parse(sessionStorage.getItem('msg')).branch_id;
    console.log(branch_id)
    console.log(year);
    let url ='/bigDataStatics/select_submit_disease?time='+ year + '&branch_id=' + branch_id;
    let res = await $http.get(url);
    $scope.time = res.data.time;
    $scope.report = res.data.report;
    $scope.handle = res.data.handle;
    console.log(res.data);
    $scope.lineoption = {
      color: ['#003366', '#e5323e'],
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow'
        }
      },
      legend: {
        data: ['上报数量', '处理数量']
      },
      toolbox: {
        show: true,
        orient: 'vertical',
        left: 'right',
        top: 'center',
        feature: {
          mark: {show: true},
          dataView: {show: true, readOnly: false},
          magicType: {show: true, type: ['line', 'bar', 'stack', 'tiled']},
          restore: {show: true},
          saveAsImage: {show: true}
        }
      },
      calculable: true,
      xAxis: [
        {
          type: 'category',
          axisTick: {show: false},
          data: $scope.time
        }
      ],
      yAxis: [
        {
          type: 'value'
        }
      ],
      series: [
        {
          name: '上报数量',
          type: 'bar',
          barGap: 0,
          data: $scope.report
        },
        {
          name: '处理数量',
          type: 'bar',
          data: $scope.handle
        },

      ]
    };
  }
  diseaseStatics();

  async function selBci () {
    let url = '/bigDataStatics/select_bci?uid='+$scope.app.globalInfo.userid;
    let res = await $http.get(url);
    console.log(res.data)
      $scope.x = res.data.x;
      $scope.y = res.data.y;
      $scope.lineoption1 = {
          tooltip: {
              trigger: 'item',
              formatter: "{a} <br/>{b}: {c} ({d}%)"
          },
          legend: {
              orient: 'vertical',
              x: 'left',
              data:$scope.x
          },
          series: [

              {
                  name:'检测评估',
                  type:'pie',
                  radius: ['30%', '65%'],
                  center: ['55%', '55%'],
                  data:$scope.y
              }
          ]
      };
  }
  selBci();

  /*-----------------------------------------------------*/
  $scope.lineoption2 = {
    color: ['#003366'],
    tooltip : {
      trigger: 'axis',
      axisPointer : {
        type : 'shadow'
      }
    },
    toolbox: {
      show: true,
      orient: 'vertical',
      left: 'right',
      top: 'center',
      feature: {
        mark: {show: true},
        dataView: {show: true, readOnly: false},
        magicType: {show: true, type: ['line', 'bar', 'stack', 'tiled']},
        restore: {show: true},
        saveAsImage: {show: true}
      }
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true
    },
    xAxis : [
      {
        type : 'category',
        data : ['A', 'B', 'C', 'D'],
        axisTick: {
          alignWithLabel: true
        }
      }
    ],
    yAxis : [
      {
        type : 'value'
      }
    ],
    series : [
      {
        name:'路面损坏状况',
        type:'bar',
        barWidth: '60%',
        data:[100, 52, 200, 334]
      }
    ]
  };
  /*-----------------------------------------------------*/
  $scope.lineoption3 = {
    tooltip: {
      trigger: 'item',
      formatter: "{a} <br/>{b} : {c}%"
    },
    toolbox: {
      feature: {
        dataView: {readOnly: false},
        restore: {},
        saveAsImage: {}
      }
    },
    legend: {
      data: ['A','B','C','D']
    },
    calculable: true,
    series: [
      {
        name:'检测评估',
        type:'funnel',
        left: '10%',
        top: 60,
        //x2: 80,
        bottom: 60,
        width: '80%',
        // height: {totalHeight} - y - y2,
        min: 0,
        max: 100,
        minSize: '0%',
        maxSize: '100%',
        sort: 'descending',
        gap: 2,
        label: {
          show: true,
          position: 'inside'
        },
        labelLine: {
          length: 10,
          lineStyle: {
            width: 1,
            type: 'solid'
          }
        },
        itemStyle: {
          borderColor: '#fff',
          borderWidth: 1
        },
        emphasis: {
          label: {
            fontSize: 20
          }
        },
        data: [
          {value: 20, name: 'A'},
          {value: 40, name: 'B'},
          {value: 60, name: 'C'},
          {value: 80, name: 'D'}
        ]
      }
    ]
  };
  /*-----------------------------------------------------*/

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
      $scope.finishNum = res.data[0].NUM;
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

  async function getDisease() {
    let MyMarhq = '';
    let str = '';
    $interval.cancel(MyMarhq);
    let selectUrl = '/curing/select_disease_manage?uid=' + $scope.app.globalInfo.userid;
    await $http.get(selectUrl).then((res) => {
      console.log(res.data);
      $scope.diseaseTotal = res.data;
      for (let item of $scope.diseaseTotal) {
        item.Reporting_time = get_date_str(new Date(item.Reporting_time));
      };
      $.each(res.data,function (i, item) {
        str = '<tr class="showEye" title="点击查看所有信息" style="cursor: pointer;">'+
          '<td>'+item.facilitiesname+'</td>'+
          '<td>'+item.disease_name+'</td>'+
          '<td>'+item.Reporting_time+'</td>'+
         /* '<td>'+'<span class="publicpage_mgR10 publicpage_fs cursorPoin showEye" >'+'<i class="icon-eye publicpage_mgT10">'+'</i>'+'</span>'+'</td>'+*/
          '</tr>'

        $('.tbl-body tbody').append(str);
        $('.tbl-header tbody').append(str);
      });
      if(res.data.length > 1){
        $('.tbl-body tbody').html($('.tbl-body tbody').html()+$('.tbl-body tbody').html());
        $('.tbl-body').css('top', '0');
        var tblTop = 0;
        var speedhq = 60; // 数值越大越慢
        var outerHeight = $('.tbl-body tbody').find("tr").outerHeight();
        console.log(outerHeight)
        function Marqueehq(){
          if(tblTop <= -outerHeight*res.data.length){
            tblTop = 0;
          } else {
            tblTop -= 1;
          }
          $('.tbl-body').css('top', tblTop+'px');
        }

        MyMarhq = $interval(Marqueehq,speedhq);

        // 鼠标移上去取消事件
        $(".tbl-header tbody").hover(function (){
          $interval.cancel(MyMarhq);
        },function (){
          $interval.cancel(MyMarhq);
          MyMarhq = $interval(Marqueehq,speedhq);
        })

      };
	 $scope.$on("$destroy", function() {
        //清除配置,不然scroll会重复请求
        $interval.cancel(MyMarhq);
      })

      let arr = $('.showEye')
      $.each(res.data,function (i, item) {
        $(arr[i]).bind('click',function () {
          $scope.showDisease();
        })
      })
    });
  };
  getDisease();

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
  $scope.$on('$destroy',async function() {
      let url = '/memo/update_memorandum1';
      let obj = {branch_id: JSON.parse(sessionStorage.getItem('msg')).branch_id};
      let res = await $http.post(url,obj);
      console.log(res.data);
  });
  async function getMemo() {
        let url = '/memo/select_memorandum1?branch_id='+JSON.parse(sessionStorage.getItem('msg')).branch_id;
        await $http.get(url).then((res) => {
            $scope.memoData = res.data[0];
            console.log(res.data)
            if ( res.data.length >0 && $scope.memoData.creat_time !== '0000-00-00 00:00:00') {
                $scope.showMemo = true;
                $scope.memoData.creat_time =get_date_str(new Date( $scope.memoData.creat_time))
            }
        });

    };
    getMemo();
    // $scope.showMemo = false;
    $scope.close_linkCheck = function () {
        $scope.showMemo = false;
    };
    $scope.$on('$destroy',async function() {
      let url = '/memo/update_memorandum1';
      let res = await $http.post(url,$scope.addInfo);
      console.log(res.data)
  });
  function get_date_str(Date) {
    var Y = Date.getFullYear();
    var M = Date.getMonth() + 1;
    M = M < 10 ? '0' + M : M;// ??????0
    var D = Date.getDate();
    D = D < 10 ? '0' + D : D;
    var H = Date.getHours();
    H = H < 10 ? '0' + H : H;
    var Mi = Date.getMinutes();
    Mi = Mi < 10 ? '0' + Mi : Mi;
    var S = Date.getSeconds();
    S = S < 10 ? '0' + S : S;
    return Y + '-' + M + '-' + D + ' ' + H + ':' + Mi + ':' + S;
  };
}])
