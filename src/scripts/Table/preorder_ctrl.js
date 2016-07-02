(function() {
    'use strict'

    angular.module('bwcapp.table').controller('PreorderCtrl', ['$log', '$scope', '$state', '$ionicPopup', '$filter',
        'ReservationService', 'event', 'menuItems', 'packages', 'venue', 'table', PreorderCtrl
    ]);

    function PreorderCtrl($log, $scope, $state, $ionicPopup, $filter, ReservationService, event, menuItems, packages, venue, table) {

        var getNameFromType = function(type) {
            var splits = type.split('_');
            var name = "";
            angular.forEach(splits, function(split, index) {
                name += split.charAt(0).toUpperCase() + split.slice(1).toLowerCase();
                if (!index === splits.length - 1) {
                    if (splits[0] === 'BOURBON') {
                        name += " and ";
                    } else {
                        name += " ";
                    }
                }
            });
            return name;
        };
        if (!ReservationService.getCurrentReservation().reservationType) {
            ReservationService.setCurrentReservation({
                tableId: table.tableId,
                reservationType: "TABLE",
                eventId: event.eventId,
                guestCount: 0,
                clientType: "ANDROID"
            });
        }
        ReservationService.setTaxRate(venue.taxPercent);
        if (!ReservationService.getCurrentOrder().total) {
            ReservationService.setCurrentOrder({
                total: table.minBuy * (0.2 + venue.taxPercent / 100 + 1),
                tax: table.minBuy * venue.taxPercent / 100,
                subTotal: 0,
                minimumBuy: table.minBuy,
                tip: table.minBuy * 0.2,
                clientType: "ANDROID"
            });
        }
        $scope.toggleGroup = function(group) {
            if ($scope.isGroupShown(group)) {
                $scope.shownGroup = null;
            } else {
                $scope.shownGroup = group;
            }
        };
        $scope.updateOrder = function(item, quantity) {
            if (quantity < 0 && quantity) {
                menuItem.orderQuantity = 0;
                quantity = 0;
            }
            ReservationService.updateOrder(item, quantity);
        };

        $scope.isGroupShown = function(group) {
            return $scope.shownGroup === group;
        };
        $scope.event = event;
        if (packages.length > 0) {

            $scope.packages = {
                    packages: packages,
                    label: "Packages"
                }
                // angular.forEach($scope.packages.packages, function(onePackage) {
                //     onePackage.quantity = 0;
                // });
        };
        $scope.menuCategories = [];

        angular.forEach(menuItems, function(menuItem) {
            var category = $filter('filter')($scope.menuCategories, {
                'name': getNameFromType(menuItem.type)
            })[0];
            if (!category) {
                category = {};
                category.name = getNameFromType(menuItem.type);
                category.items = [];
                $scope.menuCategories.push(category);
            }
            // menuItem.quantity = 0;
            category.items.push(menuItem);
        });
        $scope.getOrder = function() {
            return ReservationService.getCurrentOrder();
        };
        $scope.getOrderItems = function() {
            return ReservationService.getCurrentOrderItems();
        };

        $scope.goToPayment = function(type) {
            var order = ReservationService.getCurrentOrder();
            if (order.subTotal < order.minimumBuy) {
                $ionicPopup.alert({
                    title: "Invalid Order",
                    template: "Order subtotal (total bottle price) must be greater than table mininum purchase"
                });
                return;
            }
            if (type === 'cc') {
                $state.go('base.creditCard');
            } else {
                $state.go('base.splitPayment');
            }
        }
        return this;
    }

})();