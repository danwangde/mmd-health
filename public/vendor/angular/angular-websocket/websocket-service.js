'use strict';
var app = angular.module('app', ['ngWebSocket'])
    .factory('websocketService', function ($websocket) {
        // Open a WebSocket connection
        var dataStream = $websocket('ws://127.0.0.1:8080');

        var collection = [];

        dataStream.onMessage(function (message) {
            collection.push(message.data);
        });

        var methods = {
            collection: collection,
            send: function (str) {
                dataStream.send(str);
            },
            getSingleton: function () {
                return dataStream;
            }
        };
        //dataStream.send('123abc');
        return methods;
    });
    // .controller('websocketCtrl', function ($scope, websocketService) {
    //     $scope.MyData = websocketService.getSingleton();
    // });