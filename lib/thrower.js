/**
 * @fileOverview Throw an object (error) on the *next* stack execution.
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

/**
 * @module thrower
 * @exports {Function} thrower
 */
var queue = require('./enqueue').queue;

/**
 * @exports raise
 * Delay throwing an error by putting it on top of the execution stack.
 * @param {Object} e Something to throw; usually an `Error` object.
 */
exports.raise = function raise(e) {
    queue(function () {
        throw e;
    });
}; 

