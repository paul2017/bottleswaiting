(function() {
    'use strict'

    angular.module('bwcapp.events').controller('EventDetailCtrl', ['$log', '$scope', '$state', '$ionicPopup', 'event', 'venue', EventDetailCtrl]);

    function EventDetailCtrl($log, $scope, $state, $ionicPopup, event, venue) {
        $scope.defaultEventImageUrl = "./images/event-default.jpg";
        $scope.defaultDjImageUrl = "./images/dj-default.png";
        $scope.event = event;
        $scope.venue = venue
        var toUTCDate = function(date) {
            var utc = new Date(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate());
            return utc;
        };
        var eventDate = new Date(event.eventDate);
        var eventDateInUTC = toUTCDate(eventDate);
        $scope.event.eventDate = eventDateInUTC;
        $scope.showFullImage = false;
        $scope.toggleFullImage = function() {
            if ($scope.event.photoUrl) {
                $scope.showFullImage = !$scope.showFullImage;
            }
        }
        return this;
    }
})();