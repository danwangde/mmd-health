'use strict';
app.controller('ModalInstanceCtrl', ['$scope', '$modalInstance', 'items', '$compile', function ($scope, $modalInstance, items, $compile) {
    var html, template, mobileDialogElement;
    $scope.bigImg = function (num) {
        if (num == 1) {
            html = "<img src='../img/4.jpg' style='max-width:80%;margin-left:50%;margin-top:50px;transform: translate(-50%, -0%);' >";
        } else if (num == 2) {
            html = "<img src='../img/signinbg1.jpg' style='max-width:80%;margin-left:50%;margin-top:50px;transform: translate(-50%, -0%);' >";
        }
        template = angular.element(html);
        mobileDialogElement = $compile(template)($scope);

        angular.element("#bigImg").append(mobileDialogElement);
    };
    $scope.clickImg = function () {

        if (mobileDialogElement) {
            mobileDialogElement.remove();
        }
    };
    $scope.lookVideo=function(){
        html = "<video style='max-width:80%;max-height:800px;margin-left:50%;margin-top:50px;transform: translate(-50%, -0%);' controls><source src='../img/ceshi.mp4' type='video/mp4'></source></video>";
        template = angular.element(html);
        mobileDialogElement = $compile(template)($scope);

        angular.element("#bigImg").append(mobileDialogElement);
    };
    let treedata_avm = [{
        bridgeId: 1,
        label: '胜利路桥',
        children: [
            {
                lineId: 1,
                label: '高速方向',
                children: [
                    {
                        typeId: 1,
                        label: '上部结构',
                        children: [
                            {spanId: 1, label: '第一跨'},
                            {spanId: 2, label: '第二跨'},
                            {spanId: 3, label: '第三跨'}
                        ]
                    },
                    {
                        typeId: 2,
                        label: '下部结构',
                        children: [
                            {abutmentId: 1, label: '桥台1'},
                            {abutmentId: 2, label: '桥台2'},
                            {abutmentId: 3, label: '桥墩1'}
                        ]
                    },
                    {
                        typeId: 3,
                        label: '桥面系'

                    },
                    {
                        typeId: 4,
                        label: '附属设施'

                    },
                    {
                        typeId: 5,
                        label: '抗震设施'

                    }
                ]
            }
        ]

    }];
    $scope.my_data = treedata_avm;
    $scope.loadHtml = 'tpl/modal/echeckBridgeDetail.html';
    $scope.my_tree_handler = function (branch) {

        if (branch.level == 1) {
            $scope.loadHtml = 'tpl/modal/echeckBridgeDetail.html';
        } else if (branch.level == 2) {
            $scope.loadHtml = 'tpl/modal/bridgeLine.html';
        }
        else if (branch.level == 4 && branch.spanId) {
            $scope.loadHtml = 'tpl/modal/bridgeSpan.html';
        }
        else if (branch.level == 4 && branch.abutmentId) {
            $scope.loadHtml = 'tpl/modal/bridgePier.html';
        }

    };



}]);

app.controller('echeckBridgeInfo_controller', ['$scope', '$http', '$modal', '$log', '$compile', function ($scope, $http, $modal, $log, $compile) {

    $scope.bridgeInfo = [{
        BridgeID: '1',
        BridgeNum: 'HT005',
        BridgeName: '胜利路桥',
        BridgeType: '梁桥',
        MainLength: '1000',
        CuringGrade: 'I等',
        ManageUnit: '桓台县住房和城乡建设局'
    },
        {
            BridgeID: '2',
            BridgeNum: 'HT004',
            BridgeName: '八一路桥',
            BridgeType: '圬工拱桥（无拱上构造）',
            MainLength: '200',
            CuringGrade: 'II等',
            ManageUnit: '淄博市城乡建设委员会'
        },
        {
            BridgeID: '2',
            BridgeNum: 'HT004',
            BridgeName: '八一路桥',
            BridgeType: '圬工拱桥（无拱上构造）',
            MainLength: '200',
            CuringGrade: 'II等',
            ManageUnit: '淄博市城乡建设委员会'
        }];

    // $scope.bridgeDetail=
    $scope.delBridge = function (index) {
        console.log(index)
    }
    $scope.clickBridge = function (index) {
        var modalInstance = $modal.open({
            templateUrl: 'myModalContent.html',
            controller: 'ModalInstanceCtrl',
            size: 'lg',
            backdrop: 'static',      
	        keyboard: false,
            resolve: {
                items: function () {
                    return $scope.items;
                }

            }
        });

        modalInstance.result.then(function (selectedItem) {
            $scope.selected = selectedItem;
        }, function () {
            $log.info('Modal dismissed at: ' + new Date());
        });
    };


}])