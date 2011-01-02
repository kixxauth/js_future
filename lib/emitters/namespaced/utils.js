/**
 * @fileOverview General utilities for namespaced emitter modules.
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

'use strict';

/**
 * @exports walkpath
 * Invoke the handlers registered for each part of a namespaced ("."
 * deliniated) callback registry.
 * ! Warning: This function is not packaged for individual sale.
 *
 * The registry will be invoked from left to right. So, on the path
 *
 *     "foo.bar.baz"
 *
 * all "foo" handlers will be invoked first and "baz" handlers will be invoked
 * last. So, "foo" is the most generalized event name, while "foo.bar.baz" is
 * the most specific.
 */
exports.walkpath = function walkpath(path, callback) {
    path.split('.').reduce(function (accumulated, part) {
        accumulated.push(part);
        callback(accumulated.join('.'));
        return accumulated;
    }, []);
};

