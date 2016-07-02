/**
 * Created by visualjc on 12/20/14.
 *
 * Based on :
 * http://jbavari.github.io/blog/2014/06/24/managing-cordova-plugins-with-package-dot-json-and-hooks/
 */

//This script will add or remove all plugins listed in package.json

//usage: node plugins.js [ add | remove ]

var command = process.argv[2] || 'add';

var packageJson = require('../package.json');

var fs = require('fs');
var path = require('path');
var sys = require('sys')
var exec = require('child_process').exec;

function createAddRemoveStatement(plugin) {
    var pluginCmd = 'ionic plugin ' + command + ' ';
    if(typeof plugin === 'string') {
        pluginCmd += plugin;
    } else {
        if(command === 'add') {
            pluginCmd += plugin.locator + ' ';
            if(plugin.variables) {
                Object.keys(plugin.variables).forEach(function(variable){
                    pluginCmd += '--variable ' + variable + '="' + plugin.variables[variable] + '" ';
                });
            }
        } else {
            pluginCmd += plugin.id;
        }
    }

    return pluginCmd;
}

function processPlugin(index) {
    if(index >= packageJson.plugins.length)
        return;

    var plugin = packageJson.plugins[index];
    var pluginCommand = createAddRemoveStatement(plugin);
    console.log(pluginCommand);
    exec(pluginCommand, function(){
        processPlugin(index + 1);
    });
}

processPlugin(0);