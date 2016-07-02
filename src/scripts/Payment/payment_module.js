angular.module("bwcapp.payment", ['bwcapp.reservation', 'bwcapp.stripe', 'bwcapp.user', 'bwcapp.contacts', 'ui.utils', 'ngCordova'])
	.config(function($stateProvider) {
		$stateProvider
			.state('base.creditCard', {
				url: "/creditCard",
				views: {
					"mainView": {
						templateUrl: "./views/payment/credit_card.html",
						controller: "CreditCardCtrl"
					}
				}
			})
			.state('base.splitPayment', {
				url: "/splitPayment",
				views: {
					"mainView": {
						templateUrl: "./views/payment/split_payment.html",
						controller: "SplitPaymentCtrl"
					}
				}
			})
			.state('base.confirmation', {
				url: '/confirmation?reservationId',
				views: {
					"mainView": {
						templateUrl: './views/payment/confirmation.html',
						controller: 'ConfirmationCtrl'
					}
				},
				resolve: {
					confirmation: function(ReservationService, $stateParams) {
						return ReservationService.getReservationConfirm($stateParams.reservationId);
					}
				}
			});
	});