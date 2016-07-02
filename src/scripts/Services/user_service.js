angular.module('bwcapp.user', ['restangular'])
	.factory('UserService', function(Restangular, $q, $window) {
		var user;
		var getDOB = function(dobString) {
			return $window.moment(dobString, "MMDDYYYY").unix() * 1000;
		};
		return {
			getCurrentUser: function() {
				var deferred = $q.defer();
				var self = Restangular.one('self');
				if (!user) {
					self.get().then(function(response) {
						user = response;
						deferred.resolve(user);
					}, function(error) {
						deferred.reject(error);
					});
				} else {
					deferred.resolve(user);
				}
				return deferred.promise;
			},
			createUser: function(user) {
				var userCopy = Restangular.copy(user);
				userCopy.role = "ROLE_CONSUMER";
				userCopy.dateOfBirth = getDOB(userCopy.dateOfBirth);
				return Restangular.all('users').post(userCopy);
			},
			clearUser: function() {
				user = undefined;
			}
		};
	});