/*jslint node: true */
'use strict';

angular.module('bwcapp.config', [])
    .constant('config', {
        serviceUrl: '@@serviceUrl',
        serviceAPIPath: '@@serviceAPIPath',
        serviceKey: '@@serviceKey',
        buildDate: '@@timestamp',
        buildVersion: '@@version',
        stripeKey: '@@stripeKey',
        fbAppId: '@@fbAppId',
        production: '@@production'
});
