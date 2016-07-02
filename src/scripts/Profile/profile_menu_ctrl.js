(function() {
    'use strict'

    angular.module('bwcapp.profile')
        .controller('ProfileMenuCtrl', ['$log', '$scope', '$state', '$ionicPopup', 'LoginService', 'UserService', 'FacebookService', ProfileMenuCtrl]);

    function ProfileMenuCtrl($log, $scope, $state, $ionicPopup, LoginService, UserService, FacebookService) {

        $scope.photoUrl = "./images/header.svg";
        if (LoginService.isLoggedIn()) {
            UserService.getCurrentUser().then(function(response) {
                $scope.user = response;
                if (response.photoUrl) {
                    $scope.photoUrl = response.photoUrl
                } else if (response.facebookUser) {
                    FacebookService.getUserPhoto().then(function(response) {
                        $scope.photoUrl = response;
                    })
                } else {
                    $scope.photoUrl = "./images/header.svg";
                }
            });
        }
        $scope.logout = function() {
            var confirmPopup = $ionicPopup.confirm({
                title: 'Confirm logout',
                template: 'Are you sure you want to log out?'
            });
            confirmPopup.then(function(res) {
                if (res) {
                    LoginService.logout().then(function(response) {
                        $ionicPopup.alert({
                            title: "Logout",
                            template: "You have been logged out."
                        });
                        $state.go('login');
                    });
                }
            });
        };
        return this;
    }
})();