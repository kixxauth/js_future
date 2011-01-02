/**
 * @fileOverview Load and execute JS text
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
, laxbreak: true
, maxlen: 80
*/

// JSLint 'white' (strict white space) is set to false to tolerate comma first
// JS notation.

// JSLint 'laxbreak' is set to true to tolerate comma first JS notation.

'use strict';

/**
 * @module floader
 * Load and execute JS text, using a function constructor as a sandbox.
 */

/**
 * @exports make
 * Create a factory function for the given JS text.
 */
exports.make = function Factory(text) {
    return function returned_factory(inject, context) {
        var keys = Object.keys(inject || {})
          , vals = keys.map(function (k) { return inject[k]; })
          , factory
          ;

        keys.push(text);
        try {
            factory = Function.apply({}, keys);
        } catch (eval_err) {
            // TODO: Handle eval errors for better debugging.
            throw eval_err;
        }

        try {
            factory.apply(context || {}, vals);
        } catch (exec_err) {
            // TODO: Handle execution errors for better debugging.
            throw exec_err;
        }
    };
};

