angular.module("bwcapp.table", ['bwcapp.events', 'bwcapp.venue', 'bwcapp.reservation'])
    .config(function($stateProvider) {
        $stateProvider
            .state('base.floorplanList', {
                url: "/floorplanList?eventId",
                views: {
                    "mainView": {
                        templateUrl: "./views/table/floorplan_list.html",
                        controller: "FloorplanListCtrl"
                    }
                },
                resolve: {
                    event: function(EventSearchService, $stateParams) {
                        return EventSearchService.getEventDetail($stateParams.eventId);
                    },
                    layouts: function(event) {
                        return event.layouts;
                    }
                }
            })
            .state('base.tableSelect', {
                url: "/tableSelect?eventId&layoutId",
                views: {
                    "mainView": {
                        templateUrl: "./views/table/table_select.html",
                        controller: "TableSelectCtrl"
                    }
                },
                resolve: {
                    event: function(EventSearchService, $stateParams) {
                        return EventSearchService.getEventDetail($stateParams.eventId);
                    },
                    layout: function(event, $stateParams) {
                        var selectedLayout;

                        angular.forEach(event.layouts, function(layout) {
                            if (layout.layoutId === parseInt($stateParams.layoutId)) {
                                selectedLayout = layout;
                            }
                        });
                        return selectedLayout;
                    },
                    tables: function(event, layout, $filter) {
                        return $filter('filter')(event.tables, {
                            layoutId: layout.layoutId
                        });
                    }
                }
            })
            .state('base.tableDetail', {
                url: "/tableDetail?eventId&tableId",
                views: {
                    "mainView": {
                        templateUrl: "./views/table/table_detail.html",
                        controller: "TableDetailCtrl"
                    }
                },
                resolve: {
                    event: function(EventSearchService, $stateParams) {
                        return EventSearchService.getEventDetail($stateParams.eventId);
                    },
                    table: function(event, $stateParams) {
                        var selectedTable;

                        angular.forEach(event.tables, function(table) {
                            if (table.tableId === parseInt($stateParams.tableId)) {
                                selectedTable = table;
                            }
                        });
                        return selectedTable;
                    },
                    venue: function(event, VenueService) {
                        return VenueService.getVenue(event.venueId);
                    }
                }
            })
            .state('base.guestInfo', {
                url: "/guestInfo?guestCount&eventId&tableId",
                views: {
                    "mainView": {
                        templateUrl: "./views/table/guest_info.html",
                        controller: "GuestInfoCtrl"
                    }
                },
                resolve: {
                    guests: function(ReservationService) {
                        return ReservationService.getCurrentGuests();
                    }
                }
            })
            .state('base.preorder', {
                url: "/preorder?eventId&tableId",
                views: {
                    "mainView": {
                        templateUrl: "./views/table/preorder.html",
                        controller: "PreorderCtrl"
                    }
                },
                resolve: {
                    event: function(EventSearchService, $stateParams) {
                        return EventSearchService.getEventDetail($stateParams.eventId);
                    },
                    packages: function(event) {
                        return event.menuPackages;
                    },
                    menuItems: function(event) {
                        return event.menuItems;
                    },
                    venue: function(event, VenueService) {
                        return VenueService.getVenue(event.venueId);
                    },
                    table: function(event, $stateParams) {
                        var selectedTable;

                        angular.forEach(event.tables, function(table) {
                            if (table.tableId === parseInt($stateParams.tableId)) {
                                selectedTable = table;
                            }
                        });
                        return selectedTable;
                    },
                }
            });
    });