/**
 * @fileOverview json_rpc singleton service.
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

var deps = [
    'json_http'
  , 'namespaced_events'
  , 'q/q'
];

/**
 * @module json_rpc
 */
module.declare(deps, function (require, exports, module) {
'use strict';

var create = Object.create
  , has = Object.prototype.hasOwnProperty
  , keys = Object.keys
  , toString = Object.prototype.toString
  , isArray = Array.isArray

  , logger  = require('logging').logger(module.id)
  , emitter = require('namespaced_events').emitter
  , q       = require('q/q')
  , http    = require('json_http').factory()

  , SEND_EVENT = 'json_rpc.sending'

  , gid = (function () {
        var i = 0;
        return function () {
            return (i += 1);
        };
    }())

  , url_memo
  , methods_memo
  , current_batch
  ;

/**
 * @exports make_JSON_RPC_error as JsonRPCError
 */
function make_JSON_RPC_error(err) {
    var self = create(make_JSON_RPC_error.prototype);
    keys(err).forEach(function (k) {
        if (!has.call(self, k)) {
            self[k] = err[k];
        }
    });
    return self;
}
make_JSON_RPC_error.prototype.name = 'JsonRPCError';


// Internal abstract data class for an RPC request object.
function makeWrappedRequest(method, params) {
    var self = create(makeWrappedRequest.prototype)
      , deferred = q.defer()
      ;

    // The actual request object that will be JSON.stringify()d
    self.wrapped = {
        id: gid()
      , method: method
      , params: params
    };

    // Expose the 'q/q' API.
    self.resolve = deferred.resolve;
    self.reject = deferred.reject;
    self.promise = deferred.promise;
    return self;
}
makeWrappedRequest.prototype.valueOf = function () {
    return this.wrapped;
};

// Internal abstract data class for a batch of RPC request objects.
function makeBatchRequest() {
    var self = create(makeBatchRequest.prototype);
    self.wrapped = {}; // Dictionary of wrapped requests.
    return self;
}
// Takes a WrappedRequest object and appends it to the internal dictionary.
makeBatchRequest.prototype.append = function (req) {
    this.wrapped[req.id] = req;
};
makeBatchRequest.prototype.forEach = function (fn) {
    keys(this.wrapped).forEach(function (id) {
        fn(this.wrapped[id]);
    }, this);
};
makeBatchRequest.prototype.valueOf = function () {
    var rv = [];
    this.forEach(function (req) {
        rv.push(req.valueOf());
    });
    return rv;
};

// Send an JSON HTTP request.
function make_request(batch) {
    if(!url_memo) {
        throw make_JSON_RPC_error(
                  new Error(module.id +
                            ':: has not been initialized with a URL.'));
    }
    q.when( http(batch.valueOf(), {url: url_memo})
          , function (data) {
                batch.forEach(function (req) {
                    req.resolve(data[req.id]);
                });
            }

            // result.reason, result.request, result.error
          , function (result) {
                var args = [
                    'request response failed: http status:'
                  , result.request.status
                  , 'reason:'
                  , result.reason
                ];
                if (result.error) {
                    args = args.concat(['error:', result.error +'']);
                }

                logger.debug.apply(logger, args);

                // smash the promises
                batch.forEach(function (req) {
                    req.reject(result);
                });
            }
        );
}

/**
 * @exports send as send
 * Send all batched requests.
 */
function send() {
    if(!current_batch) {
        throw make_JSON_RPC_error(
                  new Error(module.id + ':: has not been initialized.'));
    }
    emitter.emit(SEND_EVENT, [exports]);
    make_request(current_batch);
    current_batch = makeBatchRequest();
}

/**
 * @exports beforeSend as beforeSend
 * Attach a handler to the 'json_rpc.sending' event.
 */
function beforeSend(fn) {
    emitter.on(SEND_EVENT, fn);
}

/**
 * Append an RPC request to the batch of requests to send.
 * @param {String} name The method name of the request.
 * @param {Array} params Method parameters passed to the service.
 * @returns {q.Promise} A promise object that can be resolved with
 * the q/q API.
 */
function append(name, params) {
    if (typeof name !== 'string') {
        throw new TypeError('typeof method name ['+ (typeof name) +
                            '] !== "string"');
    }
    if (!isArray(params)) {
        throw new TypeError('typeof method arguments ['+
                            toString.call(params) +'] !== "[object Array]"');
    }
    if (!isArray(methods_memo)) {
        throw new TypeError('typeof methods list ['+
                            toString.call(methods_memo) +'] !== "[object Array]"');
    }
    if (methods_memo.indexOf(name) === -1) {
        throw make_JSON_RPC_error(
                  new Error( 'The method "'+ name +'" is not a '+
                             'registered method in: '+ methods_memo.join('.')
                           ));
    }
    var req = makeWrappedRequest(name, params);
    current_batch.append(req);
    return req.promise;
}

/**
 * @exports url as url
 * Set or reset the URL for this RPC service.
 */
function url(value) {
    if (typeof value !== 'string') {
        throw new TypeError('typeof url ['+
                            toString.call(value) +'] !== "string"');
    }
    url_memo = value;
}

/**
 * @exports init as init
 * Initialize this RPC service.
 * @param {Object} opts
 * @param {String} opts.url The URL can be changed by subsequest calls to the
 *                          returned 'sender' function.
 * @param {Array} opts.methods A string list of allowed RPC method names.
 * @returns {Object} The exports of this module.
 */
function init(opts) {
    opts = opts || {};
    current_batch = makeBatchRequest();
    url(opts.url);
    methods_memo = opts.methods;
    return exports;
}

exports.JsonRPCError = make_JSON_RPC_error;
exports.beforeSend = beforeSend;
exports.send = send;
exports.append = append;
exports.url = url;
exports.init = init;
});

