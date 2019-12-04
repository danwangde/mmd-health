'use strict';
app.controller('bigdataZjCtrl', ['$scope', '$modalInstance', '$http', function ($scope, $modalInstance, $http,) {
    let uid = JSON.parse(sessionStorage.getItem('msg')).userid;
    $scope.ubranch_id = JSON.parse(sessionStorage.getItem('msg')).branch_id;
    $scope.year = (new Date).getFullYear();
    $scope.zjYearD = $scope.year;
    $scope.zjBranch = $scope.ubranch_id;
    let getCuring = '/bridgeInfo/selCuring?manageid=' + uid;
    $http.get(getCuring).then(function (response) {
        $scope.curingData = response.data;
    });
    let Time = [];
    let allBar = [];
    let carBar = [];
    let passwayBar = [];
    let attachmentBar = [];
    let structureBar = [];
    let allLine = [];
    let carLine = [];
    let passwayLine = [];
    let attachmentLine = [];
    let structureLine = [];

    $scope.zjSearch = function (b, y) {
        searchBar(b, y);
        searchTable(b, y);
    };
    $scope.zjSearch($scope.zjBranch, $scope.zjYearD);

    function searchBar(b, y) {
        Time = [];
        allBar = [];
        carBar = [];
        passwayBar = [];
        attachmentBar = [];
        structureBar = [];
        allLine = [];
        carLine = [];
        passwayLine = [];
        attachmentLine = [];
        structureLine = [];
        $scope.optionZjXq = {};
        let url = '/bigDataStatics/select_details_bar?time=' + y + '&branch_id=' + b;
        console.log(url);
        $http.get(url).then(function (req) {
            let data = req.data;
            console.log(data)
            for (let i in data) {
                Time.push(data[i].Time);
                allBar.push(data[i].Bar.all);
                carBar.push(data[i].Bar.car);
                passwayBar.push(data[i].Bar.passway);
                attachmentBar.push(data[i].Bar.attachment);
                structureBar.push(data[i].Bar.structure);
                allLine.push(data[i].Line.all);
                carLine.push(data[i].Line.car);
                passwayLine.push(data[i].Line.passway);
                attachmentLine.push(data[i].Line.attachment);
                structureLine.push(data[i].Line.structure);

            }
            $scope.optionZjXq = {
                // color:['#7a98da'],
                legend: {
                    data: ['全部', '车行道', '人行道', '附属设施', '结构']
                },
                xAxis: {
                    type: 'category',
                    data: Time
                },

                yAxis: {
                    type: 'value'
                },
                series: [{
                    name: '全部',
                    data: allBar,
                    type: 'bar',
                    barWidth: 10,
                },
                    {
                        name: '车行道',
                        data: carBar,
                        type: 'bar',
                        barWidth: 10,
                    },
                    {
                        name: '人行道',
                        data: passwayBar,
                        type: 'bar',
                        barWidth: 10,
                    },
                    {
                        name: '附属设施',
                        data: attachmentBar,
                        type: 'bar',
                        barWidth: 10,
                    },
                    {
                        name: '结构',
                        data: structureBar,
                        type: 'bar',
                        barWidth: 10,
                    },
                    {
                        name: '全部',
                        data: allLine,
                        type: 'line',

                    },
                    {
                        name: '车行道',
                        data: carLine,
                        type: 'line',

                    },
                    {
                        name: '人行道',
                        data: passwayLine,
                        type: 'line',
                    },
                    {
                        name: '附属设施',
                        data: attachmentLine,
                        type: 'line',
                    },
                    {
                        name: '结构',
                        data: structureLine,
                        type: 'line'
                    }]
            };
        })
    }

    function searchTable(b, y) {
        $scope.zjTable = [];
        let url = '/bigDataStatics/select_details_table?time=' + y + '&branch_id=' + b;
        console.log(url);
        $http.get(url).then(function (req) {
            $scope.zjTable = req.data;
            console.log($scope.zjTable)
        })
    }


    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };

}]);
app.controller('bigdataSsCtrl', ['$scope', '$modalInstance', '$http', function ($scope, $modalInstance, $http) {
    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
    let uid = JSON.parse(sessionStorage.getItem('msg')).userid;
    $scope.ubranch_id = JSON.parse(sessionStorage.getItem('msg')).branch_id;
    $scope.year = (new Date).getFullYear();
    let getCuring = '/bridgeInfo/selCuring?manageid=' + uid;
    $http.get(getCuring).then(function (response) {
        $scope.curingData = response.data;
    });
    $scope.sSYearD = $scope.year;
    $scope.ssBranch = $scope.ubranch_id;
    $scope.ssArrange = 0;
    $scope.ssSearch = function (b, a, y) {
        searchChart(b, a, y);
        searchTable(b, a, y);
    };
    $scope.ssSearch($scope.ubranch_id, $scope.ssArrange, $scope.sSYearD);
    let facility = [];
    let allBar = [];
    let carBar = [];
    let passwayBar = [];
    let attachmentBar = [];
    let structureBar = [];
    let allLine = [];
    let carLine = [];
    let passwayLine = [];
    let attachmentLine = [];
    let structureLine = [];

    function searchChart(b, a, y) {
        let facility = [];
        let allBar = [];
        let carBar = [];
        let passwayBar = [];
        let attachmentBar = [];
        let structureBar = [];
        let allLine = [];
        let carLine = [];
        let passwayLine = [];
        let attachmentLine = [];
        let structureLine = [];
        $scope.optionSsXq = {};
        let url = '/bigDataStatics/select_detail_capital_bar?time=' + y + '&branch_id=' + b + '&arrange=' + a;
        console.log(url);
        $http.get(url).then(function (req) {
            console.log(req.data);
            for (let i in req.data) {
                if (i < 10) {
                    facility.push(req.data[i].name);
                    allBar.push(req.data[i].bar.all);
                    carBar.push(req.data[i].bar.car);
                    passwayBar.push(req.data[i].bar.passway);
                    attachmentBar.push(req.data[i].bar.attachment);
                    structureBar.push(req.data[i].bar.structure);
                    allLine.push(req.data[i].line.all);
                    carLine.push(req.data[i].line.car);
                    passwayLine.push(req.data[i].line.passway);
                    attachmentLine.push(req.data[i].line.attachment);
                    structureLine.push(req.data[i].line.structure);

                } else {
                    break;
                }
            }
            $scope.optionSsXq = {
                // color:['#7a98da'],
                legend: {
                    data: ['全部', '车行道', '人行道', '附属设施', '结构']
                },
                xAxis: {
                    type: 'category',
                    data: facility
                },

                yAxis: {
                    type: 'value'
                },
                series: [{
                    name: '全部',
                    data: allBar,
                    type: 'bar',
                    barWidth: 10,
                },
                    {
                        name: '车行道',
                        data: carBar,
                        type: 'bar',
                        barWidth: 10,
                    },
                    {
                        name: '人行道',
                        data: passwayBar,
                        type: 'bar',
                        barWidth: 10,
                    },
                    {
                        name: '附属设施',
                        data: attachmentBar,
                        type: 'bar',
                        barWidth: 10,
                    },
                    {
                        name: '结构',
                        data: structureBar,
                        type: 'bar',
                        barWidth: 10,
                    },
                    {
                        name: '全部',
                        data: allLine,
                        type: 'line',

                    },
                    {
                        name: '车行道',
                        data: carLine,
                        type: 'line',

                    },
                    {
                        name: '人行道',
                        data: passwayLine,
                        type: 'line',
                    },
                    {
                        name: '附属设施',
                        data: attachmentLine,
                        type: 'line',
                    },
                    {
                        name: '结构',
                        data: structureLine,
                        type: 'line'
                    }]
            };
        })
    }

    function searchTable(b, a, y) {
        $scope.ssTable = [];
        let url = '/bigDataStatics/select_detail_capital_table?time=' + y + '&branch_id=' + b + '&arrange=' + a;
        console.log(url);
        $http.get(url).then(function (req) {
            console.log(req.data);
            $scope.ssTable = req.data
        })
    }

}]);
app.controller('bigdataBCICtrl', ['$scope', '$modalInstance', '$http', function ($scope, $modalInstance, $http) {
    let uid = JSON.parse(sessionStorage.getItem('msg')).userid;
    $scope.year = (new Date).getFullYear();

    $scope.changeYear=function(bciYear){
        bciBar(bciYear)
        bciTable(bciYear)
    };
    function bciBar(bciYear){
        let data=[];
        $scope.optionZjXq={};
        let url='/bigDataStatics/select_bci_bar?uid='+uid+'&nowYear='+ bciYear;
        console.log(url)
        $http.get(url).then(function(req){
            console.log(req.data)
            data=[req.data[0].A,req.data[0].B,req.data[0].C,req.data[0].D,req.data[0].E]
            $scope.optionZjXq = {
                color: ['#003366'],
                xAxis: {
                    type: 'category',
                    data: ['A', 'B', 'C', 'D', 'E']
                },

                yAxis: {
                    type: 'value'
                },
                series: [{
                    name: '病害总数',
                    data:data,
                    type: 'bar',
                    barWidth: 40,
                }]
            };
        })
    }
    function bciTable(bciYear){
        $scope.tableData=[];
        let url='/bigDataStatics/select_bci_table?uid='+uid+'&nowYear='+ bciYear;
        console.log(url)
        $http.get(url).then(function(req){
            $scope.tableData=req.data;

        })
    }
    $scope.changeYear($scope.year);

    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    }
}]);

