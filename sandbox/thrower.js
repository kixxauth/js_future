/**
 * @fileOverview Throw an error later.
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

/*global require: false, exports: true, module: false, window: false */

/**
 * @module thrower
 * @exports {Function} thrower
 */
module.declare(['queue'], function (require, exports, module) {
'use strict';

var queue = require('queue');

/**
 * @exports thrower
 * Delay throwing an error by putting it on top of the execution stack.
 * @param {Object} e Something to throw; usually an `Error` object.
 */
exports.thrower = function thrower(e) {
    queue.queue(function () { throw e; });
}; 
});

