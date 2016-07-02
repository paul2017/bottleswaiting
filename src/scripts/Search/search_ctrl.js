/**
 * Created by jcarter on 12/18/14.
 */
(function() {
    'use strict'

    angular.module('bwcapp.search').controller('SearchEventsCtrl', ['$log', '$scope', '$state', '$ionicPopup', '$ionicSideMenuDelegate',
        'LoginService', "EventSearchService", "VenueService",
        'Restangular', "MiscInfoService",
        SearchEventsCtrl
    ]);

    function SearchEventsCtrl($log, $scope, $state, $ionicPopup, $ionicSideMenuDelegate,
        LoginService, EventSearchService, VenueService, Restangular, MiscInfoService) {
        console.log("~~~~~~~~ Search Controller ~~~~~~~~");

        VenueService.getCities().then(
            function(cities) {
                $scope.cities = cities;
            }
        );
        var getNameFromType = function(type) {
            var splits = type.split('_');
            var name = "";
            angular.forEach(splits, function(split, index) {
                name += split.charAt(0).toUpperCase() + split.slice(1).toLowerCase();
                if (!index === splits.length - 1) {
                    name += " ";
                }
            });
            return name;
        };
        $scope.musicTypes = [];
        MiscInfoService.getMusicTypes().then(function(musicTypes) {
            angular.forEach(musicTypes, function(musicType) {
                $scope.musicTypes.push({
                    type: musicType,
                    name: getNameFromType(musicType)
                });
            });
            $scope.musicTypes.unshift({
                name: "Any"
            });
        });
        $scope.selectedData = {
            selectedCity: "Denver",
            selectedDate: moment().format("ddd, MM/DD/YY"),
            selectedMusicType: undefined,
            suggestedCity: ""
        }

        var today = moment();
        var threeMonths = moment().add(3, "months");
        var diff = Math.abs(today.diff(threeMonths, "days"));
        $scope.dates = [today.format("ddd, MM/DD/YY")];
        for (var i = 0; i < diff; i++) {
            $scope.dates.push(today.add(1, "day").format("ddd, MM/DD/YY"));
        }

        $scope.search = function() {
            var inputData = EventSearchService.searchInputData();
            console.log("~~~~~~~~~~~~  Search:" + $scope.selectedData.selectedCity + " " + $scope.selectedData.selectedDate);
            inputData.city = $scope.selectedData.selectedCity;
            inputData.date = moment($scope.selectedData.selectedDate, "MM/DD/YY").toDate();
            inputData.musicType = $scope.selectedData.selectedMusicType;
            EventSearchService.setSearchDidHappen(true);
            $ionicSideMenuDelegate.toggleRight();
            $state.go("base.eventList");
        }

        $scope.submitSuggestedCity = function() {
            console.log("~~~~ called suggested city: " + $scope.selectedData.suggestedCity);
            if ($scope.selectedData.suggestedCity) {
                Restangular.allUrl("request_city").post({
                    city: $scope.selectedData.suggestedCity
                }).then(
                    function() {
                        $ionicPopup.alert({
                            title: "Suggestion Sent",
                            template: $scope.selectedData.suggestedCity + " has been sent to our team."
                        });
                        $ionicSideMenuDelegate.toggleRight();
                    }
                )
            }
        }

        return this;
    }
})();