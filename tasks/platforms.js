/**
 * Created by visualjc on 12/20/14.
 *
 * Based on :
 * http://jbavari.github.io/blog/2014/06/24/managing-cordova-plugins-with-package-dot-json-and-hooks/
 */
var command = process.argv[2] || 'add';
var packageJson = require('../package.json');

var fs = require('fs');
var path = require('path');
var sys = require('sys')
var exec = require('child_process').exec;

packageJson.platforms.forEach(function(platform) {
    var platformCmd = 'ionic platform ' + command + ' ' + platform;
    exec(platformCmd);
});