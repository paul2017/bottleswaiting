(function() {
    'use strict'

    angular.module('bwcapp.table').controller('FloorplanListCtrl',
        ['$log', '$scope', '$state', '$ionicPopup', 'layouts', 'event', FloorplanListCtrl]);

    function FloorplanListCtrl($log, $scope, $state, $ionicPopup, layouts, event)
    {	
    	if (layouts.length === 1) {
    		$state.go('base.tableSelect', {
    			layoutId: layouts[0].layoutId,
    			eventId : event.eventId
    		});
    		return this;
    	}
    	$scope.layouts = layouts;
        $scope.event = event;
    	return this;
    }

})();