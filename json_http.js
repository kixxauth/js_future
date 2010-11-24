/**
 * @fileOverview JSON specific HTTP client.
 * @author Kris Walker <kris@kixx.name>
 * @version 0.1
 *
 * Copyright (c) 2010 Kris Walker <kris@kixx.name>
 * Some rights are reserved, but licensed to you under the MIT license.
 * See MIT-LICENSE.txt or http://opensource.org/licenses/mit-license.php
 * for more information.
 */

/*jslint
  laxbreak: true
, onevar: true
, undef: true
, nomen: true
, eqeqeq: true
, plusplus: true
, bitwise: true
, regexp: true
, newcap: true
, immed: true
, strict: false
*/

// JSLint 'strict' is false because we put 'use strict'
// inside the module declaration closure.

/*global require: false, exports: true, module: false */

var deps = [
    'json'
  , 'jquery'
  , 'q/q'
];

/**
 * @module json_http
 */
module.declare(deps, function (require, exports, module) {
'use strict';

var JSON = typeof JSON === 'undefined' ? require('json').JSON : JSON
  , jQuery = require('jquery').jQuery
  , q      = require('q/q')
  ;

/**
 * @exports factory
 * Create an http 'send' function.
 * @param {Object} opts
 * @param {String} opts.url
 * @param {Object} [opts.headers]
 */
exports.factory = function factory(opts) {
    opts = opts || opts;
    var headers = opts.headers || {}
      , url = opts.url || 'undefined'
      ;

    /**
     * Send an http request
     * @param {Object} data A JSON serializable object.
     * @param {Object} [opts]
     * @param {Object} [opts.headers] Defaults to factory headers or {}.
     * @param {String} [opts.url] Defaults to factory url.
     * @param {String} [opts.method] 'GET' or 'POST' (defaults to 'POST').
     */
    return function http(data, opts) {
        opts = opts || opts;
        var deferred = q.defer()
          , this_headers = headers ? jQuery.extend({}, headers) : null
          , settings = {}
          ;

        if (opts.headers) {
            this_headers = jQuery.extend((this_headers || {}), opts.headers);
        }

        if (this_headers) {
            settings.beforeSend = function (xhr) {
                xhr.setRequestHeader('accept', 'application/json');
                Object.keys(this_headers).forEach(function (n) {
                    xhr.setRequestHeader(n, this[n]);
                }, this_headers);
            };
        }

        settings.url = opts.url || url;
        settings.type = opts.method || 'POST';
        settings.timeout = 5000;
        settings.cache = false;
        settings.contentType = 'application/json';
        settings.global = false;
        settings.processData = false;
        settings.data = JSON.stringify(data);

        settings.success = function (data, textStatus, xhr) {
            deferred.resolve(data);
        };

        settings.error = function (xhr, textStatus, err) {
            deferred.reject({reason: textStatus, request: xhr, error: err});
        };

        jQuery.ajax(settings);
        return deferred.promise;
    };
};
});

