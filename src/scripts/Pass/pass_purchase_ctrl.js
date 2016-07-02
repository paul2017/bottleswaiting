(function() {
    'use strict'

    angular.module('bwcapp.pass').controller('PassPurchaseCtrl', ['$log', '$scope', '$state', '$ionicPopup', '$stateParams', 'ReservationService', 'event', 'tax', PassPurchaseCtrl]);

    function PassPurchaseCtrl($log, $scope, $state, $ionicPopup, $stateParams, ReservationService, event, tax) {
        ReservationService.setTaxRate(tax);
        ReservationService.clearAll();
        ReservationService.setCurrentReservation({
            eventId: $stateParams.eventId,
            reservationType: "PASS",
            clientType: "ANDROID"
        });
        var getPassName = function(passType) {
            if (passType === "VIP") {
                return passType;
            } else {
                var split = passType.split('_');
                var passName = "";
                angular.forEach(split, function(word) {
                    passName += word.charAt(0).toUpperCase() + word.slice(1).toLowerCase() + " ";
                });
                return passName;
            }
        }
        angular.forEach(event.passes, function(pass) {
            if (pass.passType === $stateParams.passType) {
                $scope.consumerPass = pass;
                $scope.consumerPass.name = getPassName(pass.passType);
                angular.forEach($scope.consumerPass.genders, function(gender) {
                    gender.quantity = 0;
                });
            }
        });
        $scope.event = event;
        $scope.increment = function(gender) {
            gender.quantity++;
            ReservationService.updateOrder(gender, gender.quantity);
        }
        $scope.decrement = function(gender) {
            if (!gender.quantity < 1) {
                gender.quantity--;
                ReservationService.updateOrder(gender, gender.quantity);
            }
        }
        $scope.getOrder = function() {
            return ReservationService.getCurrentOrder();
        }
        $scope.purchase = function() {
            $state.go('base.creditCard');
        }
        return this;
    }

})();