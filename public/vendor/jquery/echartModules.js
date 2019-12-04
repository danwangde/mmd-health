function ceshi(){

    var option = {
        title: {
            // text: '数据完整性统计'
        },
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                type: 'cross',
                label: {
                    backgroundColor: '#6b79c4'
                }
            },
            formatter: function (params) {
                try {

                    return params[0].value.toFixed(2);
                } catch (err) {

                }
            }
        },
        grid: {
            left: '8%',
            right: '5%',
            bottom: '10%',
        },
        xAxis: [
            {
                type: 'category',
                position: 'bottom',
                boundaryGap: true,


                data: []
            },
        ],
        yAxis: [

            {},
            {
                show: false,
                axisLabel: ''
            }
        ],
        series: [
            {
                type: 'bar',
                barCategoryGap: '40%',//柱图间距
                itemStyle: {
                    normal: {
                        color: new echarts.graphic.LinearGradient(
                            0, 0, 0, 1,
                            [
                                {offset: 0, color: '#a9e6b7'},
                                // {offset: 0.5, color: '#188df0'},
                                {offset: 1, color: '#a9e6b7'}
                            ]
                        )
                    },
                },
                data: [],

            },
            {
                type: 'line',
                yAxisIndex: 1,
                itemStyle: {
                    normal: {
                        color: "#27c24c"
                    }
                },
                data: []
            },
        ]
    };
    for (var i = 0; i < scope.source.data.length; i++) {
        if(scope.source.data[i].value>1)
            scope.source.data[i].value = 1;
        option.xAxis[0].data.push(scope.source.data[i].time.split(' ')[0]);
        option.series[0].data.push(scope.source.data[i].value * 100);
        option.series[1].data.push(scope.source.data[i].value * 100);
    }
    myChart.setOption(option);
}