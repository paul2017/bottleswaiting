angular.module("bwcapp.venue", ['restangular'])
	.factory("VenueService", function($window, Restangular, $q) {
		var venues = {};
		var venuesByCity = {};
		return {
			getVenue : function(venueId) {
				var deferred = $q.defer();
				if (venues[venueId]) {
					deferred.resolve(venues[venueId]);
				}
				else {
					Restangular.one('venue', venueId).get().then(function(response){
						venues[venueId] = response;
						deferred.resolve(response);
					}, function(error) {
						deferred.reject(error);
					});
				}
				return deferred.promise;
			},
			getVenues : function(city) {
				var deferred = $q.defer();
				if (venuesByCity[city]) {
					deferred.resolve(venuesByCity[city]);
				}
				else {
					Restangular.all('venue').get('', {
	  					city: city
	  				}).then(function(response) {
	  					venuesByCity[city] = response;
	  					angular.forEach(response, function(venue) {
	  						venues[venue.venueId] = venue;
	  					});
	  					deferred.resolve(response);
	  				}, function(error) {
	  					deferred.reject(error);
	  				});
	  			}
  				return deferred.promise;
			},
			getCities : function() {
				return Restangular.all('venue/cities').withHttpConfig({ cache: true }).getList();
			}
		};
	});