/**
 * Created by visualjc on 12/23/14.
 */
var CardIOPlugin = function() {};

CardIOPlugin.prototype.scan = function(cardIOConfig, success, fail) {
    return cordova.exec(function(args) {
        console.log("card.io scanning completed", args);
        success(args.card_number && args || args[0]);
    }, function(args) {
        console.log("card.io scanning Failed");
        fail(args);
    }, "CardIOPlugin", "scan", [cardIOConfig]);
};

if(!window.cordova) {
    window.cordova = {};
}

if(!window.cordova.plugins)
{
	window.cordova.plugins = {}
}

module.exports = CardIOPlugin;

/*
example:
cardIO.scan({"expiry": true, "cvv": true, "zip":false, "confirm": true, "showLogo":false, "suppressManual": false}, function(success) { console.log("success: " + JSON.stringify(success, null, 1)) }, function(error) { console.log("error: " + JSON.stringify(error, null, 1))  })
 */