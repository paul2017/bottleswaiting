angular.module("bwcapp.pass", ['bwcapp.events', 'bwcapp.venue', 'bwcapp.reservation'])
    .config(function($stateProvider) {
        $stateProvider
        .state('base.passList', {
        	url: "/passList?eventId",
            views: {
                "mainView": {
                    templateUrl: "./views/pass/pass_list.html",
                    controller: "PassListCtrl"
                }
            },
            resolve: {
            	event : function(EventSearchService, $stateParams) {
                    return EventSearchService.getEventDetail($stateParams.eventId);
                }
            }
        })
        .state('base.passPurchase', {
        	url: "/passPurchase?passType&eventId",
            views: {
                "mainView": {
                    templateUrl: "./views/pass/pass_purchase.html",
                    controller: "PassPurchaseCtrl"
                }
            },
            resolve: {
            	event : function(EventSearchService, $stateParams) {
                    return EventSearchService.getEventDetail($stateParams.eventId);
                }, 
                tax : function(event, VenueService, $q) {
                	var deferred = $q.defer() 
                	VenueService.getVenue(event.venueId).then(function(response){
                		deferred.resolve(response.taxPercent);
                	}, function(error) {
                		deferred.reject(error);
                	});
                	return deferred.promise;
                }
            }
        });
    });
