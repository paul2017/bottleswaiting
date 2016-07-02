/**
 * Created by jcarter on 12/14/14.
 */
angular.module("bwcapp.events", ['bwcapp.config', 'bwcapp.login', 'bwcapp.user', 'angularMoment'])
    .config(function($stateProvider) {
        $stateProvider.state('base.eventList', {
                url: "/listEvents",
                views: {
                    "mainView": {
                        templateUrl: "./views/events/eventList.html",
                        controller: "EventListCtrl"
                    }
                }

            })
            .state('base.eventDetail', {
                url: "/event/:eventId",
                views: {
                    "mainView": {
                        templateUrl: "./views/events/event_detail.html",
                        controller: "EventDetailCtrl"
                    }
                },
                resolve: {
                    event: function(EventSearchService, $stateParams) {
                        return EventSearchService.getEventDetail($stateParams.eventId);
                    },
                    venue: function(VenueService, event) {
                        return VenueService.getVenue(event.venueId);
                    }
                }

            });
    });