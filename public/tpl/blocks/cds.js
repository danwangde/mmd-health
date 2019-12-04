'use strict';

/* Controllers */

app.controller('header_controller', ['$scope', '$rootScope', '$http', '$window', '$state', 'echart', '$timeout', '$interval', 'usermsg', function ($scope, $rootScope, $http, $window, $state, echart, $timeout, $interval, usermsg) {
    $scope.usermsg = usermsg;
    let audio1 = document.getElementById('music1');
    let audio2 = document.getElementById('music2');
    audio1.pause();
    audio2.pause();
    $scope.tmAlarm_pop = false;
    $scope.linkCheck_pop = false;
    $scope.playShow = true;
    $scope.pauseShow = false;
    $scope.playflag = true;
    $scope.play = function () {
        $scope.playShow = true;
        $scope.pauseShow = false;
        $scope.playflag = true;
    };
    $scope.pause = function () {
        $scope.playShow = false;
        $scope.pauseShow = true;

        $scope.playflag = false;
    };

    let socket = io();

    function Series(paraID) {
        let series = [];
        let line = new Object();
        line.data = [];
        line.type = 'line';
        line.name = paraID;
        line.showSymbol = false;
        line.smooth = true,
            line.symbol = 'circle',
            line.symbolSize = 5,
            line.sampling = 'average',
            line.itemStyle = {
                normal: {
                    color: '#4594ec'
                }
            },
            line.areaStyle = {
                normal: {
                    color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                        offset: 0,
                        color: '#7eb7f6'
                    }, {
                        offset: 1,
                        color: '#edf5fd'
                    }])
                }
            },
            series.push(line);
        return series;
    }


    $scope.getPara = function () {
        let loginUrl = '/header/GetPara?SCID=' + $scope.app.globalInfo.currentSCid;
        $http.get(loginUrl)
            .then(function (response) {
                    if (response.data !== 'err') {
                        $scope.app_real.yaoce_real_options = {};
                        $scope.app_real.yaoce_delayed_options = {};
                        $scope.app_real.yaoce_real_list = {};
                        $scope.app_real.yaoce_delayed_list = {};
                        $scope.app.globalInfo.paraInfo = response.data;
                        for (let i = 0; i < response.data.length; i++) {
                            let series = Series(response.data[i].paraID);

                            let option = new echart.line(response.data[i].para_name, response.data[i].unit, 2, series, response.data[i].subsystem_id);
                            $scope.app_real.yaoce_real_options[response.data[i].paraID] = option;

                            $scope.app_real.yaoce_real_options[response.data[i].paraID].showchart = false;
                            $scope.app_real.yaoce_real_list[response.data[i].paraID] = {
                                paraID: response.data[i].paraID,
                                para_name: response.data[i].para_name,
                                data: null,
                                time: null,
                                Level: null,
                                subsystem_id: response.data[i].subsystem_id
                            };
                            let delay_series = Series(response.data[i].paraID);
                            let delay_option = new echart.line(response.data[i].para_name, response.data[i].unit, 1, delay_series, response.data[i].subsystem_id);
                            $scope.app_real.yaoce_delayed_options[response.data[i].paraID] = delay_option;
                            $scope.app_real.yaoce_delayed_options[response.data[i].paraID].showchart = false;
                            $scope.app_real.yaoce_delayed_list[response.data[i].paraID] = {
                                paraID: response.data[i].paraID,
                                para_name: response.data[i].para_name,
                                data: null,
                                time: null,
                                Level: null,
                                subsystem_id: response.data[i].subsystem_id
                            };
                        }
                        socket.emit('room', $scope.app.globalInfo.currentSCid);
                    }
                    else {
                        alert('获取遥测参数列表失败');
                    }
                }, function (x) {

                }
            );
    };
    $scope.getPara();

    if ($scope.app.globalInfo.currentGroupid !== -1) {
        for (let i = 0; i < $scope.usermsg.group_arr.length; i++) {
            if ($scope.usermsg.group_arr[i].group_id == $scope.app.globalInfo.currentGroupid) {
                $scope.selectGroup = $scope.usermsg.group_arr[i];
                break
            } else {
            }
        }
        for (let j = 0; j < $scope.selectGroup.SC_arr.length; j++) {
            if ($scope.selectGroup.SC_arr[j].SCID == $scope.app.globalInfo.currentSCid) {
                $scope.selectSC = $scope.selectGroup.SC_arr[j];
                break
            } else {
                $scope.selectSC = $scope.selectGroup.SC_arr[0];
            }
        }
        for (let j = 0; j < $scope.usermsg.GS_arr.length; j++) {
            if ($scope.usermsg.GS_arr[j].GSID == $scope.app.globalInfo.currentGSID) {
                $scope.selectGS = $scope.usermsg.GS_arr[j];
                break
            } else {
                $scope.selectGS = $scope.usermsg.GS_arr[0];
            }
        }
    } else {
        $scope.selectGroup = $scope.usermsg.group_arr[0];
        $scope.selectSC = $scope.usermsg.group_arr[0].SC_arr[0];
        $scope.app.globalInfo.currentGroupid = $scope.usermsg.group_arr[0].group_id;
        $scope.app.globalInfo.currentGroupname = $scope.usermsg.group_arr[0].group_name;
        $scope.app.globalInfo.currentSCid = $scope.usermsg.group_arr[0].SC_arr[0].SCID;
        $scope.app.globalInfo.currentSCname = $scope.usermsg.group_arr[0].SC_arr[0].name;

        $scope.selectGS = $scope.usermsg.GS_arr[0];
        $scope.app.globalInfo.currentGSID = $scope.selectGS.GSID;
    }

    $scope.changeGroup = function () {
        $scope.app.globalInfo.currentGroupid = $scope.selectGroup.group_id;
        $scope.app.globalInfo.currentGroupname = $scope.selectGroup.group_name;
        $scope.selectSC = $scope.selectGroup.SC_arr[0];
        $scope.changeSC();
    };

    $scope.changeSC = function () {
        $scope.app.globalInfo.currentSCid = $scope.selectSC.SCID;
        $scope.app.globalInfo.currentSCname = $scope.selectSC.name;
        $state.reload($state.currentState);
        $scope.getPara();
    };


    function replaceOriginalData(str) {
        return str.replace(/(.{2})/g, '$1 ');
    }

    $scope.changeGS = function () {
        $scope.app_real.waice_angle = {};
        $scope.app_real.waice_distance = {};
        $scope.app_real.waice_speed = {};
        $scope.app_real.waice_weather = {};
        $scope.app.globalInfo.currentGSID = $scope.selectGS.GSID;
    };

    $interval(function () {
        let ctime = new Date();
        $scope.localTime = get_date_str(ctime);
    }, 1000);

    function get_date_str(date) {
        let month = date.getMonth() + 1;
        if (month < 10) {
            month = "0" + month;
        }
        let day = date.getDate();
        if (date < 10) {
            day = "0" + day;
        }

        let hours = date.getHours();
        if (hours < 10) {
            hours = "0" + hours;
        }
        let minutes = date.getMinutes();
        if (minutes < 10) {
            minutes = "0" + minutes;
        }
        let seconds = date.getSeconds();
        if (seconds < 10) {
            seconds = "0" + seconds;
        }
        return date.getFullYear() + '-' + month + '-' + day + ' ' + hours + ':' + minutes + ':' + seconds;
    }
    let sourceArray=[];
    let linkMap=new Map();
    socket.on('connect', function () {
        socket.emit("room", $scope.app.globalInfo.currentSCid);
        socket.on('data-yaoce-real', function (data) {
            if (data.SCID != $scope.app.globalInfo.currentSCid) {
                return;
            }
            // if (!$scope.app_real.yaoce_real_options.hasOwnProperty(data.paraID) && !$scope.app_real.yaoce_real_list.hasOwnProperty(data.paraID)) {
            //     return;
            // }

            $scope.SCTime = data.time;
            for (let key in data.values) {
                $scope.app_real.yaoce_real_options[key].series[0].data.push([data.time, data.values[key].value.data]);

                if ($scope.playflag == true) {
                    $scope.app_real.yaoce_real_list[key].data = data.values[key].value.data;
                    $scope.app_real.yaoce_real_list[key].time = data.time;
                    $scope.app_real.yaoce_real_list[key].state = data.values[key].value.state;
                    $scope.app_real.yaoce_real_list[key].Level = data.values[key].Level;
                    $scope.app_real.yaoce_real_list[key].original = data.values[key].original;
                }
            }
        });
        socket.on('data-yaoce-delayed', function (data) {
            if (data.SCID != $scope.app.globalInfo.currentSCid) {
                return;
            }
            // if (!$scope.app.globalInfo.yaoce_delay_options.hasOwnProperty(data.paraID) && !$scope.app_real.yaoce_delayed_list.hasOwnProperty(data.paraID)) {
            //     return;
            // }

            for (let key in data.values) {
                $scope.app_real.yaoce_delayed_options[key].series[0].data.push([data.time, data.values[key].value.data]);
                if ($scope.playflag == true) {
                    $scope.app_real.yaoce_delayed_list[key].data = data.values[key].value.data;
                    $scope.app_real.yaoce_delayed_list[key].state = data.values[key].value.state;
                    $scope.app_real.yaoce_delayed_list[key].time = data.time;
                    $scope.app_real.yaoce_delayed_list[key].level = data.values[key].level;
                    $scope.app_real.yaoce_delayed_list[key].original = data.values[key].original;
                }
            }
        });
        socket.on('data-yaoce-source', function (data) {
            if (data.SCID != $scope.app.globalInfo.currentSCid) {
                return;
            }
            if ($scope.playflag == false) {
                return;
            }
            let OriginalDataSplit = replaceOriginalData(data.originalData).split(" ");
            let OriginalDataArr = [];
            for (let i = 0; i < OriginalDataSplit.length; i += 8) {
                OriginalDataArr.push(OriginalDataSplit.slice(i, i + 8));
            }
            let obj = {devTime: data.devTime, originalData: OriginalDataArr};
            $scope.$apply(function () {
                sourceArray.unshift(obj);
                if(sourceArray.length > 3){
                    $scope.app_real.yaoce_source=sourceArray;
                    sourceArray=[];
                }
            });
        });
        socket.on('data-waice-angle', function (data) {
            if ($scope.playflag == false) {
                return;
            }
            $scope.$apply(function () {
                if ($scope.app.globalInfo.currentGSID == data.GSID) {
                    $scope.app_real.waice_angle = data;
                }
            })
        });
        socket.on('data-waice-speed', function (data) {
            if ($scope.playflag == false) {
                return;
            }
            $scope.$apply(function () {
                if ($scope.app.globalInfo.currentGSID == data.GSID) {
                    $scope.app_real.waice_speed = data;
                }
            })
        });
        socket.on('data-waice-MD', function (data) {
            if ($scope.playflag == false) {
                return;
            }
            $scope.$apply(function () {
                if ($scope.app.globalInfo.currentGSID == data.GSID) {
                    $scope.app_real.waice_weather = data;
                }
            })
        });
        socket.on('data-waice-distance', function (data) {
            if ($scope.playflag == false) {
                return;
            }
            $scope.$apply(function () {
                if ($scope.app.globalInfo.currentGSID == data.GSID) {
                    $scope.app_real.waice_distance = data;
                }
            })
        });
        socket.on('others-linkCheck', function (data) {
            console.log(data);
            if ($scope.playflag == false) {
                return;
            }
            if(!linkMap.has(data.GSID)){
                linkMap.set(data.GSID,0);
            }
            if (data.link == 0 && linkMap.get(data.GSID)==0) {
                $scope.linkCheck_pop = true;
                $scope.linkCheck_data = data;
                audio2.play();
            }
            else if(data.link == 1){
                linkMap.set(data.GSID,0);
                $scope.linkCheck_pop = false;
            }

            for (let i = 0; i < $scope.usermsg.GS_arr.length; i++) {
                $scope.$apply(function () {
                    if ($scope.usermsg.GS_arr[i].GSID == data.GSID) {
                        $scope.usermsg.GS_arr[i].time = data.time;
                        $scope.usermsg.GS_arr[i].state = data.state;
                    }
                })
            }
        });
        socket.on('others-delay', function (data) {
            if ($scope.playflag == false) {
                return;
            }
            for (let i = 0; i < $scope.usermsg.GS_arr.length; i++) {
                $scope.$apply(function () {
                    if ($scope.usermsg.GS_arr[i].GSID == data.GSID) {
                        $scope.usermsg.GS_arr[i].time = data.devTime;
                        $scope.usermsg.GS_arr[i].delay = ((data.Ts - data.Tf) + (data.Tzs - data.Tz)) / 20 + 'ms';
                    }
                })
            }
        });
        socket.on('data-TC', function (data) {
            if ($scope.playflag == false) {
                return;
            }
            console.log(data);
            $scope.$apply(function () {
                let obj = new Object();
                if (data.type == 1) {
                    obj.time = data.time;
                    for (let i = 0; i < $scope.usermsg.GS_arr.length; i++) {
                        if ($scope.usermsg.GS_arr[i].GSID == data.GSID) {
                            obj.station = $scope.usermsg.GS_arr[i].name;
                        }
                    }
                    obj.order = data.msg;
                    obj.state = '已发送';
                    obj.username = data.username;
                    $scope.app_real.TC_direct.push(obj);
                }
                else if (data.type == 2) {
                    obj.time = data.time;
                    for (let i = 0; i < $scope.usermsg.GS_arr.length; i++) {
                        if ($scope.usermsg.GS_arr[i].GSID == data.GSID) {
                            obj.station = $scope.usermsg.GS_arr[i].name;
                        }
                    }
                    obj.order = data.msg;
                    obj.state = '已发送';
                    obj.username = data.username;
                    $scope.app_real.TC_indirect.push(obj);
                }
            })
        });
        socket.on('data_alarm', function (data) {
            $scope.tmAlarm_pop = true;
            $scope.tmAlarm_data = {
                SCID: data.SCID,
                paraID: data.paraID,
                value: data.value,
                time: data.time,
                devTime: data.devTime
            };
            audio1.play();
        })
    });
    $scope.close_tmAlarm = function () {
        audio1.pause();
        $scope.tmAlarm_pop = false;
    };
    $scope.close_linkCheck = function () {
        linkMap.set($scope.linkCheck_data.GSID,1);
        audio2.pause();
        $scope.linkCheck_pop = false;
    };
}]);
