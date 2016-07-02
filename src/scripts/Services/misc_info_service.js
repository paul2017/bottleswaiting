angular.module("bwcapp.misc_info", ['restangular'])
.factory("MiscInfoService", function($window, Restangular) {
	return {
		getMusicTypes : function() {
			return Restangular.all('/event/all_music_types').getList();
		},
		getProductTypes : function() {
			return Restangular.all("admin/menu_item_product/all_types").getList();
		}
	};
});