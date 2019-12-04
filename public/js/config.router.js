'use strict';

/**
 * Config for the router
 */
angular.module('app')
    .run(
        ['$rootScope', '$state', '$stateParams', '$location',
            function ($rootScope, $state, $stateParams, $location) {
                $rootScope.$on('$stateChangeStart', function (event, toState) {
                    if (!(sessionStorage.getItem("state"))) {
                        $location.path("/signin")
                    } else {
                        $rootScope.$state = $state;
                        $rootScope.$stateParams = $stateParams;
                    }
                });
                $rootScope.$state = $state;
                $rootScope.$stateParams = $stateParams;
            }

        ]
    )
    .config(
        ['$stateProvider', '$urlRouterProvider',
            function ($stateProvider, $urlRouterProvider) {
                $urlRouterProvider
                    .otherwise('/signin');
                $stateProvider

                    .state('app', {
                        abstract: true,
                        url: '/app',

                        templateUrl: 'tpl/common/app.html',
                        resolve: {
                            deps: ['uiLoad',
                                function (uiLoad) {

                                    return uiLoad.load(['js/controllers/components/appController.js']);
                                }]
                        }
                    })
                    .state('app_full', {
                        abstract: true,
                        url: '/app_full',

                        templateUrl: 'tpl/common/app_full.html'
                    })
                    .state('app_data', {
                        abstract: true,
                        url: '/app_data',
                        templateUrl: 'tpl/common/app_data.html'
                    })
                    .state('ceshi', {
                        url: 'http://47.92.89.74:3000/#/access/signin'
                    })

                    // 登录页面
                    .state('signin', {
                        url: '/signin',

                        templateUrl: 'tpl/common/signin.html',
                        resolve: {
                            deps: ['uiLoad',
                                function (uiLoad) {

                                    return uiLoad.load(['js/controllers/common/signin.js'
                                    ]);
                                }]
                        }
                    })

                    // 登录后首页
                  .state('first', {
                    url: '/first',

                    templateUrl: 'tpl/common/firstPage.html',
                    resolve: {
                      deps: ['uiLoad',
                        function (uiLoad) {

                          return uiLoad.load(['js/controllers/common/firstPage.js'
                          ]);
                        }]
                    }
                  })
                    .state('app_data.bigData', {
                        url: '/bigData',

                        templateUrl: 'tpl/common/bigData.html',
                        resolve: {
                            deps: ['uiLoad',
                                function (uiLoad) {
                                    return uiLoad.load(['js/controllers/common/bigData.js']);
                                }]
                        }
                    })
                    // 管理功能选择页面
                    .state('app_full.manage', {
                        url: '/manage',

                        templateUrl: 'tpl/common/manage.html',
                        resolve: {
                            deps: ['uiLoad',
                                function (uiLoad) {
                                    return uiLoad.load(['js/controllers/common/manage.js']);
                                }]
                        }
                    })
                    // 检测和养护功能选择页面
                    .state('app_full.office', {
                        url: '/office',
                        params:{"itemId":null},
                        templateUrl: 'tpl/common/office.html',
                        resolve: {
                            deps: ['uiLoad',
                                function (uiLoad) {
                                    return uiLoad.load(['js/controllers/common/office.js']);
                                }]
                        }
                    })
                    // 管理 桥梁 首页
                    .state('app.manageBridgeIndex', {
                        url: '/manageBridgeIndex',

                        templateUrl: 'tpl/manage/bridge/index.html',
                        resolve: {
                            deps: ['uiLoad',
                                function (uiLoad) {

                                    return uiLoad.load(['js/controllers/manage/bridge/index.js'
                                    ]);
                                }]
                        }
                    })


                  // 管理 桥梁 检测管理
                  .state('app.manageCheck', {
                    url: '/manageCheck',

                    templateUrl: 'tpl/manage/bridge/index.html',
                    resolve: {
                      deps: ['uiLoad',
                        function (uiLoad) {

                          return uiLoad.load(['js/controllers/office/checkTask.js'
                          ]);
                        }]
                    }
                  })
                    // 管理 桥梁 基本信息
                    .state('app.basic', {
                        url: '/basic',
                        template: '<div ui-view class="fade-in-up"></div>'
                    })
                    .state('app.basic.manageBridgeInfo', {
                        url: '/manageBridgeInfo',

                        templateUrl: 'tpl/manage/bridge/bridge.html',
                        resolve: {
                            deps: ['$ocLazyLoad',
                                function ($ocLazyLoad) {
                                    return $ocLazyLoad.load('angularBootstrapNavTree').then(
                                        function () {
                                            return $ocLazyLoad.load('js/controllers/manage/bridge/bridge.js');
                                        }
                                    );
                                }
                            ]
                        }
                    })
                    .state('app.basic.manageBridgePassageway', {
                        url: '/manageBridgePassageway',
                        templateUrl: 'tpl/manage/bridge/passageway.html',
                        resolve: {
                            deps: ['$ocLazyLoad',
                                function ($ocLazyLoad) {
                                    return $ocLazyLoad.load('angularBootstrapNavTree').then(
                                        function () {
                                            return $ocLazyLoad.load('js/controllers/manage/bridge/passageway.js');
                                        }
                                    );
                                }
                            ]
                        }
                    })
                    // 管理 桥梁 养护管理
                  .state('app.curing', {
                    url: '/curing',
                    template: '<div ui-view class="fade-in-up"></div>'
                  })

                  .state('app.curing.manageFacility', {
                    url: '/manageFacility',

                    templateUrl: 'tpl/office/manageFacility.html',
                    resolve: {
                      deps: ['uiLoad',
                        function (uiLoad) {

                          return uiLoad.load(['js/controllers/office/manageFacility.js'
                          ]);
                        }]
                    }
                  })

                  .state('app.curing.curingTask', {
                    url: '/curingTask',

                    templateUrl: 'tpl/manage/bridge/task.html',
                    resolve: {
                      deps: ['uiLoad',
                        function (uiLoad) {

                          return uiLoad.load(['js/controllers/manage/bridge/task.js'
                          ]);
                        }]
                    }
                  })

                  .state('app.curing.orderRelease', {
                    url: '/orderRelease',

                    templateUrl: 'tpl/office/orderRelease.html',
                    resolve: {
                      deps: ['uiLoad',
                        function (uiLoad) {

                          return uiLoad.load(['js/controllers/office/orderRelease.js'
                          ]);
                        }]
                    }
                  })

                  .state('app.curing.acceptanceConfirm', {
                    url: '/acceptanceConfirm',

                    templateUrl: 'tpl/office/acceptanceConfirm.html',
                    resolve: {
                      deps: ['uiLoad',
                        function (uiLoad) {

                          return uiLoad.load(['js/controllers/office/acceptanceConfirm.js'
                          ]);
                        }]
                    }
                  })

                  // 管理 桥梁 竣工结算
                  .state('app.cost', {
                    url: '/cost',
                    template: '<div ui-view class="fade-in-up"></div>'
                  })

                  .state('app.cost.costInformation', {
                    url: '/costInformation',

                    templateUrl: 'tpl/office/costInformation.html',
                    resolve: {
                      deps: ['uiLoad',
                        function (uiLoad) {

                          return uiLoad.load(['js/controllers/office/costInformation.js'
                          ]);
                        }]
                    }
                  })

                  // 管理 桥梁 检测管理
                  .state('app.check', {
                    url: '/check',
                    template: '<div ui-view class="fade-in-up"></div>'
                  })

                  .state('app.check.checkTask', {
                    url: '/checkTask',

                    templateUrl: 'tpl/office/checkTask.html',
                    resolve: {
                      deps: ['uiLoad',
                        function (uiLoad) {

                          return uiLoad.load(['js/controllers/office/checkTask.js'
                          ]);
                        }]
                    }
                  })

                  .state('app.check.checkConfirm', {
                    url: '/checkConfirm',

                    templateUrl: 'tpl/office/checkConfirm.html',
                    resolve: {
                      deps: ['uiLoad',
                        function (uiLoad) {

                          return uiLoad.load(['js/controllers/office/checkConfirm.js'
                          ]);
                        }]
                    }
                  })

			  // 管理 桥梁 结算管理
                  .state('app.settlement', {
                    url: '/settlement',
                    template: '<div ui-view class="fade-in-up"></div>'
                  })
                  .state('app.settlement.manageStatics', {
                    url: '/manageStatics',
                    templateUrl: 'tpl/manage/bridge/manageStatics.html',
                    resolve: {
                      deps: ['$ocLazyLoad',
                        function ($ocLazyLoad) {
                          return $ocLazyLoad.load('angularBootstrapNavTree').then(
                            function () {
                              return $ocLazyLoad.load('js/controllers/manage/bridge/manageStatics.js');
                            }
                          );
                        }
                      ]
                    }
                  })


                  // 管理 桥梁 统计报表
                     .state('app.staticReport', {
                        url: '/staticReport',
                        template: '<div ui-view class="fade-in-up"></div>'
                    })
                    .state('app.staticReport.basisStatis', {
                        url: '/basisStatis',
                        templateUrl: 'tpl/manage/bridge/statistics.html',
                        resolve: {
                            deps: ['$ocLazyLoad',
                                function ($ocLazyLoad) {
                                    return $ocLazyLoad.load('angularBootstrapNavTree').then(
                                        function () {
                                            return $ocLazyLoad.load('js/controllers/manage/bridge/statistics.js');
                                        }
                                    );
                                }
                            ]
                        }
                    })
                    .state('app.staticReport.curingStatis', {
                        url: '/curingStatis',
                        templateUrl: 'tpl/manage/bridge/curing.html',
                        resolve: {
                            deps: ['$ocLazyLoad',
                                function ($ocLazyLoad) {
                                    return $ocLazyLoad.load('angularBootstrapNavTree').then(
                                        function () {
                                            return $ocLazyLoad.load('js/controllers/manage/bridge/curing.js');
                                        }
                                    );
                                }
                            ]
                        }
                    })
                    .state('app.staticReport.checkStatis', {
                        url: '/checkStatis',
                        templateUrl: 'tpl/manage/bridge/checkDetail.html',
                        resolve: {
                            deps: ['uiLoad',
                                function (uiLoad) {
                                    return uiLoad.load(['js/controllers/manage/bridge/checkDetail.js'
                                    ]);
                                }]
                        }
                    })
				  // 管理 桥梁 巡查管理
                  .state('app.patrolManage', {
                    url: '/patrolManage',
                    template: '<div ui-view class="fade-in-up"></div>'
                  })
                  .state('app.patrolManage.manageBridgePatrol', {
                    url: '/manageBridgePatrol',
                    templateUrl: 'tpl/manage/bridge/patrol.html',
                    resolve: {
                      deps: ['$ocLazyLoad',
                        function ($ocLazyLoad) {
                          return $ocLazyLoad.load('angularBootstrapNavTree').then(
                            function () {
                              return $ocLazyLoad.load('js/controllers/manage/bridge/patrol.js');
                            }
                          );
                        }
                      ]
                    }
                  })
                  .state('app.patrolManage.manageDiseaseQuery', {
                    url: '/manageDiseaseQuery',
                    templateUrl: 'tpl/manage/bridge/manageDiseaseQuery.html',
                    resolve: {
                      deps: ['$ocLazyLoad',
                        function ($ocLazyLoad) {
                          return $ocLazyLoad.load('angularBootstrapNavTree').then(
                            function () {
                              return $ocLazyLoad.load('js/controllers/manage/bridge/manageDiseaseQuery.js');
                            }
                          );
                        }
                      ]
                    }
                  })
                  .state('app.patrolManage.managePatrolAssess', {
                    url: '/managePatrolAssess',
                    templateUrl: 'tpl/manage/bridge/managePatrolAssess.html',
                    resolve: {
                      deps: ['uiLoad',
                        function (uiLoad) {
                          return uiLoad.load(['js/controllers/manage/bridge/managePatrolAssess.js'
                          ]);
                        }]
                    }
                  })
                  .state('app.patrolManage.managePatrolStatics', {
                    url: '/managePatrolStatics',
                    templateUrl: 'tpl/manage/bridge/managePatrolStatics.html',
                    resolve: {
                      deps: ['uiLoad',
                        function (uiLoad) {
                          return uiLoad.load(['js/controllers/manage/bridge/managePatrolStatics.js'
                          ]);
                        }]
                    }
                  })

                    // 管理 桥梁 养护
                    .state('app.maintain', {
                        url: '/maintain',
                        template: '<div ui-view class="fade-in-up"></div>'
                    })

                    .state('app.maintain.manageBridgeTask', {
                        url: '/manageBridgeTask',
                        templateUrl: 'tpl/manage/bridge/task.html',
                        resolve: {
                            deps: ['uiLoad',
                                function (uiLoad) {
                                    return uiLoad.load(['js/controllers/manage/bridge/task.js'
                                    ]);
                                }]
                        }
                    })
                    .state('app.maintain.manageBridgePatrol', {
                        url: '/manageBridgePatrol',
                        templateUrl: 'tpl/manage/bridge/patrol.html',
                        resolve: {
                            deps: ['uiLoad',
                                function (uiLoad) {
                                    return uiLoad.load(['js/controllers/manage/bridge/patrol.js'
                                    ]);
                                }]
                        }
                    })
				.state('app.maintain.curingStatis', {
                        url: '/curingStatis',
                        templateUrl: 'tpl/manage/bridge/curing.html',
                        resolve: {
                            deps: ['uiLoad',
                                function (uiLoad) {
                                    return uiLoad.load(['js/controllers/manage/bridge/curing.js'
                                    ]);
                                }]
                        }
                    })
                    .state('app.maintain.manageBridgeOrder', {
                        url: '/manageBridgeOrder',
                        templateUrl: 'tpl/manage/bridge/order.html',
                        resolve: {
                            deps: ['uiLoad',
                                function (uiLoad) {
                                    return uiLoad.load(['js/controllers/manage/bridge/order.js'
                                    ]);
                                }]
                        }
                    })
                    .state('app.maintain.manageBridgeScheme', {
                        url: '/manageBridgeScheme',
                        templateUrl: 'tpl/manage/bridge/scheme.html',
                        resolve: {
                            deps: ['uiLoad',
                                function (uiLoad) {
                                    return uiLoad.load(['js/controllers/manage/bridge/scheme.js'
                                    ]);
                                }]
                        }
                    })
                    .state('app.maintain.manageBridgeCheck', {
                        url: '/manageBridgeCheck',
                        templateUrl: 'tpl/manage/bridge/check.html',
                        resolve: {
                            deps: ['uiLoad',
                                function (uiLoad) {
                                    return uiLoad.load(['js/controllers/manage/bridge/check.js'
                                    ]);
                                }]
                        }
                    })
                    .state('app.maintain.manageBridgeCost', {
                        url: '/manageBridgeCost',
                        templateUrl: 'tpl/manage/bridge/cost.html',
                        resolve: {
                            deps: ['uiLoad',
                                function (uiLoad) {
                                    return uiLoad.load(['js/controllers/manage/bridge/cost.js'
                                    ]);
                                }]
                        }
                    })
                    // 管理 桥梁 检测
                    .state('app.echeck', {
                        url: '/echeck',
                        template: '<div ui-view class="fade-in-up"></div>'
                    })
                    .state('app.echeck.manageBridgePlan', {
                        url: '/manageBridgePlan',
                        templateUrl: 'tpl/manage/bridge/planParent.html',
                        resolve: {
                            deps: ['uiLoad',
                                function (uiLoad) {
                                    return uiLoad.load(['js/controllers/manage/bridge/planParent.js'
                                    ]);
                                }]
                        }
                    })
                    .state('app.echeck.manageBridgeRegular', {
                        url: '/manageBridgeRegular',
                        templateUrl: 'tpl/manage/bridge/regular.html',
                        resolve: {
                            deps: ['uiLoad',
                                function (uiLoad) {
                                    return uiLoad.load(['js/controllers/manage/bridge/regular.js'
                                    ]);
                                }]
                        }
                    })
                    .state('app.echeck.manageBridgeStructural', {
                        url: '/manageBridgeStructural',
                        templateUrl: 'tpl/manage/bridge/structural.html',
                        resolve: {
                            deps: ['uiLoad',
                                function (uiLoad) {
                                    return uiLoad.load(['js/controllers/manage/bridge/structural.js'
                                    ]);
                                }]
                        }
                    })
                    .state('app.echeck.manageBridgeLoadtest', {
                        url: '/manageBridgeLoadtest',
                        templateUrl: 'tpl/manage/bridge/loadtest.html',
                        resolve: {
                            deps: ['uiLoad',
                                function (uiLoad) {
                                    return uiLoad.load(['js/controllers/manage/bridge/loadtest.js'
                                    ]);
                                }]
                        }
                    })
                    // 管理 桥梁 技术评估
                    .state('app.assessment', {
                        url: '/assessment',
                        template: '<div ui-view class="fade-in-up"></div>'
                    })
                    .state('app.assessment.bridgeAssessment', {
                        url: '/bridgeAssessment',
                        templateUrl: 'tpl/manage/bridge/bridgeAssessment.html',
                        resolve: {
                            deps: ['uiLoad',
                                function (uiLoad) {
                                    return uiLoad.load(['js/controllers/manage/bridge/bridgeAssessment.js'])
                                }]
                        }
                    })
                    .state('app.assessment.passageAssessment', {
                        url: '/passageAssessment',
                        templateUrl: 'tpl/manage/bridge/passageAssessment.html',
                        resolve: {
                            deps: ['uiLoad',
                                function (uiLoad) {
                                    return uiLoad.load(['js/controllers/manage/bridge/passageAssessment.js'])
                                }]
                        }
                    })

                    // 桥梁 GIS地图
                    .state('app.manageBridgeMap', {
                        url: '/manageBridgeMap',
                        templateUrl: 'tpl/manage/bridge/GISMap.html',
                        resolve: {
                            deps: ['uiLoad',
                                function (uiLoad) {
                                    return uiLoad.load(['js/controllers/manage/bridge/GISMap.js'])
                                }]
                        }
                    })
                    //管理 桥梁 病害库
                    .state('app.manageBridgeDisBank', {
                        url: 'manegeBridgeDisease',
                        templateUrl: 'tpl/manage/bridge/disBank.html',
                        resolve: {
                            deps: 'uiLoad',
                            function (uiLoad) {
                                return uiLoad.load(['js/controllers/manage/bridge/disBank.js'])
                            }
                        }
                    })

                    //管理 桥梁 单价库
                    .state('app.manageBridgePrice', {
                        url: '/manageBridgePrice',
                        templateUrl: 'tpl/manage/bridge/componentPrice.html',
                        resolve: {
                            deps: 'uiLoad',
                            function (uiLoad) {
                                return uiLoad.load(['js/controllers/manage/bridge/componentPrice.js'])
                            }
                        }
                    })

                    //管理 桥梁 数据导出
                    .state('app.manageDataOut', {
                        url: 'manageDataOut',
                        templateUrl: 'tpl/manage/bridge/dataOut.html',
                        resolve: {
                            deps: 'uiLoad',
                            function (uiLoad) {
                                return uiLoad.load(['js/controllers/manage/bridge/dataOut.js'])
                            }
                        }
                    })
                    // 管理 公共 部门管理
                    .state('app.managePublicOffice', {
                        url: '/managePublicOffice',
                        templateUrl: 'tpl/manage/pubcoms/office.html',
                        resolve: {
                            deps: ['uiLoad',
                                function (uiLoad) {
                                    return uiLoad.load(['js/controllers/manage/pubcoms/office.js'
                                    ]);
                                }]
                        }
                    })
                    // 管理 公共 角色管理
                    .state('app.managePublicRole', {
                        url: '/managePublicRole',
                        templateUrl: 'tpl/manage/pubcoms/role.html',
                        resolve: {
                            deps: ['uiLoad',
                                function (uiLoad) {
                                    return uiLoad.load(['js/controllers/manage/pubcoms/role.js'
                                    ]);
                                }]
                        }
                    })
                    // 管理 公共 账号管理
                    .state('app.managePublicAccount', {
                        url: '/managePublicAccount',
                        templateUrl: 'tpl/manage/pubcoms/account.html',
                        resolve: {
                            deps: ['$ocLazyLoad',
                                function ($ocLazyLoad) {
                                    return $ocLazyLoad.load('angularBootstrapNavTree').then(
                                        function () {
                                            return $ocLazyLoad.load('js/controllers/manage/pubcoms/account.js');
                                        }
                                    );
                                }
                            ]
                        }
                    })
                    // 管理 公共 检测计划
                    .state('app.managePublicEcheck', {
                        url: '/managePublicEcheck',
                        templateUrl: 'tpl/manage/pubcoms/echeck.html',
                        resolve: {
                            deps: ['uiLoad',
                                function (uiLoad) {
                                    return uiLoad.load(['js/controllers/manage/pubcoms/echeck.js']);
                                }
                            ]
                        }
                    })
                    // 管理 公共 养护计划
                    .state('app.managePublicMaintain', {
                        url: '/managePublicMaintain',
                        templateUrl: 'tpl/manage/pubcoms/maintain.html',
                        resolve: {
                            deps: ['uiLoad',
                                function (uiLoad) {
                                    return uiLoad.load(['js/controllers/manage/pubcoms/maintain.js']);
                                }
                            ]
                        }
                    })
                    // 管理 公共 通知公告
                    .state('app.managePublicNotice', {
                        url: '/managePublicNotice',
                        templateUrl: 'tpl/manage/pubcoms/notice.html',
                        resolve: {
                            deps: ['uiLoad',
                                function (uiLoad) {

                                    return uiLoad.load(['js/controllers/manage/pubcoms/notice.js']);
                                }
                            ]
                        }
                    })
                    // 管理 公共 资料管理
                    .state('app.managePublicDataManage', {
                        url: '/managePublicDataManage',
                        templateUrl: 'tpl/manage/pubcoms/dataManage.html',
                        resolve: {
                            deps: ['uiLoad',
                                function (uiLoad) {

                                    return uiLoad.load(['js/controllers/manage/pubcoms/dataManage.js']);
                                }
                            ]
                        }
                    })
                    // 管理 公共 字典管理
                    .state('app.managePublicDicMag', {
                        url: '/managePublicDicMag',

                        templateUrl: 'tpl/manage/pubcoms/dicMag.html',
                        resolve: {
                            deps: ['uiLoad',
                                function (uiLoad) {

                                    return uiLoad.load(['js/controllers/manage/pubcoms/dicMag.js']);
                                }
                            ]
                        }
                    })
                    // 管理 公共 系统日志
                    .state('app.managePublicJournal', {
                        url: '/managePublicJournal',

                        templateUrl: 'tpl/manage/pubcoms/journal.html',
                        resolve: {
                            deps: ['uiLoad',
                                function (uiLoad) {
                                    return uiLoad.load(['js/controllers/manage/pubcoms/journal.js']);
                                }
                            ]
                        }
                    })
                    // 管理 公共 备忘录
                    .state('app.managePublicMemo', {
                        url: '/managePublicMemo',
                        templateUrl: 'tpl/manage/pubcoms/memo.html',
                        resolve: {
                            deps: ['uiLoad',
                                function (uiLoad) {
                                    return uiLoad.load(['js/controllers/manage/pubcoms/memo.js']);
                                }
                            ]
                        }
                    })


                    // 管理 公共 病害库
                    .state('app.managePublicDiseases', {
                        url: '/managePublicDiseases',

                        templateUrl: 'tpl/manage/pubcoms/diseases.html',
                        resolve: {
                            deps: ['uiLoad',
                                function (uiLoad) {

                                    return uiLoad.load(['js/controllers/manage/pubcoms/diseases.js']);
                                }
                            ]
                        }
                    })

                    // 管理 公共 养护病害库
                    .state('app.manageCuringDis', {
                        url: '/manageCuringDis',

                        templateUrl: 'tpl/manage/pubcoms/curingDis.html',
                        resolve: {
                            deps: ['uiLoad',
                                function (uiLoad) {

                                    return uiLoad.load(['js/controllers/manage/pubcoms/curingDis.js']);
                                }
                            ]
                        }
                    })


                    // 管理 公共 构件库
                    .state('app.managePublicComponents', {
                        url: '/managePublicComponents',

                        templateUrl: 'tpl/manage/pubcoms/components.html',
                        resolve: {
                            deps: ['uiLoad',
                                function (uiLoad) {

                                    return uiLoad.load(['js/controllers/manage/pubcoms/components.js']);
                                }
                            ]
                        }
                    })


                    // 管理 公共 权重
                    .state('app.managePublicStructWeight', {
                        url: '/managePublicStructWeight',

                        templateUrl: 'tpl/manage/pubcoms/weight.html',
                        resolve: {
                            deps: ['uiLoad',
                                function (uiLoad) {

                                    return uiLoad.load(['js/controllers/manage/pubcoms/weight.js']);
                                }
                            ]
                        }
                    })

                    // 管理 公共 区域管理
                    .state('app.managePublicArea', {
                        url: '/managePublicArea',
                        templateUrl: 'tpl/manage/pubcoms/area.html',
                        resolve: {
                            deps: ['uiLoad',
                                function (uiLoad) {
                                    return uiLoad.load(['js/controllers/manage/pubcoms/area.js'
                                    ]);
                                }]
                        }
                    })
                    // 管理 审核 方案审核
                    .state('app.manageCheckScheme', {
                        url: '/manageCheckScheme',
                        templateUrl: 'tpl/manage/check/scheme.html',
                        resolve: {
                            deps: ['uiLoad',
                                function (uiLoad) {
                                    return uiLoad.load(['js/controllers/manage/check/scheme.js'
                                    ]);
                                }]
                        }
                    })
                    // 管理 审核 病害处理
                    .state('app.manageCheckDisease', {
                        url: '/manageCheckDisease',
                        templateUrl: 'tpl/manage/check/disease.html',
                        resolve: {
                            deps: ['uiLoad',
                                function (uiLoad) {
                                    return uiLoad.load(['js/controllers/manage/check/disease.js'
                                    ]);
                                }]
                        }
                    })
                    // 检测 桥梁 待办
                    .state('app.echeckBridgeBacklog', {
                        url: '/echeckBridgeBacklog',

                        templateUrl: 'tpl/echeck/ewaitTask.html',
                        resolve: {
                            deps: ['uiLoad',
                                function (uiLoad) {

                                    return uiLoad.load(['js/controllers/echeck/ewaitTask.js'
                                    ]);
                                }]
                        }
                    })

                    // 检测 桥梁 桥梁信息
                    .state('app.echeckBridgeInfo', {
                        url: '/echeckBridgeInfo',
                        templateUrl: 'tpl/manage/bridge/bridge.html',
                        resolve: {
                            deps: ['$ocLazyLoad',
                                function ($ocLazyLoad) {
                                    return $ocLazyLoad.load('angularBootstrapNavTree').then(
                                        function () {
                                            return $ocLazyLoad.load('js/controllers/manage/bridge/bridge.js');
                                        }
                                    );
                                }
                            ]
                        }
                    })

                    // 检测 桥梁 人行通道信息
                    .state('app.echeckPassageInfo', {
                        url: '/echeckPassageInfo',
                        templateUrl: 'tpl/manage/bridge/passageway.html',
                        resolve: {
                            deps: ['$ocLazyLoad',
                                function ($ocLazyLoad) {
                                    return $ocLazyLoad.load('angularBootstrapNavTree').then(
                                        function () {
                                            return $ocLazyLoad.load('js/controllers/manage/bridge/passageway.js');
                                        }
                                    );
                                }
                            ]
                        }
                    })


                    // 检测 桥梁 结构性能检测
                    .state('app.echeckPlanStructural', {
                        url: '/echeckPlanStructural',

                        templateUrl: 'tpl/echeck/plan.html',
                        resolve: {
                            deps: ['uiLoad',
                                function (uiLoad) {
                                    return uiLoad.load(['js/controllers/echeck/plan.js'
                                    ]);
                                }]
                        }
                    })
                    // 管理 桥梁 桥梁检测
                  .state('app.bridgeCheck', {
                    url: '/bridgeCheck',
                    template: '<div ui-view class="fade-in-up"></div>'
                  })

                  // 检测 桥梁 常规检测
                  .state('app.bridgeCheck.echeckBridgeRegular', {
                    url: '/echeckBridgeRegular',
                    templateUrl: 'tpl/echeck/regular.html',
                    resolve: {
                      deps: ['uiLoad',
                        function (uiLoad) {
                          return uiLoad.load(['js/controllers/echeck/regular.js'
                          ]);
                        }]
                    }
                  })

                    // 检测 桥梁 荷载试验
                    .state('app.bridgeCheck.echeckBridgeLoadTest', {
                        url: '/echeckBridgeLoadTest',
                        templateUrl: 'tpl/echeck/loadtest.html',
                        resolve: {
                            deps: ['uiLoad',
                                function (uiLoad) {
                                    return uiLoad.load(['js/controllers/echeck/loadtest.js'
                                    ]);
                                }]
                        }
                    })
                    // 检测 桥梁 检测统计
                  .state('app.echeckStatics', {
                    url: '/echeckStatics',
                    templateUrl: 'tpl/echeck/echeckStatics.html',
                    resolve: {
                      deps: ['uiLoad',
                        function (uiLoad) {
                          return uiLoad.load(['js/controllers/echeck/echeckStatics.js'
                          ]);
                        }]
                    }
                  })

                    // 检测 桥梁 GIS地图
                    .state('app.echeckBridgeMap', {
                        url: '/echeckBridgeMap',
                        templateUrl: 'tpl/manage/bridge/GISMap.html',
                        resolve: {
                            deps: ['uiLoad',
                                function (uiLoad) {
                                    return uiLoad.load(['js/controllers/manage/bridge/GISMap.js'])
                                }]
                        }
                    })
                    // 检测 桥梁 通知公告
                    .state('app.echeckNotice', {
                        url: '/echeckNotice',
                        templateUrl: 'tpl/manage/pubcoms/notice.html',
                        resolve: {
                            deps: ['uiLoad',
                                function (uiLoad) {
                                    return uiLoad.load(['js/controllers/manage/pubcoms/notice.js']);
                                }
                            ]
                        }
                    })
                    // 检测 桥梁 备忘录
                    .state('app.echeckMemo', {
                        url: '/echeckMemo',
                        templateUrl: 'tpl/manage/pubcoms/memo.html',
                        resolve: {
                            deps: ['uiLoad',
                                function (uiLoad) {
                                    return uiLoad.load(['js/controllers/manage/pubcoms/memo.js']);
                                }
                            ]
                        }
                    })
                    // 养护 桥梁 待办
                    .state('app.maintainBridgeBacklog', {
                        url: '/maintainBridgeBacklog',

                        templateUrl: 'tpl/maintain/mwaitTask.html',
                        resolve: {
                            deps: ['uiLoad',
                                function (uiLoad) {

                                    return uiLoad.load(['js/controllers/maintain/mwaitTask.js'
                                    ]);
                                }]
                        }
                    })
                    // 养护 桥梁 桥梁信息
                    .state('app.maintainBridgeInfo', {
                        url: '/maintainBridgeInfo',
                        templateUrl: 'tpl/manage/bridge/bridge.html',
                        resolve: {
                            deps: ['$ocLazyLoad',
                                function ($ocLazyLoad) {
                                    return $ocLazyLoad.load('angularBootstrapNavTree').then(
                                        function () {
                                            return $ocLazyLoad.load('js/controllers/manage/bridge/bridge.js');
                                        }
                                    );
                                }
                            ]
                        }
                    })
                    // 养护 桥梁 人行通道信息
                    .state('app.maintainPassageInfo', {
                        url: '/maintainPassageInfo',
                        templateUrl: 'tpl/manage/bridge/passageway.html',
                        resolve: {
                            deps: ['$ocLazyLoad',
                                function ($ocLazyLoad) {
                                    return $ocLazyLoad.load('angularBootstrapNavTree').then(
                                        function () {
                                            return $ocLazyLoad.load('js/controllers/manage/bridge/passageway.js');
                                        }
                                    );
                                }
                            ]
                        }
                    })
                    // 养护 桥梁 GIS地图
                    .state('app.maintainBridgeMap', {
                        url: '/maintainBridgeMap',
                        templateUrl: 'tpl/manage/bridge/GISMap.html',
                        resolve: {
                            deps: ['uiLoad',
                                function (uiLoad) {
                                    return uiLoad.load(['js/controllers/manage/bridge/GISMap.js'])
                                }]
                        }
                    })
                    // 养护 桥梁 通知公告
                    .state('app.maintainNotice', {
                        url: '/maintainNotice',
                        templateUrl: 'tpl/manage/pubcoms/notice.html',
                        resolve: {
                            deps: ['uiLoad',
                                function (uiLoad) {

                                    return uiLoad.load(['js/controllers/manage/pubcoms/notice.js']);
                                }
                            ]
                        }
                    })
                    // 养护 桥梁 备忘录
                    .state('app.maintainMemo', {
                        url: '/maintainMemo',
                        templateUrl: 'tpl/manage/pubcoms/memo.html',
                        resolve: {
                            deps: ['uiLoad',
                                function (uiLoad) {
                                    return uiLoad.load(['js/controllers/manage/pubcoms/memo.js']);
                                }
                            ]
                        }
                    })
                    // 养护 桥梁 日常巡查
                    .state('app.maintainBridgePatrol', {
                        url: '/maintainBridgePatrol',
                        templateUrl: 'tpl/maintain/patrol.html',
                        resolve: {
                            deps: ['uiLoad',
                                function (uiLoad) {
                                    return uiLoad.load(['js/controllers/maintain/patrol.js'
                                    ]);
                                }]
                        }
                    })
                    // 养护 桥梁 病害上报
                    .state('app.maintainBridgeDisease', {
                        url: '/maintainBridgeDisease',

                        templateUrl: 'tpl/maintain/disease.html',
                        resolve: {
                            deps: ['uiLoad',
                                function (uiLoad) {
                                    return uiLoad.load(['js/controllers/maintain/disease.js'
                                    ]);
                                }]
                        }
                    })
                    // 养护 桥梁 任务
                    .state('app.maintainBridgeOrder', {
                        url: '/maintainBridgeOrder',
                        templateUrl: 'tpl/maintain/task.html',
                        resolve: {
                            deps: ['uiLoad',
                                function (uiLoad) {
                                    return uiLoad.load(['js/controllers/maintain/task.js'
                                    ]);
                                }]
                        }
                    })
                     // 养护 桥梁 病害统计
                     .state('app.maintaindiseaseStatics', {
                        url: '/maintaindiseaseStatics',
                        templateUrl: 'tpl/maintain/maintaindiseaseStatics.html',
                        resolve: {
                            deps: ['uiLoad',
                                function (uiLoad) {
                                    return uiLoad.load(['js/controllers/maintain/maintaindiseaseStatics.js'
                                    ]);
                                }]
                        }
                    })
                     // 养护 工程量统计
                     .state('app.quality', {
                        url: '/quality',
                        template: '<div ui-view class="fade-in-up"></div>'
                    })
                    //养护 工程量统计 数据统计
                    .state('app.quality.dataStatics', {
                        url: '/dataStatics',
                        templateUrl: 'tpl/maintain/dataStatics.html',
                        resolve: {
                            deps: ['uiLoad',
                                function (uiLoad) {
                                    return uiLoad.load(['js/controllers/maintain/dataStatics.js'
                                    ]);
                                }]
                        }
                    })
                     //养护 工程量统计 数据分析
                     .state('app.quality.dataAnalysis', {
                        url: '/dataAnalysis',
                        templateUrl: 'tpl/maintain/dataAnalysis.html',
                        resolve: {
                            deps: ['uiLoad',
                                function (uiLoad) {
                                    return uiLoad.load(['js/controllers/maintain/dataAnalysis.js'
                                    ]);
                                }]
                        }
                    })
                     //养护 工程量统计 热力图
                     .state('app.quality.Thermogram', {
                        url: '/Thermogram',
                        templateUrl: 'tpl/maintain/Thermogram.html',
                        resolve: {
                            deps: ['uiLoad',
                                function (uiLoad) {
                                    return uiLoad.load(['js/controllers/maintain/Thermogram.js'
                                    ]);
                                }]
                        }
                    })
                    // 养护 桥梁 养护方案
                    .state('app.maintainBridgeScheme', {
                        url: '/maintainBridgeScheme',
                        templateUrl: 'tpl/maintain/scheme.html',
                        resolve: {
                            deps: ['uiLoad',
                                function (uiLoad) {
                                    return uiLoad.load(['js/controllers/maintain/scheme.js'
                                    ]);
                                }]
                        }
                    })
                    // 养护 桥梁 竣工申请
                    .state('app.maintainBridgeCheck', {
                        url: '/maintainBridgeCheck',
                        templateUrl: 'tpl/maintain/check.html',
                        resolve: {
                            deps: ['uiLoad',
                                function (uiLoad) {
                                    return uiLoad.load(['js/controllers/maintain/check.js'
                                    ]);
                                }]
                        }
                    })
                    .state('app.404', {
                        url: '/404',
                        templateUrl: 'tpl/common/404.html'
                    });

            }
        ]
    );
