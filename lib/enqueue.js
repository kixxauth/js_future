/**
 * @fileOverview Abstracted wrapper for setTimout and the execution stack.
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
, maxlen: 80
*/

/*global
  exports: true
, setTimeout: false
, clearTimeout: false
*/

'use strict';

/**
 * @module queue
 * @exports {Function} queue
 * @exports {Function} dequeue
 */

/**
 * @exports queue
 * Queue a function to happen later; push a function onto the stack.
 * @param {Number} [timeout] Milliseconds until the function should execute.
 * @param {Function} [fn] The function to execute in the future.
 * @returns {Number} A unique id that can be passed to `.dequeue()`.
 *
 * If a timeout value is not given, the first parameter must a function (to
 * execute in the future) and the timeout will default to 0.
 *
 * This function should be thought of as a tool to lift another function out of
 * the current execution stack; moving it ahead to kick off the execution of
 * another process stack.
 *
 * Important: Do not rely on the `timeout` parameter because the JS engine will
 * most likely only use it as a 'guide' and the variance can be quite high.
 */
exports.queue = function queue(timeout, fn) {
    if (typeof timeout === 'function') {
        fn = timeout;
        timeout = 0;
    }
    return setTimeout(fn, timeout);
};

/**
 * @exports dequeue
 * Remove a function from the stack execution queue.
 * @param {Number} id The id given by `.queue()`.
 */
exports.dequeue = clearTimeout;

