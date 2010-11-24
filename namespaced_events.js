/**
 * @fileOverview Namspaced event registry mixins.
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

/**
 * @module namespaced_events
 * @exports makeEmitter
 * @exports makeNotifier
 */
module.declare(['broadcaster'], function (require, exports, module) {
'use strict';

var has = Object.prototype.hasOwnProperty
  , isArray = Array.isArray
  , toString = Object.prototype.toString

  , broadcaster = require('broadcaster')
  ;

// Throw an error for an invalid event path/name.
function path_error(err, path) {
    err.message = 'typeof event name ['+ (typeof path) +'] !== "string"';
    return err;
}

// Throw an error for invalid arguments passed to an emitter.
function args_error(err, args) {
    err.message = ( 'typeof event data ['+ toString.call(args) +
                    '] !== "[object Array]"');
    return err;
}

// Call a function for each '.' deliniated part of an even path/name.
function descend_path(path, fn) {
    while (path) {
        if (fn(path) === false) {
            break;
        }
        path = path.slice(0, path.lastIndexOf('.'));
    }
}

// Create a generic function for registering event handlers on a given registry
// dictionary object.
function make_registrar(registry) {
    return function on(path, fn) {
        if (typeof path !== 'string') {
            throw path_error(new TypeError(), path);
        }
        if (typeof fn !== 'function') {
            throw new TypeError('typeof event handler ['+ (typeof fn) +
                                '] !== "function"');
        }
        if (!has.call(registry, path)) {
            registry[path] = [];
        }
        registry[path].push(fn);
    };
}

/**
 * @exports Emitter as makeEmitter
 *
 * Bind emitter methods to an object.
 * @param {Object} [self] The object to bind to. Defaults to `{}`.
 * @returns {Object} The same object passed in; or `{}`.
 * 
 * The `.emit()` and `.on()` methods are bound to the object.
 */
function Emitter(self) {
    self = self || {};
    var registry = {}
      , broadcast = broadcaster.broadcast
      ;

    /**
     * Emit event data to registered handlers.
     * @param {String} path Namespaced event name.
     * @param {Array} data Array of arguments to pass to handlers.
     */
    self.emit = function emit(path, data) {
        if (typeof path !== 'string') {
            throw path_error(new TypeError(), path);
        }
        if (!isArray(data)) {
            throw args_error(new TypeError(), data);
        }
        descend_path(path, function (path_part) {
            if (has.call(registry, path_part)) {
                broadcast(registry[path_part], data);
            }
        });
    };

    /**
     * Bind an event handler to this emitter object.
     * @param {String} path Namespaced event name.
     * @param {Function} fn The callback function to call.
     * This will most likely be your public API to your event emitter feature.
     */
    self.on = make_registrar(registry);

    return self;
}

/**
 * @exports Notifier as makeNotifier
 *
 * Bind notification methods to an object.
 * @param {Object} [self] The object to bind to. Defaults to `{}`.
 * @returns {Object} The same object passed in; or `{}`.
 * 
 * The `.emit()` and `.on()` methods are bound to the object.
 *
 * A Notifier differs from an Emitter in that handlers which have yet to be
 * resistered will be triggered as soon as they are registered and a
 * notification has been emitted.
 */
function Notifier(self) {
    self = self || {};
    var registry = {}
      , values = {}
      , broadcast = broadcaster.broadcast
      , registrar = make_registrar(registry)
      ;

    /**
     * Notify current and future handlers.
     * @param {String} path Namespaced event name.
     * @param {Array} data Array of arguments to pass to handlers.
     *
     * Any handlers bound after this method is called will be triggered with
     * the given data. Whenever `.emit()` is repeatedly called with new data,
     * all current and future handlers will be triggered again with the new
     * data.
     */
    self.emit = function emit(path, data) {
        if (typeof path !== 'string') {
            throw path_error(new TypeError());
        }
        if (!isArray(data)) {
            throw args_error(new TypeError(), data);
        }
        descend_path(path, function (path_part) {
            values[path_part] = data;
            if (has.call(registry, path_part)) {
                broadcast(registry[path_part], data);
            }
        });
    };

    /**
     * Register a handler for a notification, even if it has already happened.
     * @param {String} path Namespaced event name.
     * @param {Function} fn The callback function to call.
     * This will most likely be your public API to your notification feature.
     */
    self.on = function on(path, fn) {
        registrar(path, fn);
        descend_path(path, function (path_part) {
            if (has.call(values, path_part)) {
                broadcast([fn], values[path_part]);
                return false;
            }
        });
    };

    return self;
}

exports.makeEmitter = Emitter;
exports.makeNotifier =  Notifier;
});
