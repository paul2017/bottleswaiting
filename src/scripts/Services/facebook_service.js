angular.module('bwcapp.facebook', ['restangular', 'bwcapp.login'])
	.factory('FacebookService', function($window, $q, $rootScope, Restangular, LoginService, config) {
		// var FB = $window.FB;
		// FB.init({
		//        appId      : config.fbAppId,
		//        xfbml      : true
		//    });
		var buildFBRequest = function(accessResponse) {
			var deferred = $q.defer();
			var accessToken = accessResponse.authResponse.accessToken;
			var userID = accessResponse.authResponse.userID;
			facebookConnectPlugin.api('/me', ['public_profile', 'email'], function(response) {
				var firstName = response.first_name;
				var lastName = response.last_name;
				var email = response.email;
				deferred.resolve({
					accessToken: accessToken,
					id: userID,
					firstName: firstName,
					lastName: lastName,
					email: email
				});
			});
			return deferred.promise;
		};
		var loginWithFB = function(fbRequest) {
			var deferred = $q.defer();

			Restangular.allUrl('oauth.facebook', config.serviceUrl + '/oauth/facebook')
				.post(fbRequest).then(function(response) {
					deferred.resolve({
						email: fbRequest.email,
						password: response.passwordToken
					});
				}, function(error) {
					deferred.reject(error);
				});
			return deferred.promise;
		};
		return {
			login: function() {
				$rootScope.isLoading = true;
				var deferred = $q.defer();
				facebookConnectPlugin.getLoginStatus(function(response) {
					if (response.authResponse) {
						buildFBRequest(response).then(function(fbRequest) {
							loginWithFB(fbRequest).then(function(response) {
								LoginService.login(response.email, response.password).then(function(response) {
									deferred.resolve(response);
									$rootScope.isLoading = false;
								}, function(error) {
									//login error
									deferred.reject({
										type: 'login',
										error: error
									});
									$rootScope.isLoading = false;
								});
							});
						});
					} else {
						facebookConnectPlugin.login(['public_profile', 'email'],
							function(response) {
								if (response.authResponse) {
									buildFBRequest(response).then(function(fbRequest) {
										loginWithFB(fbRequest).then(function(response) {
											LoginService.login(response.email, response.password).then(function(response) {
												deferred.resolve(response);
												$rootScope.isLoading = false;
											}, function(error) {
												//login error
												deferred.reject({
													type: 'login',
													error: error
												});
												$rootScope.isLoading = false;
											});
										});
									});
								} else {
									//fb error
									deferred.reject({
										type: 'fb',
										error: response.error
									});
									$rootScope.isLoading = false;
								}
							});
					}
				});
				return deferred.promise;
			},
			logout: function() {
				//this will log user out of facebook as well, use carefully.
				FB.logout();
			},
			getUserPhoto: function() {
				$rootScope.isLoading = true;
				var deferred = $q.defer();
				facebookConnectPlugin.api('/me?fields=picture', ['public_profile', 'email'], function(response) {
					deferred.resolve(response.picture.data.url);
					$rootScope.isLoading = false;
				}, function(error) {
					$rootScope.isLoading = false;
				});
				return deferred.promise;
			}

		};
	});