(function() {
    'use strict'

    angular.module('bwcapp.events').directive('eventListPanel', ['$log', '$state', eventListPanel]);

    function eventListPanel($log, $state) {
        return {
            restrict: 'AE',
            scope: {
                events: '='
            },
            replace: true,
            templateUrl: 'views/events/event_list_panel.html',
            link: function(scope, elem) {
                scope.goToEvent = function(eventId) {
                    $state.go('base.eventDetail', {
                        eventId: eventId
                    });
                };
                scope.capFirst = function(str) {
                    if (str === 'EDM') {
                        return str;
                    } else {
                        return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
                    }
                }
            }
        }
    }
})();