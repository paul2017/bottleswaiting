(function() {
	'use strict'

	angular.module('bwcapp.payment').controller('CreditCardCtrl', ['$log', '$scope', '$window', '$state', '$ionicPopup', '$filter',
		'ReservationService', 'StripeService', CreditCardCtrl
	]);

	function CreditCardCtrl($log, $scope, $window, $state, $ionicPopup, $filter, ReservationService, StripeService) {
		$scope.cc = {};

		$scope.scan = function() {
			if ($window.cordova) {
				var cardIO = new $window.cordova.plugins.cardio();
				cardIO.scan({
						"expiry": true,
						"cvv": true,
						"zip": false,
						"confirm": true,
						"showLogo": false,
						"suppressManual": false
					},
					function(success) {
						$scope.$apply(function() {
							$scope.cc.expMonth = success.expiry_month;
							$scope.cc.expYear = success.expiry_year;
							$scope.cc.cardNum = success.card_number;
						});

					},
					function(error) {
						console.log("error: " + JSON.stringify(error, null, 1))
					});
			}
		}
		$scope.pay = function() {
			var cc = angular.copy($scope.cc);
			cc.expYear = parseInt("20" + $scope.cc.expYear)
			StripeService.getStripeToken(cc).then(function(response) {
				ReservationService.createPaymentInfo({
					stripeCardToken: response,
					ccNum: cc.cardNum
				});
				ReservationService.reserve().then(function(reserveResponse) {
					ReservationService.pay().then(function(response) {
						$state.go('base.confirmation', {
							reservationId: reserveResponse.reservationResponse.reservationId
						});
					}, function(error) {
						var errorMessage = "Unknown Error Please try again";
						var errorField = "";
						if (error.status === 400) {
							errorMessage = error.data.errors[0].message;
							errorField = error.data.errors[0].field;
						}
						$ionicPopup.alert({
							title: "Payment Error:" + errorField,
							template: errorMessage
						});
					});
				}, function(error) {
					var errorMessage = "Unknown Error Please try again";
					var errorField = "";
					if (error.status === 400) {
						errorMessage = error.data.errors[0].message;
						errorField = error.data.errors[0].field;
					}
					$ionicPopup.alert({
						title: "Reservation Error:" + errorField,
						template: errorMessage
					});
				});
			}, function(error) {
				$ionicPopup.alert({
					title: "Credit Card Error",
					template: error.message
				});
			});
		}
		return this;
	};
})();