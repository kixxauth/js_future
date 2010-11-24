/**
 * @fileOverview Queue interface for the browser window.
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
 * @module queue
 * @exports {Function} queue
 * @exports {Function} dequeue
 */
module.declare(function (require, exports, module) {
'use strict';

/**
 * @exports queue
 * Queue a function to happen later
 * @param {Number} [timeout] Millisecons until the function should execute.
 * @param {Function} [fn] The function to execute in the future.
 * @returns {Number} A unique id that can be passed to `.dequeue()`.
 *
 * If a timeout value is not given, the first parameter must be the function to
 * execute in the future and timeout will be set to 0;
 *
 * This function should be thought of as a tool to lift another function out of
 * the current execution stack and move it ahead to kick off execution of
 * another stack.
 *
 * Important: Do not rely of the `timeout` parameter because the browser will
 * only use it as a 'guide' and the variance can be quite hight.
 */
function queue(timeout, fn) {
    if (typeof timeout === 'function') {
        fn = timeout;
        timeout = 0;
    }
    return window.setTimeout(fn, timeout);
};

/**
 * @exports dequeue
 * Remove a function from the execution queue.
 * @param {Number} id The id given by `.enqueue()`.
 */
var dequeue = window.clearTimeout;

exports.queue = queue;
exports.dequeue = dequeue;
});

