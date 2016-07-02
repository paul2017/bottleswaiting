angular.module('bwcapp.login')
    .factory('LoginService', function($rootScope, $http, config, Restangular, $log, $window, $state, $q, UserService) {
        return {
            login: function(email, password) {
                var login = "";
                login += 'username=' + encodeURIComponent(email);
                login += '&password=' + encodeURIComponent(password);
                login += '&grant_type=password';

                var headers = {
                    'Authorization': 'Basic Y29uc3VtZXI6VXJwWjc0dUU=',
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'Accept': 'application/json'
                };
                var deferred = $q.defer();
                Restangular.allUrl('oauth.token', config.serviceUrl + '/oauth/token').post(login, {}, headers).then(
                    function(response) {
                        console.log("~~~~~~~~~~~ allURL worked...");
                        $window.localStorage.oauth = JSON.stringify(response);
                        Restangular.setDefaultHeaders({
                            Authorization: "Bearer " + response.access_token
                        });
                        deferred.resolve();
                    },
                    function(error) {
                        console.log("~~~~~~~~~~~ allURL errored...");
                        $log.error("Login Error");
                        deferred.reject(error);
                    });
                return deferred.promise;
            },
            logout: function() {
                var deferred = $q.defer();
                var oauth = JSON.parse($window.localStorage.oauth);

                Restangular.allUrl('oauth.revoke', config.serviceUrl + '/oauth/revoke')
                    .post("token=" + oauth.access_token, {}, {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    })
                    .then(function() {
                        delete $window.localStorage.oauth;
                        Restangular.setDefaultHeaders({});
                        UserService.clearUser();
                        deferred.resolve();
                    }, function() {
                        deferred.reject();
                    });
                return deferred.promise;
            },
            isLoggedIn: function() {

                var oauth = {};
                if ($window.localStorage.oauth) {
                    oauth = JSON.parse($window.localStorage.oauth);
                }
                if (!oauth.refresh_token) {
                    return false;
                }
                return true;
            }
        };
    });