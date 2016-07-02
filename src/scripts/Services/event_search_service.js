angular.module("bwcapp.events")
    .factory("EventSearchService", function($window, Restangular, $q, $timeout) {
        var events = {};
        var searchInputData = {
            city: "Denver",
            date: moment().toDate()
        }; //this is here to allow the search functionality to be shared by any controller that wants it
        var searchDidHappen = false;
        var cacheTimeout = 10 //minutes
        var cleanCache = function() {
            angular.forEach(events, function(event) {
                var cutoffTime = $window.moment().subtract(cacheTimeout, 'minutes');
                if (event.timestamp.isBefore(cutoffTime)) {
                    delete events[event.eventId];
                }
            });
            $timeout(cleanCache, 30000);
        }
        cleanCache();
        return {
            searchInputData: function() {
                return searchInputData;
            },
            getSearchDidHappen: function() {
                return searchDidHappen;
            },
            setSearchDidHappen: function(newVal) {
                searchDidHappen = newVal;
            },
            search: function(date, city, venueId, musicType) {
                var searchDate = window.moment(date);
                var startTime = searchDate.clone().startOf('day');
                var endTime = searchDate.clone().startOf('day');

                return Restangular.all('event').get('', {
                    lessThanDate: endTime.toISOString(),
                    greaterThanDate: startTime.toISOString(),
                    city: city,
                    venueId: venueId,
                    music: musicType
                });
            },
            searchRange: function(startDate, endDate, venueId) {
                var startTime, endTime;
                if (startDate) {
                    startTime = startDate.clone().startOf('day');
                }
                if (endDate) {
                    endTime = endDate.clone().startOf('day').add(1, 'd');
                }

                return Restangular.all('event').get('', {
                    lessThanDate: endDate ? endTime.toISOString() : undefined,
                    greaterThanDate: startDate ? startTime.toISOString() : undefined,
                    venueId: venueId
                });
            },
            getEventDetail: function(eventId) {
                var deferred = $q.defer();
                if (events[eventId]) {
                    deferred.resolve(events[eventId]);
                } else {
                    Restangular.one('event', eventId).get().then(function(response) {
                        events[eventId] = response;
                        events[eventId].timestamp = $window.moment(new Date());
                        deferred.resolve(response);
                    }, function(error) {
                        deferred.reject(error);
                    });
                }
                return deferred.promise;
            }
        };
    });