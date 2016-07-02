(function() {
    'use strict'

    angular.module('bwcapp.hide_on_enter', ['ui.router', 'ngCordova'])
        .directive('hideOnEnter', ['$log', '$state', '$window', hideOnEnter]);

    function hideOnEnter($log, $state, $window) {
        return {
            restrict: 'AE',
            replace: false,
            link: function(scope, elem) {
                elem.bind("keydown keypress", function(event) {
                    if (event.which === 13 && $window.cordova.plugins) {
                        $window.cordova.plugins.Keyboard.close();
                    }
                });
            }
        }
    }
})();