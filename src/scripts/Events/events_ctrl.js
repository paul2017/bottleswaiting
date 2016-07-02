/**
 * Created by jcarter on 12/14/14.
 */
(function() {
    'use strict'

    angular.module('bwcapp.events').controller('EventListCtrl', ['$log', '$scope', '$state', '$ionicPopup', '$ionicSideMenuDelegate',
        'LoginService', "EventSearchService", "VenueService",
        EventListCtrl
    ]);

    function EventListCtrl($log, $scope, $state, $ionicPopup, $ionicSideMenuDelegate,
        LoginService, EventSearchService, VenueService) {

        var defaultSearch = EventSearchService.searchInputData();
        $scope.events = [];
        $scope.title = defaultSearch.city + " " + moment(defaultSearch.date).format("MM/DD/YYYY");

        VenueService.getCities().then(
            function(cities) {
                $scope.cities = cities;
                //console.log("Cities: " + JSON.stringify(cities));
            }
        ).then(
            function() {
                return VenueService.getVenues(defaultSearch.city).then(
                    function(venues) {
                        //console.log("Venues: " + JSON.stringify(venues));
                        $scope.venues = venues;
                    }
                )
            }
        ).then(
            function() {
                EventSearchService.search(defaultSearch.date, defaultSearch.city, undefined, defaultSearch.musicType).then(
                    function(events) {
                        //console.log("Events: " + console.log(JSON.stringify(events)));
                        $scope.events[currentIndex] = events;
                    }
                )
                var nextDay = moment(defaultSearch.date).add('day', 1).toDate();
                EventSearchService.search(nextDay, defaultSearch.city, undefined, defaultSearch.musicType).then(
                    function(events) {
                        var index = (currentIndex + 1) > 2 ? 0 : currentIndex + 1;
                        $scope.events[index] = events;
                    }
                );
                var prevDay = moment(defaultSearch.date).subtract('day', 1).toDate();
                EventSearchService.search(prevDay, defaultSearch.city, undefined, defaultSearch.musicType).then(
                    function(events) {
                        var index = (currentIndex - 1) < 0 ? 2 : currentIndex - 1;
                        $scope.events[index] = events;
                    }
                );
            }
        )
        var currentIndex = 0;
        $scope.slideHasChanged = function($index) {
            $scope.events = [];
            if (currentIndex + 1 === $index || currentIndex - 2 === $index) {
                $scope.search('next');

            } else if (currentIndex - 1 === $index || currentIndex + 2 === $index) {
                $scope.search('prev');
            }
            currentIndex = $index;
        }
        $scope.search = function(type) {
            if (type === 'prev') {
                var inputData = EventSearchService.searchInputData();
                inputData.date = moment(inputData.date).subtract('day', 1).toDate();

            } else if (type === 'next') {
                var inputData = EventSearchService.searchInputData();
                inputData.date = moment(inputData.date).add('day', 1).toDate();
            }
            EventSearchService.setSearchDidHappen(true);
        }
        $scope.selectedDate = defaultSearch.date;

        $scope.toggleSearch = function() {
            $ionicSideMenuDelegate.toggleRight();
        };
        $scope.$watch(function() {
            return EventSearchService.getSearchDidHappen();
        }, function(newValue, oldValue) {
            if (newValue != null && newValue) {
                //update Controller2's xxx value
                var inputData = EventSearchService.searchInputData();
                $scope.title = inputData.city + " " + moment(inputData.date).format("MM/DD/YYYY");
                EventSearchService.setSearchDidHappen(false);

                EventSearchService.search(inputData.date, inputData.city, undefined, inputData.musicType).then(
                    function(events) {
                        //console.log("~~~~~~ Search city returns:" + events ? events.length : " no events");
                        $scope.events[currentIndex] = events;
                    }
                );
                var nextDay = moment(inputData.date).add('day', 1).toDate();
                EventSearchService.search(nextDay, inputData.city, undefined, inputData.musicType).then(
                    function(events) {
                        //console.log("~~~~~~ Search city returns:" + events ? events.length : " no events");
                        var index = (currentIndex + 1) > 2 ? 0 : currentIndex + 1;
                        $scope.events[index] = events;
                    }
                );
                var prevDay = moment(inputData.date).subtract('day', 1).toDate();
                EventSearchService.search(prevDay, inputData.city, undefined, inputData.musicType).then(
                    function(events) {
                        //console.log("~~~~~~ Search city returns:" + events ? events.length : " no events");
                        var index = (currentIndex - 1) < 0 ? 2 : currentIndex - 1;
                        $scope.events[index] = events;
                    }
                );
            }
        }, true);

        return this;
    }
})();