/**
 * Created by jcarter on 12/14/14.
 */
// need to load the ionic stuff here!
angular.module('bwcapp', ['ionic', 'restangular', 'ngCordova',
        'bwcapp.config', 'bwcapp.login', 'bwcapp.events', 'bwcapp.oauth',
        'bwcapp.signup', 'bwcapp.venue', 'bwcapp.pass', 'bwcapp.profile',
        'bwcapp.user', 'bwcapp.table', 'bwcapp.payment', 'bwcapp.search',
        'bwcapp.hide_on_enter', 'bwcapp.user', 'bwcapp.table', 'bwcapp.payment',
        'bwcapp.max_length', 'bwcapp.search', 'bwcapp.no_drag_left'
    ])
    .config(function($stateProvider, $urlRouterProvider) {
        $urlRouterProvider.otherwise('/login');

        $stateProvider.state('base', {
            abstract: true,
            url: "/base",
            views: {
                "main": {
                    templateUrl: "./views/base/base.html",
                    controller: "BaseCtrl"
                },
                "searchView": {
                    templateUrl: "./views/search/searchEvents.html",
                    controller: "SearchEventsCtrl"
                },
                "profileMenu": {
                    templateUrl: "./views/profile/profile_menu.html",
                    controller: "ProfileMenuCtrl"
                }
            }
        });
    }).controller("BaseCtrl", function($scope, $ionicSideMenuDelegate, $rootScope, $state, $http, $ionicLoading, LoginService, UserService) {
        $scope.toggleMenu = function() {
            if (LoginService.isLoggedIn()) {
                $ionicSideMenuDelegate.toggleLeft();
            }
        }
        $scope.isLoggedIn = function() {
            return LoginService.isLoggedIn();
        }
        $scope.goToSearch = function() {
            if ($state.current.name === 'base.eventList') {
                $ionicSideMenuDelegate.toggleRight();
            }
        }
        $scope.isEventList = function() {
            return $state.current.name === 'base.eventList';
        }
        $scope.isLoading = function() {
            return $http.pendingRequests.length > 0 || $rootScope.isLoading;
        };
        $scope.$watch($scope.isLoading, function(v) {
            if (v) {
                $ionicLoading.show({
                    template: '<img src="./images/ajax-loader.gif">',
                    delay: '500',
                    duration: '3000'
                });
            } else {
                $ionicLoading.hide();
            }
        });
        $scope.canDrag = function() {
            return $state.current.name != 'base.eventList' && $state.current.name != "base.tableSelect";
        }
    })
    .run(function($ionicPlatform, config, Restangular, $rootScope, $timeout, $state, LoginService, $cordovaSplashscreen) {
        $ionicPlatform.ready(function() {
            // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
            // for form inputs)
            if (window.cordova && window.cordova.plugins.Keyboard) {
                cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
            }
            if (window.StatusBar) {
                StatusBar.styleDefault();
            }
            if (window.ionic) {
                window.ionic.Platform.isFullScreen = true;
            }
            if (window.plugins && window.plugins.orientationLock) {
                window.plugins.orientationLock.lock("portrait");
            }
            if (window.plugins && window.plugins.analytics && config.googleAnalyticsId) {
                window.analytics.startTrackerWithId(config.googleAnalyticsId);
            }
            $timeout(function() {
                $cordovaSplashscreen.hide();
            }, 300);
            console.log("config: " + JSON.stringify(config));


        });
        $ionicPlatform.onHardwareBackButton(function(event) {
            if ($state.current.name === 'base.confirmation') {
                $state.go('base.eventList');
            } else {
                navigator.app.backHistory();
            }
        }, 100);
        Restangular.setBaseUrl(config.serviceUrl + "/" + config.serviceAPIPath);
        $rootScope.$on('$stateChangeSuccess', function() {
            if (!LoginService.isLoggedIn() && $state.current.name != 'signup') {
                $state.go('login');
            }
        });
    })