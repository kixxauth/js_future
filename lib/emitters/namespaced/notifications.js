/**
 * @fileOverview Namespaced notification registry mixin.
 * @author Kris Walker <kris@kixx.name>
 * @version 0.0
 *
 * Copyright (c) 2010 - 2011 Kris Walker <kris@kixx.name>
 * Some rights are reserved, but licensed to you under the MIT license.
 * See MIT-LICENSE.txt or http://opensource.org/licenses/mit-license.php
 * for more information.
 */

/*jslint
  white: true
, onevar: true
, undef: true
, nomen: true
, eqeqeq: true
, plusplus: true
, bitwise: true
, regexp: true
, newcap: true
, immed: true
, strict: true
, laxbreak: true
, maxlen: 80
*/

// JSLint 'laxbreak' is set to true to tolerate comma first JS notation.

'use strict';

var utils   = require('../utils')
  , nsutils = require('./utils')
  , invoke  = require('../../frun').run
  ;

/**
 * @exports make
 *
 * Bind notification methods to an object.
 * @param {Object} [self] The object to bind to. Defaults to `{}`.
 * @returns {Object} The same object passed in; or `{}`.
 * 
 * The `.emit()` and `.on()` methods are bound to the object passed in as the
 * `self` parameter. If no `self` object is passed in, a new `{}` is created.
 * If an 'emit' or 'on' property or method already exist on the 'self' object,
 * they will be overwritten.
 *
 * A Notifier differs from an Emitter in that handlers which have yet to be
 * resistered will be triggered as soon as they are registered even if a
 * notification has already been emitted.
 */
exports.make = function make(self) {
    self = self || {};
    var registry = utils.make_Registry()
      , values = {}
      ;

    /**
     * Notify current and future handlers.
     * @param {String} path Namespaced event name.
     * @param {Array} [data] Array of arguments to pass to handlers.
     *
     * Any handlers bound to the given event name with `.on()` will be
     * triggered with the given data. Even handlers bound after `.emit()` is
     * called will be triggered with the latest data for this event name.
     * Additionally, whenever `.emit()` is repeatedly called with new data, all
     * current and future handlers will be triggered again with the new data.
     *
     * The 'data' parameter can actually be any object, but if not an array,
     * the callbacks will be invoked with only a single parameter
     */
    self.emit = function emit(path, data) {
        if (typeof path !== 'string') {
            throw utils.path_error(new TypeError());
        }

        nsutils.walkpath(path, function (namespace) {
            registry.broadcast(namespace, data);
            values[namespace] = data;
        });
    };

    /**
     * Register a handler for a notification.
     * @param {String} path Namespaced event name.
     * @param {Function} fn The callback function to call.
     *
     * If the notifaction has already been triggered at least once, the given
     * handler will be immediately invoked with the latest notification data.
     */
    self.on = function on(path, fn) {
        registry.bind(path, fn);
        if (Object.prototype.hasOwnProperty.call(values, path)) {
            invoke(fn, values[path], {});
        }
    };

    return self;
};

