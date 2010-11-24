/**
// @fileOverview CommonJS 2.0 environment for the browser
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
// inside the declaration closure.

/*global require: false, exports: true, module: false, window: true */

// ========================================
// CommonJS 2.0 environment for the browser
// ========================================
// (unratified draft specification)
// --------------------------------
var env = (function (GLOBAL) {
    'use strict';

      // memoized exports objects
    var require_memo = {}

      // memoized factory functions
      , factory_memo = {}

      // memoized module objects
      , module_memo = {}

      // the currently loading module id
      , currently_loading

      // memoized module resources (as functions)
      , resource_cache = {}

      // just a shortcut
      , has = Object.prototype.hasOwnProperty

      // constructors defined later
      , makeRequire
      , makeModule
      ;

    // custom error constructor
    function requireError(self) {
        self.name = 'RequireError';
        return self;
    }

    // cache a resource function
    function resource(path, fn) {
        resource_cache[path] = fn;
    }

    // dereference an exports object from the memo and return it
    function get(id) {
        if (has.call(require_memo, id)) {
            return require_memo[id];
        }
        throw requireError(
            new Error('The module "'+ id +'" could not be found.'));
    }

    // create and memoize a new exports object with the given id
    function set(id) {
        if (!has.call(require_memo, id)) {
            return (require_memo[id] = {});
        }
        throw requireError(
            new Error('The module "'+ id +'" already exists.'));
    }

    // determine if a module factory has already been loaded
    function loaded(id) {
        return has.call(factory_memo, id);
    }

    // invoke a module *resource* function (different from a factory function)
    function load(path) {
        currently_loading = path;
        resource_cache[path](GLOBAL);
    }

    // determine the currently loading module id
    function loading() {
        return currently_loading;
    }

    // get or set a module factory function
    function factories(key, fn) {
        if (fn) {
            factory_memo[key] = fn;
            return;
        }
        return factory_memo[key];
    }

    // determine if a module factory function has already been invoked
    function invoked(id) {
        return has.call(module_memo, id);
    }

    // invoke a module factory function with the given id and exports object
    function doinvoke(id, exports) {
        var require = makeRequire(id)
          , mod = (module_memo[id] = module({id:id, require: require}))
          ;

        factories(id)(require, exports, mod);
    }

    // return a resolved id given the current location and a relative id
    function resolve(current, id) {
        // A module id that does not begin with a '.' is an absolute
        // identifier, so we just return it.
        if (id.charAt(0) !== '.') {
            return id;
        }

        var resolved = current.split('/')
          , parts = id.split('/')
          , i
          , part
          ;

        // Pop off the module name of the current location.
        resolved.pop();

        for (i = 0; i < parts.length; i += 1) {
          part = parts[i];
          if (part.charAt(0) !== '.') {
            resolved.push(part);
          }
          else if (part === '..') {
            resolved.pop();
          }
        }

        return resolved.join('/');
    }

    // module object constructor (according to spec)
    makeModule = function Module(spec) {
        if (!(this instanceof Module)) {
            return new Module(spec);
        }
        this.id = spec.id;
        this.require = spec.require;
    };

    // declare / define a module and dependencies
    makeModule.prototype.declare = function (deps, factory) {
        if (typeof deps === 'function') {
            factory = deps;
            deps = [];
        }

        var id = loading();
        this.require.memoize(id);
        
        if (deps.length) {
            this.provide(deps, function () {
                factories(id, factory);
            });
            return;
        }

        factories(id, factory);
    };

    // provide module dependencies to the environment
    makeModule.prototype.provide = function (deps, callback) {
        var resolver = this.require.id
          , i
          , id
          ;

        for (i = 0; i < deps.length; i += 1) {
            id = resolver(deps[i]);
            if (!loaded(id)) {
                load(id);
            }
        }
        // We're not loading modules asynchronously but we still use
        // the callback to act as though we are.
        callback();
    };

    // not implemented
    makeModule.prototype.load = null;

    // `require()` constructor
    // the 'extra module environment' should specify `extra_require`
    makeRequire = function Require(loc, extra_require) {
        var self;

        // the actual `require()` function exposed to modules
        function new_require(id) {
            id = self.id(id);
            var module_exports = get(id);
            if (!invoked(id)) {
                doinvoke(id, module_exports);
            }
            return module_exports;
        }

        // use a different require function if specified
        self = typeof extra_require === 'function' ?
               extra_require : new_require;

        // resolve an id with the current location
        self.id = function (id) {
            return resolve(loc, id);
        };

        // create and memoize an exports object with the given id
        self.memoize = set;

        return self;
    };

    // special require function for the 'extra module environment'
    function extra_require(id) {
        if (id.charAt(0) !== '.') {
            var module_exports = get(id);
            doinvoke(id, module_exports);
            return module_exports;
        }
        throw requireError(new Error( 'Relative module identifiers are not '+
                                      'available in the extra module '+
                                      'environment: '+ id));
    }

    // export the globals
    GLOBAL.require = makeRequire('', extra_require);
    GLOBAL.module = module({require: GLOBAL.require});

    // special module.declare function used to bootstrap the main module
    GLOBAL.module.declare = function bootstrap(deps, factory) {
        var id = '';

        // remove this instance method
        delete GLOBAL.module.declare; // the prototype.declare method remains

        // define the resource containing the main module
        resource(id, function () { this.declare(deps, factory); });

        load(id);
        this.require(id);
    };

    // return the `env` namespace
    return {resource: resource};

}(window));

