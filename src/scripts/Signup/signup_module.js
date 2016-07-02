angular.module("bwcapp.signup", ['bwcapp.config',
        'bwcapp.login',
        'bwcapp.user',
        'bwcapp.hide_on_enter',
        'ui.utils'
    ])
    .config(function($stateProvider) {
        $stateProvider.state('signup', {
            url: "/signup",
            views: {
                "main": {
                    templateUrl: "./views/signup/signup.html",
                    controller: "SignUpCtrl"
                }
            }

        });
    });