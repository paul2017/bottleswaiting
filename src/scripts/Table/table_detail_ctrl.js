(function() {
    'use strict'

    angular.module('bwcapp.table').controller('TableDetailCtrl', ['$log', '$scope', '$state', '$ionicPopup', 'table', 'event', 'venue', 'ReservationService', TableDetailCtrl]);

    function TableDetailCtrl($log, $scope, $state, $ionicPopup, table, event, venue, ReservationService) {
        $scope.defaultPhotoUrl = "./images/table-default.jpg";

        function createNewReservation() {
            ReservationService.clearAll();
            $scope.reservation = {
                tableId: table.tableId,
                reservationType: "TABLE",
                eventId: event.eventId,
                guestCount: 0
            }
            ReservationService.setTaxRate(venue.taxPercent);
            ReservationService.setCurrentReservation($scope.reservation);
            $scope.arriveTogether = true;
        }
        if (ReservationService.getCurrentReservation().tableId) {
            if (ReservationService.getCurrentReservation().tableId !== table.tableId ||
                ReservationService.getCurrentReservation().eventId !== event.eventId ||
                ReservationService.getCurrentReservation().reservationType !== "TABLE") {
                var confirmPopup = $ionicPopup.show({
                    title: 'Exising reservation',
                    template: 'There seems to be a pending reservation already that you did not complete, would you like to start a new reservation?',
                    buttons: [{
                        text: 'Complete Existing',
                        onTap: function() {
                            return "existing";
                        }
                    }, {
                        text: 'Start New Reservation',
                        type: 'energized',
                        onTap: function() {
                            return "new";
                        }
                    }]
                });
                confirmPopup.then(function(res) {
                    if (res === "existing") {
                        $state.go('base.tableDetail', {
                            eventId: ReservationService.getCurrentReservation().eventId,
                            tableId: ReservationService.getCurrentReservation().tableId
                        });
                    } else {
                        createNewReservation();
                    }
                });
            } else {
                $scope.reservation = ReservationService.getCurrentReservation();
                $scope.arriveTogether = !ReservationService.getCurrentGuests();
            }
        } else {
            createNewReservation();
        }

        $scope.event = event;
        $scope.table = table;

        $scope.etaTimes = ["10:00 PM", "10:30 PM", "11:00 PM", "11:30 PM", "12:00 AM", "12:30 AM", "01:00 AM", "01:30 AM", "02:00 AM"];
        $scope.$watch('arriveTogether', function(val) {
            if (!val) {
                if ($scope.reservation.guestCount === 0) {
                    $scope.reservation.guestCount = 1;
                }
            }
        });
        $scope.decrement = function() {
            var minGuest = $scope.arriveTogether ? 0 : 1;
            if ($scope.reservation.guestCount > minGuest) {
                $scope.reservation.guestCount--;
            }
        }
        $scope.increment = function() {
            $scope.reservation.guestCount++;
        }
        $scope.next = function() {
            if (!$scope.reservation.eta) {
                $ionicPopup.alert({
                    title: "Select ETA",
                    template: "Please select an ETA, so the club can have your bottles ready, when you arrive"
                });
                return;
            }
            if ($scope.reservation.guestCount === 0 && !$scope.arriveTogether) {
                $ionicPopup.alert({
                    title: "Guests",
                    template: "Please enter how many guests are coming separately."
                });
                return;
            }
            if ($scope.reservation.guestCount + 1 > table.maxGuests) {
                $ionicPopup.alert({
                    title: "Guests",
                    template: "You have entered too many guests for this table"
                });
                return;
            }
            if ($scope.arriveTogether) {
                ReservationService.setCurrentGuests(undefined);
                $state.go('base.preorder', {
                    eventId: event.eventId,
                    tableId: table.tableId
                });
            } else {
                $state.go('base.guestInfo', {
                    guestCount: $scope.reservation.guestCount,
                    eventId: event.eventId,
                    tableId: table.tableId
                });
            }
        }
        $scope.showFullImage = false;
        $scope.toggleFullImage = function() {
            if ($scope.table.photoUrl) {
                $scope.showFullImage = !$scope.showFullImage;
            }
        }
        return this;
    }

})();