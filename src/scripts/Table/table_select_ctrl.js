(function() {
    'use strict'

    angular.module('bwcapp.table').controller('TableSelectCtrl', ['$log', '$scope', '$state', '$ionicPopup', 'event', 'layout', 'tables', TableSelectCtrl]);

    function TableSelectCtrl($log, $scope, $state, $ionicPopup, event, layout, tables) {
        $scope.layout = layout;
        $scope.tables = tables;
        $scope.event = event;
        var elem = angular.element(document.getElementById('layout-scroll'));
        var image = angular.element(elem.find('img')[0]);
        image.bind("load", function(e) {
            $scope.imageLoaded = true;
            $scope.$apply();
        });
        $scope.getIcon = function(table) {
            if (table.celebrity) {
                return 'images/orangeicon.svg';
            } else if (table.reserved) {
                return 'images/redicon.svg';
            } else {
                return 'images/blueicon.svg';
            }
        };
        $scope.selectTable = function(table) {
            if (table.celebrity) {
                $ionicPopup.alert({
                    title: "Celebrity Reserved",
                    template: table.celebrityName
                });
                return;
            } else if (table.reserved) {
                $ionicPopup.alert({
                    title: "Table Reserved",
                    template: "Table is reserved, please select an available table"
                });
                return;
            }
            $state.go('base.tableDetail', {
                eventId: event.eventId,
                tableId: table.tableId
            });
        };
        $scope.tagStyle = function(table) {
            if (table && $scope.imageLoaded) {
                var image = elem.find('img')[0];

                var imageLeft = parseInt(window.getComputedStyle(image, null).getPropertyValue('padding-left'));
                var imageTop = parseInt(window.getComputedStyle(image, null).getPropertyValue('padding-top'));
                var parent = image.parentElement;
                var parentLeft = parseInt(window.getComputedStyle(parent, null).getPropertyValue('padding-left'));
                var parentTop = parseInt(window.getComputedStyle(parent, null).getPropertyValue('padding-top'));

                var radius = table.radius;
                var imgWidth = image.naturalWidth;
                //temp fix 703px is size of image on consumer website. this is to make it look consistent. 
                //need to change this on the back end to store as a percentage of image size
                var iconRadius = radius / 703 * image.width;
                var left = image.width * table.x + imageLeft + parentLeft - iconRadius;
                var top = image.height * table.y + imageTop + parentTop - iconRadius;


                return {
                    'top': top + "px",
                    'left': left + "px",
                    'display': 'block',
                    'width': iconRadius * 2 + 'px',
                    'position': 'absolute',
                    'z-index': '5'
                };
            } else {
                return {
                    'display': 'none'
                };
            }
        };
        return this;
    }

})();