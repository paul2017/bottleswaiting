(function() {
	'use strict'

	angular.module('bwcapp.payment').controller('ConfirmationCtrl', ['$log', '$scope', '$state', '$ionicPopup', '$filter',
		'ReservationService', 'confirmation', ConfirmationCtrl
	]);

	function ConfirmationCtrl($log, $scope, $state, $ionicPopup, $filter, ReservationService, confirmation) {

		$scope.confirmation = confirmation;
		ReservationService.clearAll();
		$scope.exit = function() {
			$state.go('base.eventList');
		}
		return this;
	};
})();