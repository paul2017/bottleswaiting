(function() {
    'use strict'

    angular.module('bwcapp.table').controller('GuestInfoCtrl', ['$log', '$scope', '$state', '$stateParams', '$ionicPopup', 'guests', 'ReservationService', GuestInfoCtrl]);

    function GuestInfoCtrl($log, $scope, $state, $stateParams, $ionicPopup, guests, ReservationService) {
        if (guests && $stateParams.guestCount <= guests.length) {
            $scope.guests = guests;
            $scope.guests.slice(0, $stateParams.guestCount);
        } else {
            $scope.guests = [];
        }
        $scope.guests.length = $stateParams.guestCount;
        for (var i = 0; i < $scope.guests.length; i++) {
            if (!$scope.guests[i]) {
                $scope.guests[i] = {};
            }
            if ($scope.guests[i].firstName && $scope.guests[i].lastName) {
                $scope.guests[i].name = $scope.guests[i].firstName + " " + $scope.guests[i].lastName;
            }
            $scope.guests[i].label = "Guest " + (i + 1);
        };
        $scope.genders = [{
            'name': 'Male',
            'short': 'M'
        }, {
            'name': 'Female',
            'short': 'F'
        }];
        $scope.getName = function($index, name) {
            return $index + '-' + name;
        }
        $scope.next = function() {
            if ($scope.$$childHead.guestForm.$invalid) {
                if ($scope.$$childHead.guestForm.$error.required) {
                    $ionicPopup.alert({
                        title: "Invalid Entries",
                        template: "All fields are required"
                    });
                    return;
                }
                if ($scope.$$childHead.guestForm.$error.validator) {
                    $ionicPopup.alert({
                        title: "Invalid Entries",
                        template: "Please Enter both first and last name"
                    });
                    return;
                }

            }
            var guests = angular.copy($scope.guests);
            angular.forEach(guests, function(guest) {
                var split = guest.name.split(' ');
                guest.firstName = split[0];
                guest.lastName = split[split.length - 1];
                delete guest.name;
                delete guest.label;
            });
            ReservationService.setCurrentGuests(guests);
            $state.go('base.preorder', {
                eventId: $stateParams.eventId,
                tableId: $stateParams.tableId
            });
        };
        return this;
    }

})();