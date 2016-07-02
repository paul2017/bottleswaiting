(function() {
    'use strict'

    angular.module('bwcapp.no_drag_left', ['ui.router'])
        .directive('noDragLeft', ['$log', '$state', '$ionicGesture', noDragLeft]);

    function noDragLeft($log, $state, $ionicGesture) {
        return {
            restrict: 'A',
            link: function($scope, $element, $attr) {

                $ionicGesture.on('dragleft', function(e) {
                    e.gesture.srcEvent.preventDefault();
                }, $element);
            }
        }
    }
})();