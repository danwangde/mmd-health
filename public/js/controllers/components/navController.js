'use strict';
app.controller('nav_controller', ['$scope', '$http', '$state', function ($scope, $http, $state) {
    const nav1 = [
        { name: '首页', url: 'app.manageBridgeIndex', state: 'app.manageBridgeIndex' },
        {
            name: '基本信息',
            url: '',
            state: 'app.basic',
            children: [{ name: '桥梁信息', url: 'app.basic.manageBridgeInfo' }, {
                name: '人行通道信息',
                url: 'app.basic.manageBridgePassageway'
            }/* , {name: '基础信息统计', url: 'app.basic.manageInfoStatistics'} */]
        },
      {
        name: '巡查管理',
        url: '',
        state: 'app.patrolManage',
        children: [
          { name: '日常巡查', url: 'app.patrolManage.manageBridgePatrol' },
         /*  { name: '病害查询', url: 'app.patrolManage.manageDiseaseQuery' }, */
          { name: '巡查考核', url: 'app.patrolManage.managePatrolAssess' },
          { name: '巡查统计', url: 'app.patrolManage.managePatrolStatics' }]
      },/*
       {
            name: '统计报表',
            url: '',
            state: 'app.staticReport',
            children: [
                { name: '基础信息统计', url: 'app.staticReport.basisStatis', state: 'app.staticReport.basisStatis' },
                { name: '养护维修统计', url: 'app.staticReport.curingStatis', state: 'app.staticReport.curingStatis' },
                { name: '检测信息统计', url: 'app.staticReport.checkStatis', state: 'app.staticReport.checkStatis' }]
        }, */
        {
            name: '养护管理',
            url: '',
            state: 'app.maintain',
            children: [
              /*{ name: '任务管理', url: 'app.maintain.manageBridgeTask' },*/
              { name: '养护流程', url: 'app.maintain.manageBridgeOrder' },
              {name: '养护统计', url: 'app.maintain.curingStatis'}/*,  {
                name: '方案审核',
                url: 'app.maintain.manageBridgeScheme'
            }, {name: '检查验收', url: 'app.maintain.manageBridgeCheck'},   {
                name: '竣工结算',
                url: 'app.maintain.manageBridgeCost'
            } */]
        },
      {
        name: '结算管理',
        url: '',
        state: 'app.settlement',
        children: [
          { name: '结算统计', url: 'app.settlement.manageStatics' }]
      },
        {
            name: '检测管理',
            url: '',
            state: 'app.echeck',
            children: [
               /*  { name: '检测计划', url: 'app.echeck.manageBridgePlan' }, */
                {name: '常规检测',url: 'app.echeck.manageBridgeRegular'},
                /* {name: '结构性能检测', url: 'app.echeck.manageBridgeStructural'}, */
                {name: '荷载试验',url: 'app.echeck.manageBridgeLoadtest'}
            ]
        },
        {
            name: '技术评估',
            url: '',
            state: 'app.assessment',
            children: [{ name: '桥梁BIC', url: 'app.assessment.bridgeAssessment', state: 'app.assessment.bridgeAssessment' }, {
                name: '人行通道',
                url: 'app.assessment.passageAssessment',
                state: 'app.assessment.passageAssessment'
            }]
        },
        { name: 'GIS地图', state: 'app.manageBridgeMap', url: 'app.manageBridgeMap' },
      /*  { name: '数据导出', url: 'app.manageDataOut' } */
    ];
    const nav2 = [
        { name: '部门管理', url: 'app.managePublicOffice', state: 'app.managePublicOffice' },
        // {name: '角色管理', url: 'app.managePublicRole', state: 'app.managePublicRole'},
        { name: '账户管理', url: 'app.managePublicAccount', state: 'app.managePublicAccount' },
     /*   { name: '检测计划', url: 'app.managePublicEcheck', state: 'app.managePublicEcheck' },
        { name: '养护计划', url: 'app.managePublicMaintain', state: 'app.managePublicMaintain' },*/
       /*  { name: '资料管理', url: 'app.managePublicDataManage', state: 'app.managePublicDataManage' }, */
        { name: '通知公告', url: 'app.managePublicNotice', state: 'app.managePublicNotice' },
        { name: '备忘录', url: 'app.managePublicMemo', state: 'app.managePublicMemo' },
        { name: '养护病害库', url: 'app.manageCuringDis' },
        { name: '单价库', url: 'app.manageBridgePrice' },
        { name: '系统日志', state: 'app.managePublicJournal', url: 'app.managePublicJournal' }
    ];

    const nav3 = [
       /*  { name: '桥梁信息', state: 'app.echeckBridgeInfo', url: 'app.echeckBridgeInfo' },
        { name: '人行通道信息', state: 'app.echeckPassageInfo', url: 'app.echeckPassageInfo' }, */
        { name: '检测任务', state: 'app.echeckPlanStructural', url: 'app.echeckPlanStructural' },
      {
        name: '桥梁检测',
        url: '',
        state: 'app.bridgeCheck',
        children: [
          { name: '常规检测', state: 'app.bridgeCheck.echeckBridgeRegular', url: 'app.bridgeCheck.echeckBridgeRegular' },
          { name: '荷载试验', state: 'app.bridgeCheck.echeckBridgeLoadTest', url: 'app.bridgeCheck.echeckBridgeLoadTest' },
        ]
      },

       { name: '检测统计', state: 'app.echeckStatics', url: 'app.echeckStatics' },/*
        { name: 'GIS地图', state: 'app.echeckBridgeMap', url: 'app.echeckBridgeMap' },*/
        { name: '通知公告', state: 'app.echeckNotice', url: 'app.echeckNotice' },
        { name: '备忘录', url: 'app.managePublicMemo', state: 'app.managePublicMemo' }
    ];
    const nav4 = [
        { name: '桥梁信息', url: 'app.maintainBridgeInfo', state: 'app.maintainBridgeInfo' },
        { name: '人行通道信息', url: 'app.maintainPassageInfo', state: 'app.maintainPassageInfo' },
        { name: '养护任务', url: 'app.maintainBridgeOrder', state: 'app.maintainBridgeOrder' },
        { name: '日常巡查', url: 'app.maintainBridgePatrol', state: 'app.maintainBridgePatrol' },
        { name: '上报流程', url: 'app.maintainBridgeDisease', state: 'app.maintainBridgeDisease' },
        { name: '病害统计', url: 'app.maintaindiseaseStatics', state: 'app.maintaindiseaseStatics' },
        {
            name: '工程量统计',
            url: '',
            state: 'app.quality',
            children: [
                { name: '数据统计', url: 'app.quality.dataStatics', state: 'app.quality.dataStatics' },
                { name: '数据分析', url: 'app.quality.dataAnalysis', state: 'app.quality.dataAnalysis' }/*,
                { name: '热力图', url: 'app.quality.Thermogram', state: 'app.quality.Thermogram' }*/
            ]
        },
          { name: '通知公告', url: 'app.maintainNotice', state: 'app.maintainNotice' },
        { name: '备忘录', url: 'app.managePublicMemo', state: 'app.managePublicMemo' }
    ];
    const nav5 = [
        { name: '部门管理', url: 'app.managePublicOffice', state: 'app.managePublicOffice' },
        // {name: '角色管理', url: 'app.managePublicRole', state: 'app.managePublicRole'},
        { name: '账户管理', url: 'app.managePublicAccount', state: 'app.managePublicAccount' },
        // {name: '检测计划', url: 'app.managePublicEcheck', state: 'app.managePublicEcheck'},
        // {name: '养护计划', url: 'app.managePublicMaintain', state: 'app.managePublicMaintain'},
       /* { name: '资料管理', url: 'app.managePublicDataManage', state: 'app.managePublicDataManage' },*/
        { name: '通知公告', url: 'app.managePublicNotice', state: 'app.managePublicNotice' },
        { name: '备忘录', state: 'app.managePublicMemo', url: 'app.managePublicMemo' },
       /* { name: '区域管理', url: 'app.managePublicArea', state: 'app.managePublicArea' },*/
        { name: '字典管理', state: 'app.managePublicDicMag', url: 'app.managePublicDicMag' },
        { name: '构件类型库', state: 'app.managePublicComponents', url: 'app.managePublicComponents' },
        { name: '桥梁结构权重库', state: 'app.managePublicStructWeight', url: 'app.managePublicStructWeight' },
        { name: '病害库', state: 'app.managePublicDiseases', url: 'app.managePublicDiseases' },
        { name: '养护病害库', url: 'app.manageCuringDis' },
        { name: '单价库', url: 'app.manageBridgePrice' },
        { name: '系统日志', state: 'app.managePublicJournal', url: 'app.managePublicJournal' },
    ];
    const nav6 = [
        { name: '方案审核', url: 'app.manageCheckScheme', state: 'app.manageCheckScheme' },
        { name: '病害处理', url: 'app.manageCheckDisease', state: 'app.manageCheckDisease' }
    ];
    const nav7 = [
        {
            name: '养护管理',
            url: '',
            state: 'app.curing',
            children: [
                { name: '养护任务', state: 'app.curing.curingTask', url: 'app.curing.curingTask' },
                { name: '设施管理',state: 'app.curing.manageFacility', url: 'app.curing.manageFacility' },
                { name: '工单下发', state: 'app.curing.orderRelease', url: 'app.curing.orderRelease' },
                { name: '验收确认', state: 'app.curing.acceptanceConfirm', url: 'app.curing.acceptanceConfirm' },
            ]
        },
        {
            name: '竣工结算',
            url: '',
            state: 'app.cost',
            children: [
                { name: '结算资料', state: 'app.cost.costInformation', url: 'app.cost.costInformation' }
            ]
        },
      {
        name: '检测管理',
        url: '',
        state: 'app.check',
        children: [
          { name: '检测任务', state: 'app.check.checkTask', url: 'app.check.checkTask' },
          { name: '检测验收', state: 'app.check.checkConfirm', url: 'app.check.checkConfirm' }
        ]
      }

    ];

    const nav8 = [
        {
            name: '检测管理',
            url: '',
            state: 'app.check',
            children: [
                { name: '检测任务', url: 'app.check.checkTask' },
                { name: '检测验收', url: 'app.check.checkConfirm' }
            ]
        }
    ];
    $scope.$watch('app.globalInfo.nav',function (newValue,oldValue) {
        $scope.navList = eval('nav' + newValue);
    });
    $scope.selectNav = function (li) {
        if (li.url !== '') {
            $scope.app.globalInfo.Bread.grandson = "";
            $scope.app.globalInfo.Bread.child = li.name;
            $state.go(li.url)
        }
    };

    $scope.selectNavChild = function (li, child) {
        $scope.app.globalInfo.Bread.child = li.name;
        $scope.app.globalInfo.Bread.grandson = child.name;
        $state.go(child.url);
    }
}]);
