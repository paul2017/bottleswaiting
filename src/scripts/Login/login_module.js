angular.module("bwcapp.login", ['bwcapp.config', 'bwcapp.facebook', 'bwcapp.user'])
    .config(function($stateProvider) {
        $stateProvider.state('login', {
            url: "/login",
            views: {
                "main": {
                    templateUrl: "./views/login/login.html",
                    controller: "LoginCtrl"
                }
            }

        });
    });