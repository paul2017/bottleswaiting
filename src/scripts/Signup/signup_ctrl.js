(function() {
    'use strict'

    angular.module('bwcapp.signup').controller('SignUpCtrl',
        ['$log', '$scope', '$state', '$ionicPopup', 'LoginService', 'UserService', 'moment', SignUpCtrl]);

    function SignUpCtrl($log, $scope, $state, $ionicPopup, LoginService, UserService, moment) {
        $scope.title = "Sign Up";

        $scope.user = {};
        $scope.signup = function() {
            if (formIsValid()) {
                UserService.createUser($scope.user).then(
                    function(data) {
                        $state.go('login');
                        $ionicPopup.alert({
                            title: "Sign up success",
                            template: "A confirmation email has been sent. You will not be able to login before confirming your email address."
                        });
                    },
                    function(error) {
                        var errorMessage = "Unknown Error Please try again"
                        if (error.status === 400) {
                            errorMessage = error.data.errors[0].message
                        }
                        $ionicPopup.alert({
                            title: "Sign up error",
                            template: errorMessage
                        });
                        $log.log(error);
                    }
                );
            }
        };
        $scope.goBack = function() {
            $state.go('login');
        };
        $scope.dobLabel = "Date of Birth";
        $scope.phoneLabel = "Phone";
        $scope.addMask = function(type) {
            if (type === 'dob') {
                $scope.dobMask = "99/99/9999";
                $scope.dobLabel = "";
            } else {
                $scope.phoneMask = "999-999-9999";
                $scope.phoneLabel = "";
            }
        };
        $scope.removeMask = function(type) {
            if (!$scope.user.dateOfBirth && type ==='dob') {
                $scope.dobMask = "";
                $scope.dobLabel = "Date of Birth";
            } else if (!$scope.user.phoneNumber) {
                $scope.phoneMask = "";
                $scope.phoneLabel = "Phone";
            }
        };
        
        function formIsValid() {
            var errors = $scope.$$childHead.signupForm.$error;
            var msg = '', title;
            if (errors.required) {
                msg = '';
                title = "Missing Fields";
                angular.forEach(errors.required, function(field, index){
                    msg += field.$name.split('-').join(' ');
                    if (index !== errors.required.length - 1) {
                        msg+= ", ";
                    }
                });
            }
            else if (errors.email) {
                title = "Invalid Email";
                msg = "Email is invalid";
            }
            else if (errors.validator) {
                if (errors.validator[0].$name === 'confirm-password') {
                    title = "Confirm password";
                    msg = "Confirm password does not match password";
                }
            }
            if (msg.length > 0) {
                $ionicPopup.alert({
                    title: title,
                    template: msg
                });
            }
            return msg.length==0;
        }
    }
})();