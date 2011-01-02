/**
 * @fileOverview General utilities for emitter modules.
 * @author Kris Walker <kris@kixx.name>
 * @version 0.0
 *
 * Copyright (c) 2010 - 2011 Kris Walker <kris@kixx.name>
 * Some rights are reserved, but licensed to you under the MIT license.
 * See MIT-LICENSE.txt or http://opensource.org/licenses/mit-license.php
 * for more information.
 */

/*jslint
  white: false
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
, maxlen: 80
*/

// JSLint 'white' (strict white space) is set to false to tolerate comma first
// JS notation.

'use strict';

var invoke = require('../frun').run;

/**
 * @exports path_error
 * Return an error for an invalid event path-name.
 * ! Warning: This function is not packaged for individual sale.
 * @param {Object} err An `Error` type object.
 * @param {Object} path Any JS value; the value to check.
 */
function path_error(err, path) {
    err.message = 'typeof event name ['+ (typeof path) +'] !== "string"';
    return err;
}

/**
 * @exports make_Registry
 * Creates a callback registry for emitter mixins.
 * ! Warning: This function is not packaged for individual sale.
 * @param {Object} [dict] The dictionary object from which the new registry
 * will inherit from.
 */
function Registry(dict) {
    var self = Object.create(Registry.prototype);
    self.dict = dict || {};
    return self;
}

// Bind the given `callback` to the registry on the given `path`.
// @param {String} path
// @param {Function} callback
Registry.prototype.bind = function registry_bind(path, callback) {
    if (typeof path !== 'string') {
        throw path_error(new TypeError(), path);
    }
    if (typeof callback !== 'function') {
        throw new TypeError('typeof event handler ['+ (typeof callback) +
                            '] !== "function"');
    }
    if (!Array.isArray(this.dict[path])) {
        this.dict[path] = [];
    }
    this.dict[path].push(callback);
    return this;
};

// If any callbacks exist on the given `path`, invoke them with `data`.
// @param {String} path
// @param {Array} data (can actually be any object, but if not an array, the
// callback will be invoked with only a single parameter)
Registry.prototype.broadcast = function registry_broadcast(path, data) {
    var li = this.dict[path];

    if (Array.isArray(li)) {
        li.forEach(function (fn) {
            invoke(fn, data, {});
        });
    }
    return this;
};

exports.path_error = path_error;
exports.make_Registry = Registry;

