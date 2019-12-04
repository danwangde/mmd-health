var app = angular.module('app');

app.directive('line', function() {
    return {
        scope: {
            options:"="
        },
        restrict: 'AE',
        template: '<div style="height:400px;"></div>',
        replace: true,
        link: function(scope, element, attrs, controller) {
            scope.myChart = echarts.init(element[0], null,{render:'svg'});
            scope.myChart.setOption(scope.options);

            scope.$watch('options',function(newValue, oldValue, scope){
                if (newValue!==oldValue){

                    scope.myChart.setOption(newValue,false);

                }
            },true)
        },
    }
});

app.directive('line1', function() {
    return {
        scope: {
            options:"="

        },
        restrict: 'AE',
        template: '<div  style="height:260px;width:100%;padding-bottom:0px;box-shadow: rgb(221, 221, 221) 0px 0px 10px;"></div>',
        replace: true,
        link: function(scope, element, attrs, controller) {
            scope.myChart = echarts.init(element[0]);
            scope.myChart.setOption(scope.options);

            scope.$watch('options',function(newValue, oldValue, scope){
                if (newValue!==oldValue){

                    scope.myChart.setOption(newValue,true);

                }
            },true)
        },

    }
});

app.directive('line2', function() {
    return {
        scope: {
            options:"="

        },
        restrict: 'AE',
        template: '<div  style="height:300px;width:500px;padding-bottom:0px;box-shadow: rgb(221, 221, 221) 0px 0px 10px;"></div>',
        replace: true,
        link: function(scope, element, attrs, controller) {
            scope.myChart = echarts.init(element[0]);

            scope.$watch('options',function(newValue, oldValue, scope){
                if (newValue!==oldValue){

                    scope.myChart.setOption(newValue,true);

                }
            },true)
        },
    }
});
app.directive('line4', function() {
    return {
        scope: {
            options:"="

        },
        restrict: 'AE',
        template: '<div style="height:280px;"></div>',
        replace: true,
        link: function(scope, element, attrs, controller) {
            scope.myChart = echarts.init(element[0], null,{render:'svg'});
            scope.myChart.setOption(scope.options);

            scope.$watch('options',function(newValue, oldValue, scope){
                if (newValue!==oldValue){

                    scope.myChart.setOption(newValue,false);
                }
            },true)
        },

    }


});
app.directive('line5', function() {
  return {
    scope: {
      options:"="

    },
    restrict: 'AE',
    template: '<div style="height:260px;"></div>',
    replace: true,
    link: function(scope, element, attrs, controller) {
      scope.myChart = echarts.init(element[0], null,{render:'svg'});
      scope.myChart.setOption(scope.options);

      scope.$watch('options',function(newValue, oldValue, scope){
        if (newValue!==oldValue){

          scope.myChart.setOption(newValue,false);

        }
      },true)
    },

  }


});
app.directive('line6', function() {
    return {
        scope: {
            options:"="

        },
        restrict: 'AE',
        template: '<div  style="height:340px;"></div>',
        replace: true,
        link: function(scope, element, attrs, controller) {
            scope.myChart = echarts.init(element[0]);
            scope.myChart.setOption(scope.options);
            scope.$watch('options',function(newValue, oldValue, scope){
                if (newValue!==oldValue){

                    scope.myChart.setOption(newValue,true);

                }
            },true)
        },

    }


});
app.directive('barCharts', function () {
    return {
        scope: {
            options: "="

        },
        restrict: 'AE',
        template: '<div style="padding:0px"></div>',
        replace: true,
        link: function (scope, element, attrs, controller) {
            console.log(scope.options)
            scope.myChart = echarts.init(element[0]);
            scope.myChart.setOption(scope.options);
            scope.myChart.resize();
            scope.$watch('options', function (newVal, oldVal) {
                if (newVal !== oldVal) {
                    scope.myChart.setOption(newVal,true);
                }
            }, true)
        },
    }
});
app.directive('lineCharts', function () {
    return {
        scope: {
            options: "="
        },
        restrict: 'AE',
        template: '<div style="padding:0px;"></div>',
        replace: true,
        link: function (scope, element, attrs) {
            console.log(scope.options)
            scope.myChart = echarts.init(element[0]);
            scope.myChart.setOption(scope.options);
            scope.myChart.resize();
            scope.$watch('options', function (newVal, oldVal) {
                if (newVal !== oldVal) {
                    scope.myChart.setOption(newVal,true);
                }
            }, true)
        }
    }
});
