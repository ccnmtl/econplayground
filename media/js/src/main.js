/* global requirejs: true */

requirejs.config({
    baseUrl: window.STATIC_URL + 'js/',
    paths: {
        'jquery': 'lib/jquery-3.3.1.min',
        'domReady': 'lib/require/domReady',
        'underscore': 'lib/underscore-min'
    },
    urlArgs: 'bust=' + (new Date()).getTime()
});

define([
    'jquery',
    'domReady',
    'src/utils'
], function($, domReady, utils) {
    domReady(function() {
    });
});
