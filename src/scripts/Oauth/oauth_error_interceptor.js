angular.module('bwcapp.oauth')
    .factory('oauthErrorInterceptor',
        function($window, $q, $injector, $state, $log, $http, config) {
            var refreshing = false;
            var buffer = [];

            function refreshToken() {
                refreshing = true;
                var deferred = $q.defer();
                var oauth = {};

                if ($window.localStorage.oauth) {
                    oauth = JSON.parse($window.localStorage.oauth);
                }

                if (!oauth.refresh_token) {
                    $state.go('login');
                    deferred.reject();
                    return deferred.promise;
                }

                delete $window.localStorage.oauth;

                var Restangular = $injector.get("Restangular");
                var refreshTokenParams = "";
                refreshTokenParams += 'refresh_token=' + oauth.refresh_token;
                refreshTokenParams += '&grant_type=refresh_token';

                var headers = {
                    'Authorization': 'Basic Y29uc3VtZXI6VXJwWjc0dUU=',
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'Accept': 'application/json'
                };

                Restangular.allUrl('oauth.token', config.serviceUrl + '/oauth/token').post(refreshTokenParams, {}, headers).then(function(response) {
                    $window.localStorage.oauth = JSON.stringify(response);
                    Restangular.setDefaultHeaders({
                        Authorization: "Bearer " + response.access_token
                    });
                    deferred.resolve(response.access_token);
                }, function() {
                    $log.error("Login Error");
                    $state.go('login');
                    deferred.reject();
                });

                return deferred.promise;
            }

            function interceptor(response, deferred, responseHandler) {
                if (response.status === 401) {
                    buffer.push({
                        response: response,
                        deferred: deferred,
                        responseHandler: responseHandler
                    });
                    if (!refreshing) {
                        refreshToken().then(function(access_token) {
                            angular.forEach(buffer, function(bufferedRequest) {
                                // Repeat the request and then call the handlers the usual way.
                                bufferedRequest.response.config.headers.Authorization = "Bearer " + access_token;
                                $http(bufferedRequest.response.config).then(bufferedRequest.responseHandler, bufferedRequest.deferred.reject);
                            });
                            buffer = [];
                        }, function(error) {
                            return true; //refresh token wasnt available
                        });
                    }
                    return false; // error handled
                }

                return true; // error not handled
            }
            return interceptor;
        });