/**
 * @fileOverview Broadcast data to a list of functions.
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
 * @module broadcaster
 * @exports {Function} broadcast
 */
module.declare(['thrower'], function (require, exports, module) {
'use strict';

var thrower = require('thrower');

/**
 * @exports broadcast
 * Broadcast a set of arguments to a list of functions.
 * @param {Array} callbacks A list of functions to broadcast to.
 * @param {Array} args A list of arguments to apply to each callback.
 * @param {Object} [context] Will become `this` inside callback functions.
 */
exports.broadcast = function broadcaster(callbacks, args, context) {
    var i = 0, len = callbacks.length;
    context = context || {};
    for (; i < len; i += 1) {
        try {
            callbacks[i].apply(context, args);
        } catch (e) {
            // Report a callback error after it can no longer get in our way.
            thrower.thrower(e);
        }
    }
};
});

