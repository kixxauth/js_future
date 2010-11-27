/**
 * @fileOverview 
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

/*global require: false, exports: true, module: false, console: false */

/**
 * @module logging
 * @exports makeLogger
 * @exports logs
 */
module.declare(function (require, exports, module) {
'use strict';

var create = Object.create
  , aps = Array.prototype.slice
  , toStr = Object.prototype.toString
  , methods = ['error', 'warn', 'info', 'debug', 'log']
  , logs = []
  ;

function update_logs(args) {
    if (logs.length >= 70) {
        logs.shift();
    }
    logs.push(args);
}

/**
 * Create a logger.
 * @exports Logger as makeLogger
 */
function Logger(modname) {
  var self = create(Logger.prototype);
  self.modname = typeof modname === 'string' ? modname : toStr.call(modname);
  return self;
}

methods.forEach(function (m) {
    Logger.prototype[m] = function () {
        var args = [m.toUpperCase, this.modname].concat(aps.call(arguments));

        if (typeof console !== 'undefined' &&
            typeof console[m] === 'function') {
            console[m].apply(console, args);
        }

        args.unshift(new Date().toISOString());
        update_logs(args);
    };
});

/**
 * Get the log history.
 * @exports get_logs as logs
 * @returns {Array} List of logged strings.
 */
function get_logs() {
    return aps.call(logs);
}

exports.makeLogger = Logger;
exports.logs = get_logs;
});

