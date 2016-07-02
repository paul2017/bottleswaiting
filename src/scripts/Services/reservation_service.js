angular.module("bwcapp.reservation", ['restangular'])
	.factory("ReservationService", function($window, Restangular, $q) {
		var reservation = {};
		var order = {};
		var orderItems = [];
		var splitters = [];
		var mainSplitter = {};
		var paymentInfo = {};
		var venueTaxRate;
		return {
			getOrder: function(reservationId, orderId) {
				return Restangular.one('reservation', reservationId).one('order', orderId).get();
			},
			getOrders: function(reservationId) {
				return Restangular.one('reservation', reservationId).all('order').getList();
			},
			getOrderItem: function(reservationId, orderId, orderItemId) {
				return Restangular.one('reservation', reservationId).one('order', orderId).one('orderItem', orderItemId).get();
			},
			getOrderItems: function(reservationId, orderId) {
				return Restangular.one('reservation', reservationId).one('order', orderId).all('orderItem').getList();
			},
			getReservation: function(reservationId) {
				return Restangular.one('reservation', reservationId).get();
			},
			getReservationConfirm: function(reservationId) {
				return Restangular.one('reservation', reservationId).one('confirmation').get();
			},
			//operations on current order
			clearAll: function() {
				reservation = {};
				order = {};
				orderItems = [];
				splitters = [];
				mainSplitter = {};
				paymentInfo = {};
			},
			getCurrentOrder: function() {
				return order;
			},
			setCurrentOrder: function(newOrder) {
				order = newOrder;
			},
			getCurrentOrderItems: function() {
				return orderItems;
			},
			getCurrentSplitters: function() {
				return splitters;
			},
			getCurrentReservation: function() {
				return reservation;
			},
			setCurrentReservation: function(newReservation) {
				reservation = newReservation;
			},
			getCurrentGuests: function() {
				return reservation.guests;
			},
			setCurrentGuests: function(newGuests) {
				if (!newGuests || newGuests.length > 0) {
					reservation.guests = newGuests;
				}
			},
			createSplitters: function(newSplitters, user, payRestIfTimeout) {
				splitters = newSplitters;
				mainSplitter = {
					name: user.firstName + " " + user.lastName,
					phoneNumber: user.phoneNumber,
					primary: true,
					payRestIfTimeout: payRestIfTimeout
				};
				splitters.push(mainSplitter);
			},
			createPaymentInfo: function(newPaymentInfo) {
				paymentInfo = newPaymentInfo;
			},
			setTaxRate: function(taxRate) {
				venueTaxRate = taxRate;
			},
			updateOrder: function(item, quantity) {
				var orderItem = _.find(orderItems, function(orderItem) {
					if (orderItem.menuPackageId) {
						return orderItem.menuPackageId === item.menuPackageId;
					} else if (orderItem.menuItemId) {
						return orderItem.menuItemId === item.menuItemId;
					} else if (orderItem.passId) {
						return orderItem.passId === item.passId;
					}
				});
				if (!orderItem) {
					orderItem = {};
					orderItems.push(orderItem);
				}
				if (quantity < 1) {
					orderItems.splice(orderItems.indexOf(orderItem), 1);
				}

				orderItem.quantity = quantity;
				orderItem.unitPrice = item.price;

				if (item.packageItems) {
					orderItem.menuPackageId = item.menuPackageId;
					orderItem.type = "PACKAGE";
					orderItem.name = item.name;
				} else if (item.passId) {
					orderItem.passId = item.passId;
					orderItem.type = "PASS";
					var gender = item.gender === 'M' ? 'Male' : 'Female';
					orderItem.name = item.name + " " + gender;
				} else {
					orderItem.menuItemId = item.menuItemId;
					orderItem.type = item.type;
					orderItem.name = item.name + " " + item.volume;
					if (item.volumeUnit != "NONE") {
						orderItem.name += " " + item.volumeUnit;
					}
				}
				this.updateOrderTotals();
			},
			updateOrderTotals: function() {
				order.subTotal = 0;
				_.map(orderItems, function(orderItem) {
					order.subTotal += orderItem.unitPrice * orderItem.quantity;
				});
				var totalToUse;
				if (reservation.reservationType === 'TABLE') {
					totalToUse = order.subTotal > order.minimumBuy ? order.subTotal : order.minimumBuy;
					order.tip = totalToUse * 0.2;
				} else {
					totalToUse = order.subTotal;
					order.tip = 0;
				}
				order.tax = totalToUse * venueTaxRate / 100;
				order.total = order.tax + totalToUse + order.tip;
			},
			reserve: function() {
				var deferred = $q.defer();
				Restangular
					.all('reservation')
					.post(reservation)
					.then(function(reservationResponse) {
						reservation.reservationId = reservationResponse.reservationId;
						if (reservation.guests) {
							Restangular
								.one('reservation', reservationResponse.reservationId)
								.all('guest')
								.post(reservation.guests).then(function(response) {

								}, function(error) {
									//guest error;
								});
						}
						Restangular
							.one('reservation', reservationResponse.reservationId)
							.all('order')
							.post(order)
							.then(function(orderResponse) {
								order.orderId = orderResponse.orderId;
								if (orderItems && orderItems.length > 0) {
									Restangular
										.one('reservation', reservationResponse.reservationId)
										.one('order', orderResponse.orderId)
										.all('orderItem')
										.post(orderItems)
										.then(function(orderItemResponse) {
											deferred.resolve({
												reservationResponse: reservationResponse,
												orderResponse: orderResponse,
												orderItemResponse: orderItemResponse
											});
										}, function(error) {
											//orderItem error;
											deferred.reject(error);
										});
								} else {
									deferred.resolve({
										reservationResponse: reservationResponse,
										orderResponse: orderResponse
									});
								}
							}, function(error) {
								//order error;
								deferred.reject(error);
							});
					}, function(error) {
						//reservation error;
						deferred.reject(error);
					});
				return deferred.promise;
			},
			pay: function() {
				var amount = order.total;
				if (splitters.length > 0) {
					amount = order.total / (splitters.length + 1);
					mainSplitter.stripeCardToken = paymentInfo.stripeCardToken;
					delete mainSplitter.primary;
					return Restangular
						.one('reservation', reservation.reservationId)
						.one('order', order.orderId)
						.all('splitPayment')
						.post(splitters);
				} else {
					return Restangular
						.one('reservation', reservation.reservationId)
						.one('order', order.orderId)
						.all('paymentReceipt')
						.post({
							amount: amount,
							stripeCardToken: paymentInfo.stripeCardToken
						});
				}
			}
		};
	});