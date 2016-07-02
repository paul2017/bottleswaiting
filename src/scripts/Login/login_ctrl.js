(function() {
    'use strict'

    angular.module('bwcapp.login').controller('LoginCtrl', ['$log', '$scope', '$state', '$ionicPopup', '$ionicLoading', 'LoginService', 'UserService', 'FacebookService', LoginCtrl]);

    function LoginCtrl($log, $scope, $state, $ionicPopup, $ionicLoading, LoginService, UserService, FacebookService) {
        $ionicLoading.hide();
        if (LoginService.isLoggedIn()) {
            $state.go('base.eventList');
        }

        // $scope.username= "visualjc@gmail.com";
        // $scope.password = "no1234u";
        function formIsValid() {
            var msg = ''
            if (!$scope.username || $scope.username.length == 0) {
                msg = "Please enter your username"
            }
            if (!$scope.password || $scope.password.length == 0) {
                if (msg.length > 0)
                    msg += " and your password"
                else
                    msg = "Please enter your password"
            }
            if (msg.length > 0) {
                $ionicPopup.alert({
                    title: "Missing Fields",
                    template: msg
                });
            }
            return msg.length == 0;
        }

        $scope.login = function() {
            if (!formIsValid()) {
                return;
            }
            LoginService.login($scope.username, $scope.password).then(function(response) {
                UserService.getCurrentUser().then(function(response) {
                    $scope.user = response;
                    if (response.role !== "ROLE_CONSUMER") {
                        var alertPopup = $ionicPopup.alert({
                            title: 'Invalid Account',
                            template: "The account you're trying to use is not for this website, please create an account with the signup button."
                        });
                        alertPopup.then(function(res) {
                            LoginService.logout();
                        });
                    } else {
                        //$ionicPopup.alert({
                        //    title: '"Succesfully logged in"',
                        //    template: "<b>You've succesfully logged in.</b>"
                        //});
                        $state.go("base.eventList")
                    }
                }, function(error) {
                    $log.error('Could not retrieve user information');
                });
            }, function(error) {
                $ionicPopup.alert({
                    title: 'Invalid email or password',
                    template: "The email/password combination you've entered does not work"
                });
            });
        };
        $scope.loginWithFB = function() {
            $ionicLoading.show({
                template: '<img src="./images/ajax-loader.gif">',
                delay: '500',
                duration: '3000'
            });
            FacebookService.login().then(function(response) {

                $state.go("base.eventList");

            }, function(error) {
                $ionicPopup.alert({
                    title: 'Facebook authentication failed, please try again'
                });
            });
        };
        $scope.signup = function() {
            $state.go('signup');
        };

        $scope.isLoggedIn = function() {
            return LoginService.isLoggedIn();
        };

        return this;
    }
})();