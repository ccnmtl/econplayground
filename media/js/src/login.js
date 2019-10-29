/* global requirejs: true */

requirejs.config({
    baseUrl: window.STATIC_URL + 'js/',
    paths: {
        'jquery': 'lib/jquery-3.4.1.min',
        'domReady': 'lib/require/domReady'
    },
    urlArgs: 'bust=' + (new Date()).getTime()
});

define([
    'jquery',
    'domReady',
    'src/utils'
], function($, domReady, utils) {
    domReady(function() {
        $('form#login-local').submit(utils.onLocalLogin);
    });
});
