(function() {
    'use strict'

    angular.module('bwcapp.table').controller('SplitPaymentCtrl', ['$log', '$scope', '$state', '$ionicPopup', '$filter',
        'ReservationService', 'UserService', 'ContactsService', SplitPaymentCtrl
    ]);

    function SplitPaymentCtrl($log, $scope, $state, $ionicPopup, $filter, ReservationService, UserService, ContactsService) {

        $scope.splitters = ReservationService.getCurrentSplitters();

        function pickContactFromPhone($index) {
            ContactsService.pickContact().then(function(response) {
                if (response.phones.length < 1) {
                    $ionicPopup.alert({
                        title: "Cannot use contact",
                        template: "The contact you selected has no phone number attached"
                    });
                    return;
                } else if (response.phones.length > 1) {
                    //pop up to pick a number
                }
                //use first number for now
                var phone = response.phones[0].value.replace(/\D/g, '');
                var splitPayer = {
                    name: response.displayName,
                    phoneNumber: parseInt(phone)
                };
                $scope.splitters[$index] = splitPayer;

            });
        }
        $scope.pickContact = function($index) {
            if ($scope.splitters[$index].phoneNumber || $scope.splitters[$index].name) {
                var confirmPopup = $ionicPopup.confirm({
                    title: "Existing Entry",
                    template: "Looks like you have entered something for this splitter. <br> Do you want to overwrite by picking from contacts?"
                });
                confirmPopup.then(function(res) {
                    if (res) {
                        pickContactFromPhone($index);
                    }
                });
            } else {
                pickContactFromPhone($index);
            }

        }
        $scope.addSplitter = function() {
            $scope.splitters.push({});
        };
        $scope.removeSplitter = function(splitter) {
            $scope.splitters.splice($scope.splitters.indexOf(splitter), 1);
        };
        $scope.confirm = function() {
            UserService.getCurrentUser().then(function(response) {
                ReservationService
                    .createSplitters(angular.copy($scope.splitters), response, angular.copy($scope.payRemaining));
            });
            $state.go('base.creditCard');
        };
        angular.forEach($scope.splitters, function(splitter) {
            if (splitter.primary) {
                $scope.removeSplitter(splitter);
            }
        });
        return this;
    };
})();