app.controller('bigData_controller', ['$scope', '$http', '$modal', function ($scope, $http, $modal) {

    $scope.year = (new Date).getFullYear().toString();
    let currentMonth = (new Date).getMonth() + 1;
    $scope.month = [];
    let i = 0;
    while (currentMonth - i > 0) {
        if (i < 10) {
            $scope.month.push('0' + (i + 1));
        }
        i++;
    }
    let uid = JSON.parse(sessionStorage.getItem('msg')).userid;


    // 养护资金使用分析
    $scope.zjYear = $scope.year;
    $scope.changeZjYear = function () {
        $scope.zjTime = [];
        $scope.zjTis = [];
        $scope.zjFund = [];
        $scope.optionzj = {};
        let url = '/bigDataStatics/select_price?uid=' + uid + '&time=' + $scope.zjYear;
        console.log(url);
        $http.get(url).then(function (req) {
            console.log(req.data);
            for (let i in req.data) {
                $scope.zjTime.push(req.data[i].TIME);
                $scope.zjTis.push(req.data[i].dis);
                $scope.zjFund.push(req.data[i].fund);
            }
            $scope.optionzj = {
                color: ['#003366'],
                legend: {
                    data: ['病害总数', '养护资金总额']
                },
                xAxis: {
                    type: 'category',
                    data: $scope.zjTime
                },

                yAxis: {
                    type: 'value'
                },
                series: [{
                    name: '病害总数',
                    data: $scope.zjTis,
                    type: 'bar',
                    barWidth: 20,
                },
                    {
                        name: '养护资金总额',
                        data: $scope.zjFund,
                        type: 'line',
                        smooth: true,
                        symbol: 'circle',//折线点设置为实心点
                        symbolSize: 4,   //折线点的大小
                        itemStyle: {
                            normal: {
                                color: "#e5323e",//折线点的颜色
                                lineStyle: {
                                    color: "#e5323e"//折线的颜色
                                }
                            }
                        }
                    }]
            };
        })
    };
    $scope.changeZjYear();


    // 桥梁BCI
    $scope.getBCI = function () {
        let aData = [];
        let bData = [];
        let cData = [];
        let dData = [];
        let eData = [];
        let timeData = [];
        let bridgeData = [];
        $scope.optionBCI = {};
        $http.get('/bigDataStatics/select_bci_bigData?uid=' + uid).then(function (req) {
            for (let i in  req.data) {
                aData.push(req.data[i].A)
                bData.push(req.data[i].B)
                cData.push(req.data[i].C)
                dData.push(req.data[i].D)
                eData.push(req.data[i].E)
                bridgeData.push(req.data[i].DISCONT)
                timeData.push(req.data[i].TIME)
            }
            $scope.optionBCI = {
                // title: {
                //     text: '堆叠区域图'
                // },
                // color:['#f9cc7b','#f88080','#6bdfc5','#4da1ff','#b379fa','#8694fb','#4672d1'],
                tooltip: {
                    trigger: 'axis',
                    axisPointer: {
                        type: 'cross',
                        label: {
                            backgroundColor: '#4476cf'
                        }
                    }
                },
                legend: {
                    data: ['A', 'B', 'C', 'D', 'E', '桥梁总数'],
                },
                // grid: {
                //     left: '3%',
                //     right: '4%',
                //     bottom: '3%',
                //     containLabel: true
                // },
                xAxis: [
                    {
                        type: 'category',
                        boundaryGap: false,
                        data: timeData
                    }
                ],
                yAxis: [
                    {
                        type: 'value'
                    }
                ],
                series: [
                    {
                        name: 'A',
                        type: 'line',
                        smooth: true,
                        itemStyle: {
                            normal: {}
                        },

                        data: aData
                    },
                    {
                        name: 'B',
                        type: 'line',
                        smooth: true,
                        itemStyle: {
                            normal: {}
                        },

                        data: bData
                    },
                    {
                        name: 'C',
                        type: 'line',
                        smooth: true,
                        itemStyle: {
                            normal: {}
                        },

                        data: cData
                    }, {
                        name: 'D',
                        type: 'line',
                        smooth: true,
                        itemStyle: {
                            normal: {}
                        },

                        data: dData
                    },
                    {
                        name: 'E',
                        type: 'line',
                        smooth: true,
                        itemStyle: {
                            normal: {}
                        },
                        data: eData
                    },
                    {
                        name: '桥梁总数',
                        type: 'line',
                        smooth: true,
                        itemStyle: {
                            normal: {}
                        },
                        data: bridgeData
                    }
                ]
            };
        })
    };
    $scope.getBCI();

    $scope.optionOther = {
        // title: {
        //     text: '堆叠区域图'
        // },
        // color:['#f9cc7b','#f88080','#6bdfc5','#4da1ff','#b379fa','#8694fb','#4672d1'],
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                type: 'cross',
                label: {
                    backgroundColor: '#4476cf'
                }
            }
        },
        legend: {
            data: ['A', 'B', 'C', 'D', '合格', '不合格', '桥梁总数'],
        },
        // grid: {
        //     left: '3%',
        //     right: '4%',
        //     bottom: '3%',
        //     containLabel: true
        // },
        xAxis: [
            {
                type: 'category',
                boundaryGap: false,
                data: ['2015年', '2016年', '2017年', '2018年', '2019年']
            }
        ],
        yAxis: [
            {
                type: 'value'
            }
        ],
        series: [
            {
                name: 'A',
                type: 'line',
                smooth: true,
                itemStyle: {
                    normal: {}
                },

                data: [320, 332, 301, 334, 390]
            },
            {
                name: 'B',
                type: 'line',
                smooth: true,
                itemStyle: {
                    normal: {}
                },

                data: [220, 182, 191, 234, 290]
            },
            {
                name: 'C',
                type: 'line',
                smooth: true,
                itemStyle: {
                    normal: {}
                },

                data: [150, 232, 201, 154, 190]
            }, {
                name: 'D',
                type: 'line',
                smooth: true,
                itemStyle: {
                    normal: {}
                },

                data: [140, 222, 231, 254, 130]
            },
            {
                name: '合格',
                type: 'line',
                smooth: true,
                itemStyle: {
                    normal: {}
                },

                data: [98, 240, 101, 99, 40]
            },
            {
                name: '不合格',
                type: 'line',
                smooth: true,
                itemStyle: {
                    normal: {}
                },

                data: [98, 240, 101, 99, 40]
            },
            {
                name: '桥梁总数',
                type: 'line',
                smooth: true,
                itemStyle: {
                    normal: {}
                },

                data: [399, 380, 397, 390, 379]
            }
        ]
    };

    // 设施病害对比养护资金分析
    $scope.ssYear = $scope.year;
    $scope.changeSsYear = function () {
        SsLeft();
        SsRight();
    };
    $scope.changeSsYear();

    function SsLeft() {
        $scope.leftFacilitiesname = [];
        $scope.leftCOUNTDIS = [];
        $scope.optionBarLeft = {};
        let url = '/bigDataStatics/select_left_capital?uid=' + uid + '&time=' + $scope.ssYear;
        console.log(url);
        $http.get(url).then(function (req) {
            console.log(req.data);
            for (let i in req.data) {
                if (i < 10) {
                    $scope.leftFacilitiesname.unshift(req.data[i].facilitiesname);
                    $scope.leftCOUNTDIS.unshift(req.data[i].COUNTDIS);
                } else {
                    break;
                }
            }
            console.log($scope.leftFacilitiesname)
            console.log($scope.leftCOUNTDIS)
            $scope.optionBarLeft = {
                color: ['#2f4554'],
                title: {
                    text: '按病害数量排名',
                    textStyle: {
                        color: '#001b8a',
                        fontStyle: 'normal',
                        fontWeight: 'normal',
                        fontSize: 14
                    },
                    left: 'center'
                },

                // legend: {
                //     data: ['用户数'],
                //     top:30,
                // },
                grid: {
                    top: '7%',
                    left: '3%',
                    right: '4%',
                    bottom: '8%',
                    containLabel: true
                },
                xAxis: {
                    type: 'value',
                    boundaryGap: [0, 0.01]
                },
                yAxis: {
                    type: 'category',
                    axisLabel: {
                        interval: 0,
                        rotate: 30
                    },
                    data: $scope.leftFacilitiesname
                },
                series: [
                    {
                        name: '病害数量',
                        barWidth: 20,		//设置柱子宽度
                        type: 'bar',
                        itemStyle: {
                            normal: {}
                        },
                        data: $scope.leftCOUNTDIS
                    }
                ]
            };
        })
    }

    function SsRight() {
        $scope.rightfacilitiesname = [];
        $scope.rightCost = [];
        $scope.optionBarRight = {};
        let url = '/bigDataStatics/select_right_capital?uid=' + uid + '&time=' + $scope.ssYear;
        console.log(url);
        $http.get(url).then(function (req) {
            console.log(req.data);
            for (let i in req.data) {
                if (i < 10) {
                    $scope.rightfacilitiesname.unshift(req.data[i].facilitiesname);
                    $scope.rightCost.unshift(-req.data[i].Cost);
                } else {
                    break;
                }
            }
            $scope.optionBarRight = {
                // color:['#3398DB'],
                title: {
                    text: '按资金使用排名',
                    textStyle: {
                        color: '#001b8a',
                        fontStyle: 'normal',
                        fontWeight: 'normal',
                        fontSize: 14
                    },
                    left: 'center'
                },

                // legend: {
                //     data: ['用户数'],
                //     top:30,
                // },
                grid: {
                    top: '7%',
                    left: '3%',
                    right: '4%',
                    bottom: '8%',
                    containLabel: true
                },
                xAxis: [
                    {
                        axisLabel: {
                            formatter: function (value) {
                                return Math.abs(value);//显示的数值都取绝对值
                            }
                        },
                        type: 'value'
                    }
                ],
                yAxis: {
                    type: 'category',
                    position: 'right',
                    axisLabel: {
                        interval: 0,
                        rotate: -30
                    },
                    data: $scope.rightfacilitiesname
                },
                series: [
                    {
                        name: '病害数量',
                        barWidth: 20,		//设置柱子宽度
                        type: 'bar',
                        itemStyle: {
                            normal: {}
                        },
                        data: $scope.rightCost
                    }
                ]
            };
        })
    }


    $scope.full = function () {
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
    }

    $scope.bigdataZj = function () {
        let modalInstance = $modal.open({
            templateUrl: 'bigdataZj.html',
            controller: 'bigdataZjCtrl',
            size: 'lg',
            backdrop: 'static',      
	        keyboard: false,
            resolve: {}
        });
        modalInstance.result.then(function () {
        }, function () {
        });
    };
    $scope.bigdataSs = function () {
        let modalInstance = $modal.open({
            templateUrl: 'bigdataSs.html',
            controller: 'bigdataSsCtrl',
            size: 'lg',
            backdrop: 'static',      
	        keyboard: false,
            resolve: {}
        });
        modalInstance.result.then(function () {
        }, function () {
        });
    };
    $scope.bigdataBCI = function () {
        let modalInstance = $modal.open({
            templateUrl: 'bigdataBCI.html',
            controller: 'bigdataBCICtrl',
            size: 'lg',
            backdrop: 'static',      
	        keyboard: false,
            resolve: {}
        });
        modalInstance.result.then(function () {
        }, function () {
        });
    };

    $scope.mapTime = $scope.year;
    $scope.changeMap = function () {
        let obj = {
            uid: uid,
            time: $scope.mapTime
        };
        console.log(obj)
        $http.post('/bigDataStatics/select_thermogram', obj).then(function (req) {
            console.log(req.data);
            initHotMap(req.data)
        })
    };
    $scope.changeMap();

    var myChart = echarts.init(document.getElementById('container'));

    function initHotMap(data) {
        var points = [].concat.apply([], data.map(function (track) {
            return track.map(function (seg) {
                return seg.coord.concat([1]);
            });
        }));

        var option = {
            bmap: {
                center: [120.13066322374, 30.240018034923],
                zoom: 14,
                roam: true,
                mapStyle: {}
            },
            visualMap: {
                show: false,
                top: 'top',
                min: 0,
                max: 1,
                seriesIndex: 0,
                calculable: true,
                inRange: {
                    color: ['blue', 'blue', 'green', 'yellow', 'red']
                }
            },
            series: [{
                type: 'heatmap',
                coordinateSystem: 'bmap',
                data: points,
                pointSize: 5,
                blurSize: 6
            }]
        };
        myChart.setOption(option);

        var bmap = myChart.getModel().getComponent('bmap').getBMap();
        bmap.addControl(new BMap.MapTypeControl());
    }


}]);
