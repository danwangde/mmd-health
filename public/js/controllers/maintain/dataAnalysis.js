app.controller('dataAnalysis_controller', ['$scope', '$modal','$timeout', '$http', '$log', function ($scope, $modal, $timeout, $http, $log) {
  // barGap: 0,
  //$scope.selType = 0;
  $scope.legend0 = ['病害工单数量','维修工单数量','验收工单数量'];
  $scope.legend1 = ['桥梁','人行通道'];
  $scope.legend2 = ['申报费用','结算费用'];
  $scope.series0 = [];
  $scope.series1 = [];
  $scope.series2 = [];
  $scope.color0 = ['#003366', '#006699', '#e5323e'];
  $scope.color1 = ['#003366', '#006699'];
  $scope.color2 = ['#003366', '#e5323e'];
  $scope.lineOption = {};
  $scope.lineOptionEspecial = {};
  $scope.now = new Date();
  $scope.endTime = get_date_str(new Date());
  $scope.startTime = get_date_str(new Date($scope.now.getTime()-7*24*3600*1000));
  $scope.selType = 0;
  $scope.search = async function () {
    if($scope.selType == '0'){
      $scope.date0 = [];
      $scope.disease = [];
      $scope.repair = [];
      $scope.check = [];
      $scope.legend = $scope.legend0;
      $scope.color =  $scope.color0;
      let selUrl = '/curing/select_discount?startTime='+$scope.startTime + '&endTime='+$scope.endTime + '&branch_id='+JSON.parse(sessionStorage.getItem('msg')).branch_id;
      $http.get(selUrl).then((response) =>{
        console.log(response.data);
        $scope.data1 = response.data.data1;
        $scope.data2 = response.data.data2;
        $scope.data3 = response.data.data3;
        for(let item of $scope.data1){
          $scope.disease.push(item.discount);
        };
        for(let item of $scope.data2){
          $scope.repair.push(item.discount);
        };
        for(let item of $scope.data3){
          $scope.check.push(item.discount);
        };
        for(let item of $scope.data1){
          $scope.date0.push(item.retime);
        };
        $scope.series0.push( $scope.disease);
        $scope.series0.push( $scope.repair);
        $scope.series0.push( $scope.check);
        $scope.series =  $scope.series0;
        $scope.lineOptionEspecial = options($scope.color,  $scope.legend, $scope.date0);
        for(let [index,item] of $scope.legend.entries()){
          $scope.lineOptionEspecial.series.push({
            name : item ,
            type : 'bar',
            data : $scope.series[index]
          });
        };

      })
    }else if ($scope.selType == '1') {
      $scope.date1 = [];
      $scope.bridge = [];
      $scope.passageway = [];
      $scope.legend = $scope.legend1;
      $scope.color =  $scope.color1;
        let selUrl = '/curing/select_cost?startTime='+$scope.startTime + '&endTime='+$scope.endTime + '&uid='+$scope.app.globalInfo.userid;
        $http.get(selUrl).then((response) =>{
          $scope.bridgeCost = response.data.bridgeCost;
          $scope.passagewayCost = response.data.passagewayCost;
          for(let item of $scope.bridgeCost){
            $scope.bridge.push(item.BSUMCOST);
          };
          for(let item of $scope.passagewayCost){
            $scope.passageway.push(item.BSUMCOST);
          };
          console.log($scope.bridgeCost);
          for(let item of $scope.bridgeCost){
            $scope.date1.push(item.retime);
          };
          $scope.series1.push( $scope.bridge);
          $scope.series1.push( $scope.passageway);
          $scope.series =  $scope.series1;
          $scope.lineOption = options($scope.color,  $scope.legend, $scope.date1);
          console.log( $scope.lineOption)
          for(let [index,item] of $scope.legend.entries()){
            $scope.lineOption.series.push({
              name : item ,
              type : 'bar',
              data : $scope.series[index]
            });
          };
        });

    }else if ($scope.selType == '2') {
      $scope.date2 = [];
      $scope.declare = [];
      $scope.Settlement = [];
      $scope.legend = $scope.legend2;
      $scope.color =  $scope.color2;
      let selUrl = '/curing/select_cost_Settlement?startTime='+$scope.startTime + '&endTime='+$scope.endTime + '&branch_id='+JSON.parse(sessionStorage.getItem('msg')).branch_id;
      $http.get(selUrl).then((response) =>{
        console.log(response.data);
        $scope.data1 = response.data.data1;
        $scope.data2 = response.data.data2;
        for(let item of $scope.data1){
          $scope.declare.push(item.BSUMCOST);
        };
        for(let item of $scope.data2){
          $scope.Settlement.push(item.PSUMCOST);
        };
        for(let item of $scope.data1){
          $scope.date2.push(item.retime);
        };
        $scope.series2.push( $scope.declare);
        $scope.series2.push( $scope.Settlement);
        $scope.series =  $scope.series2;
        $scope.lineOption = options($scope.color,  $scope.legend, $scope.date2);
        for(let [index,item] of $scope.legend.entries()){
          $scope.lineOption.series.push({
            name : item ,
            type : 'bar',
            data : $scope.series[index]
          });
        };
      })
    }

  }
  function options(color, legend, date) {
    return {
      color: color,
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow'
        }
      },
      legend: {
        data:legend
      },
      calculable: true,
      xAxis: [
        {
          type: 'category',
          axisTick: {show: false},
          data: date
        }
      ],
      yAxis: [
        {
          type: 'value'
        }
      ],
      series:[]
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
    return Y + '-' + M + '-' + D + ' ' + H + ':' + Mi + ':' + S;
  }

  }]);
