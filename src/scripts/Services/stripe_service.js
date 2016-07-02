angular.module("bwcapp.stripe", ['bwcapp.config'])
	.factory("StripeService", function($window, $q, config) {
		$window.Stripe.setPublishableKey(config.stripeKey);
		return {
			getStripeToken: function(cc) {
				var deferred = $q.defer();
				$window.Stripe.card.createToken({
					number: cc.cardNum,
					cvc: cc.cvv,
					exp_month: parseInt(cc.expMonth),
					exp_year: parseInt(cc.expYear),
					name: cc.name,
					address_zip: cc.zip
				}, function(status, response) {
					if (response.error) {
						deferred.reject(response.error);
					} else {
						deferred.resolve(response.id);
					}
				});
				return deferred.promise;
			}
		};
	});