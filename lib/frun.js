/**
 * @fileOverview Apply a function within a try ... catch.
 * @author Kris Walker <kris@kixx.name>
 * @version 0.0
 *
 * Copyright (c) 2010 Kris Walker <kris@kixx.name>
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
, maxlen: 80
*/

'use strict';

var raise = require('./thrower').raise;

/**
 * @exports run
 * Run a function within a try ... catch block which will report any errors in
 * a future stack execution.
 * @param {Function} fn A function to invoke.
 * @param {Array} args A list of arguments to apply.
 * @param {Object} [context] Will become `this` inside the callback function.
 */
exports.run = function run(fn, args, context) {
    try {
        fn.apply(context || {}, args);
    } catch (e) {
        // Report a callback error after it can no longer get in our way.
        raise(e);
    }
};

