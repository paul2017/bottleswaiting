(function() {
    'use strict'

    angular.module('bwcapp.pass').controller('PassListCtrl',
        ['$log', '$scope', '$state', '$ionicPopup', 'event', PassListCtrl]);

    function PassListCtrl($log, $scope, $state, $ionicPopup, event)
    {	
    	if (event.passes.length === 1) {
    		$state.go('base.passPurchase', {
    			passType: event.passes[0].passType,
    			eventId : event.eventId
    		});
    		return this;
    	}
    	$scope.event = event;

    	var getPassName = function(passType) {
    		if (passType === "VIP") {
    			return passType;
    		}
    		else {
    			var split = passType.split('_');
    			var passName = "";
    			angular.forEach(split, function(word) {
    				passName += word.charAt(0).toUpperCase() + word.slice(1).toLowerCase() + " ";
    			});
    			return passName;
    		}
    	}
    	$scope.passes = event.passes;
    	angular.forEach($scope.passes, function(pass) {
    		pass.name = getPassName(pass.passType);
    	});
    	return this;
    }

})();