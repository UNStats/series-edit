(function(f) {
  if (typeof exports === "object" && typeof module !== "undefined") {
    module.exports = f();
  } else if (typeof define === "function" && define.amd) {
    define([], f);
  } else {
    var g;
    if (typeof window !== "undefined") {
      g = window;
    } else if (typeof global !== "undefined") {
      g = global;
    } else if (typeof self !== "undefined") {
      g = self;
    } else {
      g = this;
    }
    g.fetchMock = f();
  }
})(function() {
  var define, module, exports;
  return (function e(t, n, r) {
    function s(o, u) {
      if (!n[o]) {
        if (!t[o]) {
          var a = typeof require == "function" && require;
          if (!u && a) return a(o, !0);
          if (i) return i(o, !0);
          var f = new Error("Cannot find module '" + o + "'");
          throw ((f.code = "MODULE_NOT_FOUND"), f);
        }
        var l = (n[o] = { exports: {} });
        t[o][0].call(
          l.exports,
          function(e) {
            var n = t[o][1][e];
            return s(n ? n : e);
          },
          l,
          l.exports,
          e,
          t,
          n,
          r
        );
      }
      return n[o].exports;
    }
    var i = typeof require == "function" && require;
    for (var o = 0; o < r.length; o++) s(r[o]);
    return s;
  })(
    {
      1: [
        function(require, module, exports) {
          "use strict";

          var _extends =
            Object.assign ||
            function(target) {
              for (var i = 1; i < arguments.length; i++) {
                var source = arguments[i];
                for (var key in source) {
                  if (Object.prototype.hasOwnProperty.call(source, key)) {
                    target[key] = source[key];
                  }
                }
              }
              return target;
            };

          const FetchMock = require("./lib/index");
          const statusTextMap = require("./lib/status-text");
          const theGlobal = typeof window !== "undefined" ? window : self;

          FetchMock.global = theGlobal;
          FetchMock.statusTextMap = statusTextMap;

          FetchMock.config = _extends(FetchMock.config, {
            Promise: theGlobal.Promise,
            Request: theGlobal.Request,
            Response: theGlobal.Response,
            Headers: theGlobal.Headers
          });

          module.exports = FetchMock.createInstance();
        },
        { "./lib/index": 4, "./lib/status-text": 8 }
      ],
      2: [
        function(require, module, exports) {
          "use strict";

          var _extends =
            Object.assign ||
            function(target) {
              for (var i = 1; i < arguments.length; i++) {
                var source = arguments[i];
                for (var key in source) {
                  if (Object.prototype.hasOwnProperty.call(source, key)) {
                    target[key] = source[key];
                  }
                }
              }
              return target;
            };

          const glob = require("glob-to-regexp");
          const express = require("path-to-regexp");
          const URL = require("url");
          const querystring = require("querystring");

          function normalizeRequest(url, options, Request) {
            if (Request.prototype.isPrototypeOf(url)) {
              return {
                url: url.url,
                method: url.method,
                headers: (() => {
                  const headers = {};
                  url.headers.forEach(
                    name => (headers[name] = url.headers.name)
                  );
                  return headers;
                })()
              };
            } else {
              return {
                url: url,
                method: (options && options.method) || "GET",
                headers: options && options.headers
              };
            }
          }

          const stringMatchers = {
            begin: targetString => {
              return ({ url }) => url.indexOf(targetString) === 0;
            },
            end: targetString => {
              return ({ url }) =>
                url.substr(-targetString.length) === targetString;
            },
            glob: targetString => {
              const urlRX = glob(targetString);
              return ({ url }) => urlRX.test(url);
            },
            express: targetString => {
              const urlRX = express(targetString);
              return ({ url }) => urlRX.test(url);
            }
          };

          const headersToLowerCase = headers =>
            Object.keys(headers).reduce((obj, k) => {
              obj[k.toLowerCase()] = headers[k];
              return obj;
            }, {});

          function areHeadersEqual(actualHeader, expectedHeader) {
            actualHeader = Array.isArray(actualHeader)
              ? actualHeader
              : [actualHeader];
            expectedHeader = Array.isArray(expectedHeader)
              ? expectedHeader
              : [expectedHeader];

            if (actualHeader.length !== expectedHeader.length) {
              return false;
            }

            return actualHeader.every((val, i) => val === expectedHeader[i]);
          }

          function getHeaderMatcher({ headers: expectedHeaders }, Headers) {
            if (!expectedHeaders) {
              return () => true;
            }
            const expectation = headersToLowerCase(expectedHeaders);

            return ({ headers = {} }) => {
              if (headers instanceof Headers) {
                // node-fetch 1 Headers
                if (typeof headers.raw === "function") {
                  headers = Object.entries(headers.raw());
                }
                headers = [...headers].reduce((map, [key, val]) => {
                  map[key] = val;
                  return map;
                }, {});
              }

              const lowerCaseHeaders = headersToLowerCase(headers);

              return Object.keys(expectation).every(headerName => {
                return areHeadersEqual(
                  lowerCaseHeaders[headerName],
                  expectation[headerName]
                );
              });
            };
          }

          const getMethodMatcher = route => {
            return ({ method }) => {
              return (
                !route.method ||
                route.method === (method ? method.toLowerCase() : "get")
              );
            };
          };

          const getQueryStringMatcher = route => {
            if (!route.query) {
              return () => true;
            }
            const keys = Object.keys(route.query);
            return ({ url }) => {
              const query = querystring.parse(URL.parse(url).query);
              return keys.every(key => query[key] === route.query[key]);
            };
          };

          const getUrlMatcher = route => {
            // When the matcher is a function it shodul not be compared with the url
            // in the normal way
            if (typeof route.matcher === "function") {
              return () => true;
            }

            if (route.matcher instanceof RegExp) {
              const urlRX = route.matcher;
              return ({ url }) => urlRX.test(url);
            }

            if (route.matcher === "*") {
              return () => true;
            }

            if (route.matcher.indexOf("^") === 0) {
              throw new Error(
                "Using '^' to denote the start of a url is deprecated. Use 'begin:' instead"
              );
            }

            for (let shorthand in stringMatchers) {
              if (route.matcher.indexOf(shorthand + ":") === 0) {
                const url = route.matcher.replace(
                  new RegExp(`^${shorthand}:`),
                  ""
                );
                return stringMatchers[shorthand](url);
              }
            }

            // if none of the special syntaxes apply, it's just a simple string match
            const expectedUrl = route.matcher;
            return ({ url }) => {
              if (route.query && expectedUrl.indexOf("?")) {
                return url.indexOf(expectedUrl) === 0;
              }
              return url === expectedUrl;
            };
          };

          const sanitizeRoute = route => {
            route = _extends({}, route);

            if (typeof route.response === "undefined") {
              throw new Error("Each route must define a response");
            }

            if (!route.matcher) {
              throw new Error(
                "Each route must specify a string, regex or function to match calls to fetch"
              );
            }

            if (!route.name) {
              route.name = route.matcher.toString();
              route.__unnamed = true;
            }

            if (route.method) {
              route.method = route.method.toLowerCase();
            }

            return route;
          };

          const getFunctionMatcher = route => {
            if (typeof route.matcher === "function") {
              const matcher = route.matcher;
              return (req, [url, options]) => matcher(url, options);
            } else {
              return () => true;
            }
          };

          const generateMatcher = (route, config) => {
            const matchers = [
              getQueryStringMatcher(route),
              getMethodMatcher(route),
              getHeaderMatcher(route, config.Headers),
              getUrlMatcher(route),
              getFunctionMatcher(route)
            ];

            return (url, options) => {
              const req = normalizeRequest(url, options, config.Request);
              return matchers.every(matcher => matcher(req, [url, options]));
            };
          };

          const limitMatcher = route => {
            if (!route.repeat) {
              return;
            }

            const matcher = route.matcher;
            let timesLeft = route.repeat;
            route.matcher = (url, options) => {
              const match = timesLeft && matcher(url, options);
              if (match) {
                timesLeft--;
                return true;
              }
            };
            route.reset = () => (timesLeft = route.repeat);
          };

          module.exports = function(route) {
            route = sanitizeRoute(route);

            route.matcher = generateMatcher(route, this.config);

            limitMatcher(route);

            return route;
          };
        },
        { "glob-to-regexp": 9, "path-to-regexp": 11, querystring: 15, url: 16 }
      ],
      3: [
        function(require, module, exports) {
          function _asyncToGenerator(fn) {
            return function() {
              var gen = fn.apply(this, arguments);
              return new Promise(function(resolve, reject) {
                function step(key, arg) {
                  try {
                    var info = gen[key](arg);
                    var value = info.value;
                  } catch (error) {
                    reject(error);
                    return;
                  }
                  if (info.done) {
                    resolve(value);
                  } else {
                    return Promise.resolve(value).then(
                      function(value) {
                        step("next", value);
                      },
                      function(err) {
                        step("throw", err);
                      }
                    );
                  }
                }
                return step("next");
              });
            };
          }

          const ResponseBuilder = require("./response-builder");

          const FetchMock = {};

          FetchMock.fetchHandler = function(url, opts) {
            let response = this.executeRouter(url, opts);

            // If the response says to throw an error, throw it
            // It only makes sense to do this before doing any async stuff below
            // as the async stuff swallows catastrophic errors in a promise
            // Type checking is to deal with sinon spies having a throws property :-0
            if (response.throws && typeof response !== "function") {
              throw response.throws;
            }

            // this is used to power the .flush() method
            let done;
            this._holdingPromises.push(
              new this.config.Promise(res => (done = res))
            );

            // wrapped in this promise to make sure we respect custom Promise
            // constructors defined by the user
            return new this.config.Promise((res, rej) => {
              this.generateResponse(response, url, opts)
                .then(res, rej)
                .then(done, done);
            });
          };

          FetchMock.fetchHandler.isMock = true;

          FetchMock.executeRouter = function(url, opts) {
            let response = this.router(url, opts);

            if (response) {
              return response;
            }

            if (this.config.warnOnFallback) {
              console.warn(
                `Unmatched ${(opts && opts.method) || "GET"} to ${url}`
              ); // eslint-disable-line
            }

            this.push(null, [url, opts]);

            if (this.fallbackResponse) {
              return this.fallbackResponse;
            }

            if (!this.config.fallbackToNetwork) {
              throw new Error(
                `No fallback response defined for ${(opts && opts.method) ||
                  "GET"} to ${url}`
              );
            }

            return this.getNativeFetch();
          };

          FetchMock.generateResponse = (() => {
            var _ref = _asyncToGenerator(function*(response, url, opts) {
              // We want to allow things like
              // - function returning a Promise for a response
              // - delaying (using a timeout Promise) a function's execution to generate
              //   a response
              // Because of this we can't safely check for function before Promisey-ness,
              // or vice versa. So to keep it DRY, and flexible, we keep trying until we
              // have something that looks like neither Promise nor function
              while (
                typeof response === "function" ||
                typeof response.then === "function"
              ) {
                if (typeof response === "function") {
                  response = response(url, opts);
                } else {
                  // Strange .then is to cope with non ES Promises... god knows why it works
                  response = yield response.then(function(it) {
                    return it;
                  });
                }
              }

              // If the response is a pre-made Response, respond with it
              if (this.config.Response.prototype.isPrototypeOf(response)) {
                return response;
              }

              // finally, if we need to convert config into a response, we do it
              return new ResponseBuilder(url, response, this).exec();
            });

            return function(_x, _x2, _x3) {
              return _ref.apply(this, arguments);
            };
          })();

          FetchMock.router = function(url, opts) {
            const route = this.routes.find(route => route.matcher(url, opts));

            if (route) {
              this.push(route.name, [url, opts]);
              return route.response;
            }
          };

          FetchMock.getNativeFetch = function() {
            const func =
              this.realFetch || (this.isSandbox && this.config.fetch);
            if (!func) {
              throw new Error(
                "Falling back to network only available on gloabl fetch-mock, or by setting config.fetch on sandboxed fetch-mock"
              );
            }
            return func;
          };

          FetchMock.push = function(name, args) {
            if (name) {
              this._calls[name] = this._calls[name] || [];
              this._calls[name].push(args);
              this._allCalls.push(args);
            } else {
              args.unmatched = true;
              this._allCalls.push(args);
            }
          };

          module.exports = FetchMock;
        },
        { "./response-builder": 6 }
      ],
      4: [
        function(require, module, exports) {
          var _extends =
            Object.assign ||
            function(target) {
              for (var i = 1; i < arguments.length; i++) {
                var source = arguments[i];
                for (var key in source) {
                  if (Object.prototype.hasOwnProperty.call(source, key)) {
                    target[key] = source[key];
                  }
                }
              }
              return target;
            };

          const setUpAndTearDown = require("./set-up-and-tear-down");
          const fetchHandler = require("./fetch-handler");
          const inspecting = require("./inspecting");

          const FetchMock = _extends(
            {},
            fetchHandler,
            setUpAndTearDown,
            inspecting
          );

          FetchMock.config = {
            fallbackToNetwork: false,
            includeContentLength: true,
            sendAsJson: true,
            warnOnFallback: true,
            overwriteRoutes: undefined
          };

          FetchMock.createInstance = function() {
            const instance = Object.create(FetchMock);
            instance.routes = (this.routes || []).slice();
            instance.fallbackResponse = this.fallbackResponse || undefined;
            instance.config = _extends({}, this.config || FetchMock.config);
            instance._calls = {};
            instance._allCalls = [];
            instance._holdingPromises = [];
            instance.bindMethods();
            return instance;
          };

          FetchMock.bindMethods = function() {
            this.fetchHandler = FetchMock.fetchHandler.bind(this);
            this.restore = FetchMock.restore.bind(this);
            this.reset = FetchMock.reset.bind(this);
          };

          FetchMock.sandbox = function() {
            // this construct allows us to create a fetch-mock instance which is also
            // a callable function, while circumventing circularity when defining the
            // object that this function should be bound to
            const proxy = (url, options) => sandbox.fetchHandler(url, options);

            const sandbox = _extends(
              proxy, // Ensures that the entire returned object is a callable function
              FetchMock, // prototype methods
              this.createInstance() // instance data
            );

            sandbox.bindMethods();
            sandbox.isSandbox = true;
            return sandbox;
          };

          module.exports = FetchMock;
        },
        { "./fetch-handler": 3, "./inspecting": 5, "./set-up-and-tear-down": 7 }
      ],
      5: [
        function(require, module, exports) {
          const FetchMock = {};

          FetchMock.callsFilteredByName = function(name) {
            if (name === true) {
              return this._allCalls.filter(call => !call.unmatched);
            }
            if (name === false) {
              return this._allCalls.filter(call => call.unmatched);
            }

            if (typeof name === "undefined") {
              return this._allCalls;
            }

            if (this._calls[name]) {
              return this._calls[name];
            }
            return this._allCalls.filter(
              ([url]) => url === name || url.url === name
            );
          };

          FetchMock.calls = function(name, options = {}) {
            if (typeof options === "string") {
              options = { method: options };
            }

            let calls = this.callsFilteredByName(name);

            if (options.method) {
              const testMethod = options.method.toLowerCase();
              calls = calls.filter(([url, opts = {}]) => {
                const method = (
                  url.method ||
                  opts.method ||
                  "get"
                ).toLowerCase();
                return method === testMethod;
              });
            }
            return calls;
          };

          FetchMock.lastCall = function(name, options) {
            return [...this.calls(name, options)].pop();
          };

          FetchMock.normalizeLastCall = function(name, options) {
            const call = this.lastCall(name, options) || [];
            if (this.config.Request.prototype.isPrototypeOf(call[0])) {
              return [call[0].url, call[0]];
            }
            return call;
          };

          FetchMock.lastUrl = function(name, options) {
            return this.normalizeLastCall(name, options)[0];
          };

          FetchMock.lastOptions = function(name, options) {
            return this.normalizeLastCall(name, options)[1];
          };

          FetchMock.called = function(name, options) {
            return !!this.calls(name, options).length;
          };

          FetchMock.flush = function() {
            return Promise.all(this._holdingPromises);
          };

          FetchMock.done = function(name) {
            const names =
              name && typeof name !== "boolean"
                ? [name]
                : this.routes.map(r => r.name);

            // Can't use array.every because
            // a) not widely supported
            // b) would exit after first failure, which would break the logging
            return (
              names
                .map(name => {
                  if (!this.called(name)) {
                    console.warn(`Warning: ${name} not called`); // eslint-disable-line
                    return false;
                  }
                  // would use array.find... but again not so widely supported
                  const expectedTimes = (this.routes.filter(
                    r => r.name === name
                  ) || [{}])[0].repeat;

                  if (!expectedTimes) {
                    return true;
                  }

                  const actualTimes = this.calls(name).length;
                  if (expectedTimes > actualTimes) {
                    console.warn(
                      `Warning: ${name} only called ${actualTimes} times, but ${expectedTimes} expected`
                    ); // eslint-disable-line
                    return false;
                  } else {
                    return true;
                  }
                })
                .filter(bool => !bool).length === 0
            );
          };

          module.exports = FetchMock;
        },
        {}
      ],
      6: [
        function(require, module, exports) {
          const responseConfigProps = [
            "body",
            "headers",
            "throws",
            "status",
            "redirectUrl",
            "includeContentLength",
            "sendAsJson"
          ];

          module.exports = class ResponseBuilder {
            constructor(url, responseConfig, fetchMock) {
              this.url = url;
              this.responseConfig = responseConfig;
              this.fetchMockConfig = fetchMock.config;
              this.statusTextMap = fetchMock.statusTextMap;
              this.Response = fetchMock.config.Response;
              this.Headers = fetchMock.config.Headers;
            }

            exec() {
              this.normalizeResponseConfig();
              this.constructFetchOpts();
              this.constructResponseBody();
              return this.redirect(new this.Response(this.body, this.opts));
            }

            sendAsObject() {
              if (responseConfigProps.some(prop => this.responseConfig[prop])) {
                if (
                  Object.keys(this.responseConfig).every(key =>
                    responseConfigProps.includes(key)
                  )
                ) {
                  return false;
                } else {
                  return true;
                }
              } else {
                return true;
              }
            }

            normalizeResponseConfig() {
              // If the response config looks like a status, start to generate a simple response
              if (typeof this.responseConfig === "number") {
                this.responseConfig = {
                  status: this.responseConfig
                };
                // If the response config is not an object, or is an object that doesn't use
                // any reserved properties, assume it is meant to be the body of the response
              } else if (
                typeof this.responseConfig === "string" ||
                this.sendAsObject()
              ) {
                this.responseConfig = {
                  body: this.responseConfig
                };
              }
            }

            validateStatus(status) {
              if (!status) {
                return 200;
              }

              if (
                (typeof status === "number" &&
                  parseInt(status, 10) !== status &&
                  status >= 200) ||
                status < 600
              ) {
                return status;
              }

              throw new TypeError(`Invalid status ${status} passed on response object.
To respond with a JSON object that has status as a property assign the object to body
e.g. {"body": {"status: "registered"}}`);
            }

            constructFetchOpts() {
              this.opts = this.responseConfig.opts || {};
              this.opts.url = this.responseConfig.redirectUrl || this.url;
              this.opts.status = this.validateStatus(
                this.responseConfig.status
              );
              this.opts.statusText = this.statusTextMap["" + this.opts.status];
              // Set up response headers. The empty object is to cope with
              // new Headers(undefined) throwing in Chrome
              // https://code.google.com/p/chromium/issues/detail?id=335871
              this.opts.headers = new this.Headers(
                this.responseConfig.headers || {}
              );
            }

            getOption(name) {
              return this.responseConfig[name] === undefined
                ? this.fetchMockConfig[name]
                : this.responseConfig[name];
            }

            constructResponseBody() {
              // start to construct the body
              let body = this.responseConfig.body;

              // convert to json if we need to
              if (
                this.getOption("sendAsJson") &&
                this.responseConfig.body != null &&
                typeof body === "object"
              ) {
                //eslint-disable-line
                body = JSON.stringify(body);
                if (!this.opts.headers.has("Content-Type")) {
                  this.opts.headers.set("Content-Type", "application/json");
                }
              }

              // add a Content-Length header if we need to
              if (
                this.getOption("includeContentLength") &&
                typeof body === "string" &&
                !this.opts.headers.has("Content-Length")
              ) {
                this.opts.headers.set("Content-Length", body.length.toString());
              }

              // On the server we need to manually construct the readable stream for the
              // Response object (on the client this done automatically)
              if (this.stream) {
                let s = new this.stream.Readable();
                if (body != null) {
                  //eslint-disable-line
                  s.push(body, "utf-8");
                }
                s.push(null);
                body = s;
              }
              this.body = body;
            }

            redirect(response) {
              // When mocking a followed redirect we must wrap the response in an object
              // which sets the redirected flag (not a writable property on the actual
              // response)
              if (this.responseConfig.redirectUrl) {
                response = Object.create(response, {
                  redirected: {
                    value: true
                  },
                  url: {
                    value: this.responseConfig.redirectUrl
                  },
                  // TODO extend to all other methods and properties as requested by users
                  // Such a nasty hack
                  text: {
                    value: response.text.bind(response)
                  },
                  json: {
                    value: response.json.bind(response)
                  }
                });
              }

              return response;
            }
          };
        },
        {}
      ],
      7: [
        function(require, module, exports) {
          var _extends =
            Object.assign ||
            function(target) {
              for (var i = 1; i < arguments.length; i++) {
                var source = arguments[i];
                for (var key in source) {
                  if (Object.prototype.hasOwnProperty.call(source, key)) {
                    target[key] = source[key];
                  }
                }
              }
              return target;
            };

          const compileRoute = require("./compile-route");
          const FetchMock = {};

          FetchMock.mock = function(matcher, response, options = {}) {
            let route;

            // Handle the variety of parameters accepted by mock (see README)
            if (matcher && response) {
              route = _extends(
                {
                  matcher,
                  response
                },
                options
              );
            } else if (matcher && matcher.matcher) {
              route = matcher;
            } else {
              throw new Error("Invalid parameters passed to fetch-mock");
            }

            this.addRoute(route);

            return this._mock();
          };

          const getMatcher = (route, propName) => route2 =>
            route[propName] === route2[propName];

          FetchMock.addRoute = function(route) {
            route = this.compileRoute(route);

            const clashes = this.routes.filter(getMatcher(route, "name"));
            const overwriteRoutes =
              "overwriteRoutes" in route
                ? route.overwriteRoutes
                : this.config.overwriteRoutes;

            if (overwriteRoutes === false || !clashes.length) {
              return this.routes.push(route);
            }

            const methodsMatch = getMatcher(route, "method");

            if (overwriteRoutes === true) {
              return this.routes.splice(
                this.routes.indexOf(clashes.find(methodsMatch)),
                1,
                route
              );
            }

            if (
              clashes.some(
                existingRoute => !route.method || methodsMatch(existingRoute)
              )
            ) {
              throw new Error(
                "Adding route with same name as existing route. See `overwriteRoutes` option."
              );
            }

            this.routes.push(route);
          };

          FetchMock._mock = function() {
            if (!this.isSandbox) {
              // Do this here rather than in the constructor to ensure it's scoped to the test
              this.realFetch = this.realFetch || this.global.fetch;
              this.global.fetch = this.fetchHandler;
            }
            return this;
          };

          FetchMock.catch = function(response) {
            if (this.fallbackResponse) {
              console.warn(
                "calling fetchMock.catch() twice - are you sure you want to overwrite the previous fallback response"
              ); // eslint-disable-line
            }
            this.fallbackResponse = response || "ok";
            return this._mock();
          };

          FetchMock.spy = function() {
            this._mock();
            return this.catch(this.getNativeFetch());
          };

          FetchMock.compileRoute = compileRoute;

          FetchMock.once = function(matcher, response, options = {}) {
            return this.mock(
              matcher,
              response,
              _extends({}, options, { repeat: 1 })
            );
          };

          ["get", "post", "put", "delete", "head", "patch"].forEach(method => {
            FetchMock[method] = function(matcher, response, options = {}) {
              return this.mock(
                matcher,
                response,
                _extends({}, options, { method: method.toUpperCase() })
              );
            };
            FetchMock[`${method}Once`] = function(
              matcher,
              response,
              options = {}
            ) {
              return this.once(
                matcher,
                response,
                _extends({}, options, { method: method.toUpperCase() })
              );
            };
          });

          FetchMock.restore = function() {
            if (this.realFetch) {
              this.global.fetch = this.realFetch;
              this.realFetch = undefined;
            }
            this.fallbackResponse = undefined;
            this.routes = [];
            this.reset();
            return this;
          };

          FetchMock.reset = function() {
            this._calls = {};
            this._allCalls = [];
            this._holdingPromises = [];
            this.routes.forEach(route => route.reset && route.reset());
            return this;
          };

          module.exports = FetchMock;
        },
        { "./compile-route": 2 }
      ],
      8: [
        function(require, module, exports) {
          "use strict";

          const statusTextMap = {
            "100": "Continue",
            "101": "Switching Protocols",
            "102": "Processing",
            "200": "OK",
            "201": "Created",
            "202": "Accepted",
            "203": "Non-Authoritative Information",
            "204": "No Content",
            "205": "Reset Content",
            "206": "Partial Content",
            "207": "Multi-Status",
            "208": "Already Reported",
            "226": "IM Used",
            "300": "Multiple Choices",
            "301": "Moved Permanently",
            "302": "Found",
            "303": "See Other",
            "304": "Not Modified",
            "305": "Use Proxy",
            "307": "Temporary Redirect",
            "308": "Permanent Redirect",
            "400": "Bad Request",
            "401": "Unauthorized",
            "402": "Payment Required",
            "403": "Forbidden",
            "404": "Not Found",
            "405": "Method Not Allowed",
            "406": "Not Acceptable",
            "407": "Proxy Authentication Required",
            "408": "Request Timeout",
            "409": "Conflict",
            "410": "Gone",
            "411": "Length Required",
            "412": "Precondition Failed",
            "413": "Payload Too Large",
            "414": "URI Too Long",
            "415": "Unsupported Media Type",
            "416": "Range Not Satisfiable",
            "417": "Expectation Failed",
            "418": "I'm a teapot",
            "421": "Misdirected Request",
            "422": "Unprocessable Entity",
            "423": "Locked",
            "424": "Failed Dependency",
            "425": "Unordered Collection",
            "426": "Upgrade Required",
            "428": "Precondition Required",
            "429": "Too Many Requests",
            "431": "Request Header Fields Too Large",
            "451": "Unavailable For Legal Reasons",
            "500": "Internal Server Error",
            "501": "Not Implemented",
            "502": "Bad Gateway",
            "503": "Service Unavailable",
            "504": "Gateway Timeout",
            "505": "HTTP Version Not Supported",
            "506": "Variant Also Negotiates",
            "507": "Insufficient Storage",
            "508": "Loop Detected",
            "509": "Bandwidth Limit Exceeded",
            "510": "Not Extended",
            "511": "Network Authentication Required"
          };

          module.exports = statusTextMap;
        },
        {}
      ],
      9: [
        function(require, module, exports) {
          module.exports = function(glob, opts) {
            if (typeof glob !== "string") {
              throw new TypeError("Expected a string");
            }

            var str = String(glob);

            // The regexp we are building, as a string.
            var reStr = "";

            // Whether we are matching so called "extended" globs (like bash) and should
            // support single character matching, matching ranges of characters, group
            // matching, etc.
            var extended = opts ? !!opts.extended : false;

            // When globstar is _false_ (default), '/foo/*' is translated a regexp like
            // '^\/foo\/.*$' which will match any string beginning with '/foo/'
            // When globstar is _true_, '/foo/*' is translated to regexp like
            // '^\/foo\/[^/]*$' which will match any string beginning with '/foo/' BUT
            // which does not have a '/' to the right of it.
            // E.g. with '/foo/*' these will match: '/foo/bar', '/foo/bar.txt' but
            // these will not '/foo/bar/baz', '/foo/bar/baz.txt'
            // Lastely, when globstar is _true_, '/foo/**' is equivelant to '/foo/*' when
            // globstar is _false_
            var globstar = opts ? !!opts.globstar : false;

            // If we are doing extended matching, this boolean is true when we are inside
            // a group (eg {*.html,*.js}), and false otherwise.
            var inGroup = false;

            // RegExp flags (eg "i" ) to pass in to RegExp constructor.
            var flags =
              opts && typeof opts.flags === "string" ? opts.flags : "";

            var c;
            for (var i = 0, len = str.length; i < len; i++) {
              c = str[i];

              switch (c) {
                case "\\":
                case "/":
                case "$":
                case "^":
                case "+":
                case ".":
                case "(":
                case ")":
                case "=":
                case "!":
                case "|":
                  reStr += "\\" + c;
                  break;

                case "?":
                  if (extended) {
                    reStr += ".";
                    break;
                  }

                case "[":
                case "]":
                  if (extended) {
                    reStr += c;
                    break;
                  }

                case "{":
                  if (extended) {
                    inGroup = true;
                    reStr += "(";
                    break;
                  }

                case "}":
                  if (extended) {
                    inGroup = false;
                    reStr += ")";
                    break;
                  }

                case ",":
                  if (inGroup) {
                    reStr += "|";
                    break;
                  }
                  reStr += "\\" + c;
                  break;

                case "*":
                  // Move over all consecutive "*"'s.
                  // Also store the previous and next characters
                  var prevChar = str[i - 1];
                  var starCount = 1;
                  while (str[i + 1] === "*") {
                    starCount++;
                    i++;
                  }
                  var nextChar = str[i + 1];

                  if (!globstar) {
                    // globstar is disabled, so treat any number of "*" as one
                    reStr += ".*";
                  } else {
                    // globstar is enabled, so determine if this is a globstar segment
                    var isGlobstar =
                      starCount > 1 && // multiple "*"'s
                      (prevChar === "/" || prevChar === undefined) && // from the start of the segment
                      (nextChar === "/" || nextChar === undefined); // to the end of the segment

                    if (isGlobstar) {
                      // it's a globstar, so match zero or more path segments
                      reStr += "(?:[^/]*(?:/|$))*";
                      i++; // move over the "/"
                    } else {
                      // it's not a globstar, so only match one path segment
                      reStr += "[^/]*";
                    }
                  }
                  break;

                default:
                  reStr += c;
              }
            }

            // When regexp 'g' flag is specified don't
            // constrain the regular expression with ^ & $
            if (!flags || !~flags.indexOf("g")) {
              reStr = "^" + reStr + "$";
            }

            return new RegExp(reStr, flags);
          };
        },
        {}
      ],
      10: [
        function(require, module, exports) {
          module.exports =
            Array.isArray ||
            function(arr) {
              return Object.prototype.toString.call(arr) == "[object Array]";
            };
        },
        {}
      ],
      11: [
        function(require, module, exports) {
          var isarray = require("isarray");

          /**
           * Expose `pathToRegexp`.
           */
          module.exports = pathToRegexp;
          module.exports.parse = parse;
          module.exports.compile = compile;
          module.exports.tokensToFunction = tokensToFunction;
          module.exports.tokensToRegExp = tokensToRegExp;

          /**
           * The main path matching regexp utility.
           *
           * @type {RegExp}
           */
          var PATH_REGEXP = new RegExp(
            [
              // Match escaped characters that would otherwise appear in future matches.
              // This allows the user to escape special characters that won't transform.
              "(\\\\.)",
              // Match Express-style parameters and un-named parameters with a prefix
              // and optional suffixes. Matches appear as:
              //
              // "/:test(\\d+)?" => ["/", "test", "\d+", undefined, "?", undefined]
              // "/route(\\d+)"  => [undefined, undefined, undefined, "\d+", undefined, undefined]
              // "/*"            => ["/", undefined, undefined, undefined, undefined, "*"]
              "([\\/.])?(?:(?:\\:(\\w+)(?:\\(((?:\\\\.|[^\\\\()])+)\\))?|\\(((?:\\\\.|[^\\\\()])+)\\))([+*?])?|(\\*))"
            ].join("|"),
            "g"
          );

          /**
           * Parse a string for the raw tokens.
           *
           * @param  {string}  str
           * @param  {Object=} options
           * @return {!Array}
           */
          function parse(str, options) {
            var tokens = [];
            var key = 0;
            var index = 0;
            var path = "";
            var defaultDelimiter = (options && options.delimiter) || "/";
            var res;

            while ((res = PATH_REGEXP.exec(str)) != null) {
              var m = res[0];
              var escaped = res[1];
              var offset = res.index;
              path += str.slice(index, offset);
              index = offset + m.length;

              // Ignore already escaped sequences.
              if (escaped) {
                path += escaped[1];
                continue;
              }

              var next = str[index];
              var prefix = res[2];
              var name = res[3];
              var capture = res[4];
              var group = res[5];
              var modifier = res[6];
              var asterisk = res[7];

              // Push the current path onto the tokens.
              if (path) {
                tokens.push(path);
                path = "";
              }

              var partial = prefix != null && next != null && next !== prefix;
              var repeat = modifier === "+" || modifier === "*";
              var optional = modifier === "?" || modifier === "*";
              var delimiter = res[2] || defaultDelimiter;
              var pattern = capture || group;

              tokens.push({
                name: name || key++,
                prefix: prefix || "",
                delimiter: delimiter,
                optional: optional,
                repeat: repeat,
                partial: partial,
                asterisk: !!asterisk,
                pattern: pattern
                  ? escapeGroup(pattern)
                  : asterisk ? ".*" : "[^" + escapeString(delimiter) + "]+?"
              });
            }

            // Match any characters still remaining.
            if (index < str.length) {
              path += str.substr(index);
            }

            // If the path exists, push it onto the end.
            if (path) {
              tokens.push(path);
            }

            return tokens;
          }

          /**
           * Compile a string to a template function for the path.
           *
           * @param  {string}             str
           * @param  {Object=}            options
           * @return {!function(Object=, Object=)}
           */
          function compile(str, options) {
            return tokensToFunction(parse(str, options));
          }

          /**
           * Prettier encoding of URI path segments.
           *
           * @param  {string}
           * @return {string}
           */
          function encodeURIComponentPretty(str) {
            return encodeURI(str).replace(/[\/?#]/g, function(c) {
              return (
                "%" +
                c
                  .charCodeAt(0)
                  .toString(16)
                  .toUpperCase()
              );
            });
          }

          /**
           * Encode the asterisk parameter. Similar to `pretty`, but allows slashes.
           *
           * @param  {string}
           * @return {string}
           */
          function encodeAsterisk(str) {
            return encodeURI(str).replace(/[?#]/g, function(c) {
              return (
                "%" +
                c
                  .charCodeAt(0)
                  .toString(16)
                  .toUpperCase()
              );
            });
          }

          /**
           * Expose a method for transforming tokens into the path function.
           */
          function tokensToFunction(tokens) {
            // Compile all the tokens into regexps.
            var matches = new Array(tokens.length);

            // Compile all the patterns before compilation.
            for (var i = 0; i < tokens.length; i++) {
              if (typeof tokens[i] === "object") {
                matches[i] = new RegExp("^(?:" + tokens[i].pattern + ")$");
              }
            }

            return function(obj, opts) {
              var path = "";
              var data = obj || {};
              var options = opts || {};
              var encode = options.pretty
                ? encodeURIComponentPretty
                : encodeURIComponent;

              for (var i = 0; i < tokens.length; i++) {
                var token = tokens[i];

                if (typeof token === "string") {
                  path += token;

                  continue;
                }

                var value = data[token.name];
                var segment;

                if (value == null) {
                  if (token.optional) {
                    // Prepend partial segment prefixes.
                    if (token.partial) {
                      path += token.prefix;
                    }

                    continue;
                  } else {
                    throw new TypeError(
                      'Expected "' + token.name + '" to be defined'
                    );
                  }
                }

                if (isarray(value)) {
                  if (!token.repeat) {
                    throw new TypeError(
                      'Expected "' +
                        token.name +
                        '" to not repeat, but received `' +
                        JSON.stringify(value) +
                        "`"
                    );
                  }

                  if (value.length === 0) {
                    if (token.optional) {
                      continue;
                    } else {
                      throw new TypeError(
                        'Expected "' + token.name + '" to not be empty'
                      );
                    }
                  }

                  for (var j = 0; j < value.length; j++) {
                    segment = encode(value[j]);

                    if (!matches[i].test(segment)) {
                      throw new TypeError(
                        'Expected all "' +
                          token.name +
                          '" to match "' +
                          token.pattern +
                          '", but received `' +
                          JSON.stringify(segment) +
                          "`"
                      );
                    }

                    path +=
                      (j === 0 ? token.prefix : token.delimiter) + segment;
                  }

                  continue;
                }

                segment = token.asterisk
                  ? encodeAsterisk(value)
                  : encode(value);

                if (!matches[i].test(segment)) {
                  throw new TypeError(
                    'Expected "' +
                      token.name +
                      '" to match "' +
                      token.pattern +
                      '", but received "' +
                      segment +
                      '"'
                  );
                }

                path += token.prefix + segment;
              }

              return path;
            };
          }

          /**
           * Escape a regular expression string.
           *
           * @param  {string} str
           * @return {string}
           */
          function escapeString(str) {
            return str.replace(/([.+*?=^!:${}()[\]|\/\\])/g, "\\$1");
          }

          /**
           * Escape the capturing group by escaping special characters and meaning.
           *
           * @param  {string} group
           * @return {string}
           */
          function escapeGroup(group) {
            return group.replace(/([=!:$\/()])/g, "\\$1");
          }

          /**
           * Attach the keys as a property of the regexp.
           *
           * @param  {!RegExp} re
           * @param  {Array}   keys
           * @return {!RegExp}
           */
          function attachKeys(re, keys) {
            re.keys = keys;
            return re;
          }

          /**
           * Get the flags for a regexp from the options.
           *
           * @param  {Object} options
           * @return {string}
           */
          function flags(options) {
            return options.sensitive ? "" : "i";
          }

          /**
           * Pull out keys from a regexp.
           *
           * @param  {!RegExp} path
           * @param  {!Array}  keys
           * @return {!RegExp}
           */
          function regexpToRegexp(path, keys) {
            // Use a negative lookahead to match only capturing groups.
            var groups = path.source.match(/\((?!\?)/g);

            if (groups) {
              for (var i = 0; i < groups.length; i++) {
                keys.push({
                  name: i,
                  prefix: null,
                  delimiter: null,
                  optional: false,
                  repeat: false,
                  partial: false,
                  asterisk: false,
                  pattern: null
                });
              }
            }

            return attachKeys(path, keys);
          }

          /**
           * Transform an array into a regexp.
           *
           * @param  {!Array}  path
           * @param  {Array}   keys
           * @param  {!Object} options
           * @return {!RegExp}
           */
          function arrayToRegexp(path, keys, options) {
            var parts = [];

            for (var i = 0; i < path.length; i++) {
              parts.push(pathToRegexp(path[i], keys, options).source);
            }

            var regexp = new RegExp(
              "(?:" + parts.join("|") + ")",
              flags(options)
            );

            return attachKeys(regexp, keys);
          }

          /**
           * Create a path regexp from string input.
           *
           * @param  {string}  path
           * @param  {!Array}  keys
           * @param  {!Object} options
           * @return {!RegExp}
           */
          function stringToRegexp(path, keys, options) {
            return tokensToRegExp(parse(path, options), keys, options);
          }

          /**
           * Expose a function for taking tokens and returning a RegExp.
           *
           * @param  {!Array}          tokens
           * @param  {(Array|Object)=} keys
           * @param  {Object=}         options
           * @return {!RegExp}
           */
          function tokensToRegExp(tokens, keys, options) {
            if (!isarray(keys)) {
              options = /** @type {!Object} */ (keys || options);
              keys = [];
            }

            options = options || {};

            var strict = options.strict;
            var end = options.end !== false;
            var route = "";

            // Iterate over the tokens and create our regexp string.
            for (var i = 0; i < tokens.length; i++) {
              var token = tokens[i];

              if (typeof token === "string") {
                route += escapeString(token);
              } else {
                var prefix = escapeString(token.prefix);
                var capture = "(?:" + token.pattern + ")";

                keys.push(token);

                if (token.repeat) {
                  capture += "(?:" + prefix + capture + ")*";
                }

                if (token.optional) {
                  if (!token.partial) {
                    capture = "(?:" + prefix + "(" + capture + "))?";
                  } else {
                    capture = prefix + "(" + capture + ")?";
                  }
                } else {
                  capture = prefix + "(" + capture + ")";
                }

                route += capture;
              }
            }

            var delimiter = escapeString(options.delimiter || "/");
            var endsWithDelimiter =
              route.slice(-delimiter.length) === delimiter;

            // In non-strict mode we allow a slash at the end of match. If the path to
            // match already ends with a slash, we remove it for consistency. The slash
            // is valid at the end of a path match, not in the middle. This is important
            // in non-ending mode, where "/test/" shouldn't match "/test//route".
            if (!strict) {
              route =
                (endsWithDelimiter
                  ? route.slice(0, -delimiter.length)
                  : route) +
                "(?:" +
                delimiter +
                "(?=$))?";
            }

            if (end) {
              route += "$";
            } else {
              // In non-ending mode, we need the capturing groups to match as much as
              // possible by using a positive lookahead to the end or next path segment.
              route +=
                strict && endsWithDelimiter ? "" : "(?=" + delimiter + "|$)";
            }

            return attachKeys(new RegExp("^" + route, flags(options)), keys);
          }

          /**
           * Normalize the given path string, returning a regular expression.
           *
           * An empty array can be passed in for the keys, which will hold the
           * placeholder key descriptions. For example, using `/user/:id`, `keys` will
           * contain `[{ name: 'id', delimiter: '/', optional: false, repeat: false }]`.
           *
           * @param  {(string|RegExp|Array)} path
           * @param  {(Array|Object)=}       keys
           * @param  {Object=}               options
           * @return {!RegExp}
           */
          function pathToRegexp(path, keys, options) {
            if (!isarray(keys)) {
              options = /** @type {!Object} */ (keys || options);
              keys = [];
            }

            options = options || {};

            if (path instanceof RegExp) {
              return regexpToRegexp(path, /** @type {!Array} */ (keys));
            }

            if (isarray(path)) {
              return arrayToRegexp(
                /** @type {!Array} */ (path),
                /** @type {!Array} */ (keys),
                options
              );
            }

            return stringToRegexp(
              /** @type {string} */ (path),
              /** @type {!Array} */ (keys),
              options
            );
          }
        },
        { isarray: 10 }
      ],
      12: [
        function(require, module, exports) {
          (function(global) {
            /*! https://mths.be/punycode v1.4.1 by @mathias */
            (function(root) {
              /** Detect free variables */
              var freeExports =
                typeof exports == "object" &&
                exports &&
                !exports.nodeType &&
                exports;
              var freeModule =
                typeof module == "object" &&
                module &&
                !module.nodeType &&
                module;
              var freeGlobal = typeof global == "object" && global;
              if (
                freeGlobal.global === freeGlobal ||
                freeGlobal.window === freeGlobal ||
                freeGlobal.self === freeGlobal
              ) {
                root = freeGlobal;
              }

              /**
               * The `punycode` object.
               * @name punycode
               * @type Object
               */
              var punycode,
                /** Highest positive signed 32-bit float value */
                maxInt = 2147483647, // aka. 0x7FFFFFFF or 2^31-1
                /** Bootstring parameters */
                base = 36,
                tMin = 1,
                tMax = 26,
                skew = 38,
                damp = 700,
                initialBias = 72,
                initialN = 128, // 0x80
                delimiter = "-", // '\x2D'
                /** Regular expressions */
                regexPunycode = /^xn--/,
                regexNonASCII = /[^\x20-\x7E]/, // unprintable ASCII chars + non-ASCII chars
                regexSeparators = /[\x2E\u3002\uFF0E\uFF61]/g, // RFC 3490 separators
                /** Error messages */
                errors = {
                  overflow: "Overflow: input needs wider integers to process",
                  "not-basic": "Illegal input >= 0x80 (not a basic code point)",
                  "invalid-input": "Invalid input"
                },
                /** Convenience shortcuts */
                baseMinusTMin = base - tMin,
                floor = Math.floor,
                stringFromCharCode = String.fromCharCode,
                /** Temporary variable */
                key;

              /*--------------------------------------------------------------------------*/

              /**
               * A generic error utility function.
               * @private
               * @param {String} type The error type.
               * @returns {Error} Throws a `RangeError` with the applicable error message.
               */
              function error(type) {
                throw new RangeError(errors[type]);
              }

              /**
               * A generic `Array#map` utility function.
               * @private
               * @param {Array} array The array to iterate over.
               * @param {Function} callback The function that gets called for every array
               * item.
               * @returns {Array} A new array of values returned by the callback function.
               */
              function map(array, fn) {
                var length = array.length;
                var result = [];
                while (length--) {
                  result[length] = fn(array[length]);
                }
                return result;
              }

              /**
               * A simple `Array#map`-like wrapper to work with domain name strings or email
               * addresses.
               * @private
               * @param {String} domain The domain name or email address.
               * @param {Function} callback The function that gets called for every
               * character.
               * @returns {Array} A new string of characters returned by the callback
               * function.
               */
              function mapDomain(string, fn) {
                var parts = string.split("@");
                var result = "";
                if (parts.length > 1) {
                  // In email addresses, only the domain name should be punycoded. Leave
                  // the local part (i.e. everything up to `@`) intact.
                  result = parts[0] + "@";
                  string = parts[1];
                }
                // Avoid `split(regex)` for IE8 compatibility. See #17.
                string = string.replace(regexSeparators, "\x2E");
                var labels = string.split(".");
                var encoded = map(labels, fn).join(".");
                return result + encoded;
              }

              /**
               * Creates an array containing the numeric code points of each Unicode
               * character in the string. While JavaScript uses UCS-2 internally,
               * this function will convert a pair of surrogate halves (each of which
               * UCS-2 exposes as separate characters) into a single code point,
               * matching UTF-16.
               * @see `punycode.ucs2.encode`
               * @see <https://mathiasbynens.be/notes/javascript-encoding>
               * @memberOf punycode.ucs2
               * @name decode
               * @param {String} string The Unicode input string (UCS-2).
               * @returns {Array} The new array of code points.
               */
              function ucs2decode(string) {
                var output = [],
                  counter = 0,
                  length = string.length,
                  value,
                  extra;
                while (counter < length) {
                  value = string.charCodeAt(counter++);
                  if (value >= 0xd800 && value <= 0xdbff && counter < length) {
                    // high surrogate, and there is a next character
                    extra = string.charCodeAt(counter++);
                    if ((extra & 0xfc00) == 0xdc00) {
                      // low surrogate
                      output.push(
                        ((value & 0x3ff) << 10) + (extra & 0x3ff) + 0x10000
                      );
                    } else {
                      // unmatched surrogate; only append this code unit, in case the next
                      // code unit is the high surrogate of a surrogate pair
                      output.push(value);
                      counter--;
                    }
                  } else {
                    output.push(value);
                  }
                }
                return output;
              }

              /**
               * Creates a string based on an array of numeric code points.
               * @see `punycode.ucs2.decode`
               * @memberOf punycode.ucs2
               * @name encode
               * @param {Array} codePoints The array of numeric code points.
               * @returns {String} The new Unicode string (UCS-2).
               */
              function ucs2encode(array) {
                return map(array, function(value) {
                  var output = "";
                  if (value > 0xffff) {
                    value -= 0x10000;
                    output += stringFromCharCode(
                      ((value >>> 10) & 0x3ff) | 0xd800
                    );
                    value = 0xdc00 | (value & 0x3ff);
                  }
                  output += stringFromCharCode(value);
                  return output;
                }).join("");
              }

              /**
               * Converts a basic code point into a digit/integer.
               * @see `digitToBasic()`
               * @private
               * @param {Number} codePoint The basic numeric code point value.
               * @returns {Number} The numeric value of a basic code point (for use in
               * representing integers) in the range `0` to `base - 1`, or `base` if
               * the code point does not represent a value.
               */
              function basicToDigit(codePoint) {
                if (codePoint - 48 < 10) {
                  return codePoint - 22;
                }
                if (codePoint - 65 < 26) {
                  return codePoint - 65;
                }
                if (codePoint - 97 < 26) {
                  return codePoint - 97;
                }
                return base;
              }

              /**
               * Converts a digit/integer into a basic code point.
               * @see `basicToDigit()`
               * @private
               * @param {Number} digit The numeric value of a basic code point.
               * @returns {Number} The basic code point whose value (when used for
               * representing integers) is `digit`, which needs to be in the range
               * `0` to `base - 1`. If `flag` is non-zero, the uppercase form is
               * used; else, the lowercase form is used. The behavior is undefined
               * if `flag` is non-zero and `digit` has no uppercase form.
               */
              function digitToBasic(digit, flag) {
                //  0..25 map to ASCII a..z or A..Z
                // 26..35 map to ASCII 0..9
                return digit + 22 + 75 * (digit < 26) - ((flag != 0) << 5);
              }

              /**
               * Bias adaptation function as per section 3.4 of RFC 3492.
               * https://tools.ietf.org/html/rfc3492#section-3.4
               * @private
               */
              function adapt(delta, numPoints, firstTime) {
                var k = 0;
                delta = firstTime ? floor(delta / damp) : delta >> 1;
                delta += floor(delta / numPoints);
                for (
                  ;
                  /* no initialization */ delta > (baseMinusTMin * tMax) >> 1;
                  k += base
                ) {
                  delta = floor(delta / baseMinusTMin);
                }
                return floor(k + (baseMinusTMin + 1) * delta / (delta + skew));
              }

              /**
               * Converts a Punycode string of ASCII-only symbols to a string of Unicode
               * symbols.
               * @memberOf punycode
               * @param {String} input The Punycode string of ASCII-only symbols.
               * @returns {String} The resulting string of Unicode symbols.
               */
              function decode(input) {
                // Don't use UCS-2
                var output = [],
                  inputLength = input.length,
                  out,
                  i = 0,
                  n = initialN,
                  bias = initialBias,
                  basic,
                  j,
                  index,
                  oldi,
                  w,
                  k,
                  digit,
                  t,
                  /** Cached calculation results */
                  baseMinusT;

                // Handle the basic code points: let `basic` be the number of input code
                // points before the last delimiter, or `0` if there is none, then copy
                // the first basic code points to the output.

                basic = input.lastIndexOf(delimiter);
                if (basic < 0) {
                  basic = 0;
                }

                for (j = 0; j < basic; ++j) {
                  // if it's not a basic code point
                  if (input.charCodeAt(j) >= 0x80) {
                    error("not-basic");
                  }
                  output.push(input.charCodeAt(j));
                }

                // Main decoding loop: start just after the last delimiter if any basic code
                // points were copied; start at the beginning otherwise.

                for (
                  index = basic > 0 ? basic + 1 : 0;
                  index < inputLength /* no final expression */;

                ) {
                  // `index` is the index of the next character to be consumed.
                  // Decode a generalized variable-length integer into `delta`,
                  // which gets added to `i`. The overflow checking is easier
                  // if we increase `i` as we go, then subtract off its starting
                  // value at the end to obtain `delta`.
                  for (
                    oldi = i, w = 1, k = base /* no condition */;
                    ;
                    k += base
                  ) {
                    if (index >= inputLength) {
                      error("invalid-input");
                    }

                    digit = basicToDigit(input.charCodeAt(index++));

                    if (digit >= base || digit > floor((maxInt - i) / w)) {
                      error("overflow");
                    }

                    i += digit * w;
                    t = k <= bias ? tMin : k >= bias + tMax ? tMax : k - bias;

                    if (digit < t) {
                      break;
                    }

                    baseMinusT = base - t;
                    if (w > floor(maxInt / baseMinusT)) {
                      error("overflow");
                    }

                    w *= baseMinusT;
                  }

                  out = output.length + 1;
                  bias = adapt(i - oldi, out, oldi == 0);

                  // `i` was supposed to wrap around from `out` to `0`,
                  // incrementing `n` each time, so we'll fix that now:
                  if (floor(i / out) > maxInt - n) {
                    error("overflow");
                  }

                  n += floor(i / out);
                  i %= out;

                  // Insert `n` at position `i` of the output
                  output.splice(i++, 0, n);
                }

                return ucs2encode(output);
              }

              /**
               * Converts a string of Unicode symbols (e.g. a domain name label) to a
               * Punycode string of ASCII-only symbols.
               * @memberOf punycode
               * @param {String} input The string of Unicode symbols.
               * @returns {String} The resulting Punycode string of ASCII-only symbols.
               */
              function encode(input) {
                var n,
                  delta,
                  handledCPCount,
                  basicLength,
                  bias,
                  j,
                  m,
                  q,
                  k,
                  t,
                  currentValue,
                  output = [],
                  /** `inputLength` will hold the number of code points in `input`. */
                  inputLength,
                  /** Cached calculation results */
                  handledCPCountPlusOne,
                  baseMinusT,
                  qMinusT;

                // Convert the input in UCS-2 to Unicode
                input = ucs2decode(input);

                // Cache the length
                inputLength = input.length;

                // Initialize the state
                n = initialN;
                delta = 0;
                bias = initialBias;

                // Handle the basic code points
                for (j = 0; j < inputLength; ++j) {
                  currentValue = input[j];
                  if (currentValue < 0x80) {
                    output.push(stringFromCharCode(currentValue));
                  }
                }

                handledCPCount = basicLength = output.length;

                // `handledCPCount` is the number of code points that have been handled;
                // `basicLength` is the number of basic code points.

                // Finish the basic string - if it is not empty - with a delimiter
                if (basicLength) {
                  output.push(delimiter);
                }

                // Main encoding loop:
                while (handledCPCount < inputLength) {
                  // All non-basic code points < n have been handled already. Find the next
                  // larger one:
                  for (m = maxInt, j = 0; j < inputLength; ++j) {
                    currentValue = input[j];
                    if (currentValue >= n && currentValue < m) {
                      m = currentValue;
                    }
                  }

                  // Increase `delta` enough to advance the decoder's <n,i> state to <m,0>,
                  // but guard against overflow
                  handledCPCountPlusOne = handledCPCount + 1;
                  if (m - n > floor((maxInt - delta) / handledCPCountPlusOne)) {
                    error("overflow");
                  }

                  delta += (m - n) * handledCPCountPlusOne;
                  n = m;

                  for (j = 0; j < inputLength; ++j) {
                    currentValue = input[j];

                    if (currentValue < n && ++delta > maxInt) {
                      error("overflow");
                    }

                    if (currentValue == n) {
                      // Represent delta as a generalized variable-length integer
                      for (
                        q = delta, k = base /* no condition */;
                        ;
                        k += base
                      ) {
                        t =
                          k <= bias ? tMin : k >= bias + tMax ? tMax : k - bias;
                        if (q < t) {
                          break;
                        }
                        qMinusT = q - t;
                        baseMinusT = base - t;
                        output.push(
                          stringFromCharCode(
                            digitToBasic(t + qMinusT % baseMinusT, 0)
                          )
                        );
                        q = floor(qMinusT / baseMinusT);
                      }

                      output.push(stringFromCharCode(digitToBasic(q, 0)));
                      bias = adapt(
                        delta,
                        handledCPCountPlusOne,
                        handledCPCount == basicLength
                      );
                      delta = 0;
                      ++handledCPCount;
                    }
                  }

                  ++delta;
                  ++n;
                }
                return output.join("");
              }

              /**
               * Converts a Punycode string representing a domain name or an email address
               * to Unicode. Only the Punycoded parts of the input will be converted, i.e.
               * it doesn't matter if you call it on a string that has already been
               * converted to Unicode.
               * @memberOf punycode
               * @param {String} input The Punycoded domain name or email address to
               * convert to Unicode.
               * @returns {String} The Unicode representation of the given Punycode
               * string.
               */
              function toUnicode(input) {
                return mapDomain(input, function(string) {
                  return regexPunycode.test(string)
                    ? decode(string.slice(4).toLowerCase())
                    : string;
                });
              }

              /**
               * Converts a Unicode string representing a domain name or an email address to
               * Punycode. Only the non-ASCII parts of the domain name will be converted,
               * i.e. it doesn't matter if you call it with a domain that's already in
               * ASCII.
               * @memberOf punycode
               * @param {String} input The domain name or email address to convert, as a
               * Unicode string.
               * @returns {String} The Punycode representation of the given domain name or
               * email address.
               */
              function toASCII(input) {
                return mapDomain(input, function(string) {
                  return regexNonASCII.test(string)
                    ? "xn--" + encode(string)
                    : string;
                });
              }

              /*--------------------------------------------------------------------------*/

              /** Define the public API */
              punycode = {
                /**
                 * A string representing the current Punycode.js version number.
                 * @memberOf punycode
                 * @type String
                 */
                version: "1.4.1",
                /**
                 * An object of methods to convert from JavaScript's internal character
                 * representation (UCS-2) to Unicode code points, and back.
                 * @see <https://mathiasbynens.be/notes/javascript-encoding>
                 * @memberOf punycode
                 * @type Object
                 */
                ucs2: {
                  decode: ucs2decode,
                  encode: ucs2encode
                },
                decode: decode,
                encode: encode,
                toASCII: toASCII,
                toUnicode: toUnicode
              };

              /** Expose `punycode` */
              // Some AMD build optimizers, like r.js, check for specific condition patterns
              // like the following:
              if (
                typeof define == "function" &&
                typeof define.amd == "object" &&
                define.amd
              ) {
                define("punycode", function() {
                  return punycode;
                });
              } else if (freeExports && freeModule) {
                if (module.exports == freeExports) {
                  // in Node.js, io.js, or RingoJS v0.8.0+
                  freeModule.exports = punycode;
                } else {
                  // in Narwhal or RingoJS v0.7.0-
                  for (key in punycode) {
                    punycode.hasOwnProperty(key) &&
                      (freeExports[key] = punycode[key]);
                  }
                }
              } else {
                // in Rhino or a web browser
                root.punycode = punycode;
              }
            })(this);
          }.call(
            this,
            typeof global !== "undefined"
              ? global
              : typeof self !== "undefined"
                ? self
                : typeof window !== "undefined" ? window : {}
          ));
        },
        {}
      ],
      13: [
        function(require, module, exports) {
          // Copyright Joyent, Inc. and other Node contributors.
          //
          // Permission is hereby granted, free of charge, to any person obtaining a
          // copy of this software and associated documentation files (the
          // "Software"), to deal in the Software without restriction, including
          // without limitation the rights to use, copy, modify, merge, publish,
          // distribute, sublicense, and/or sell copies of the Software, and to permit
          // persons to whom the Software is furnished to do so, subject to the
          // following conditions:
          //
          // The above copyright notice and this permission notice shall be included
          // in all copies or substantial portions of the Software.
          //
          // THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
          // OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
          // MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
          // NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
          // DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
          // OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
          // USE OR OTHER DEALINGS IN THE SOFTWARE.

          "use strict";

          // If obj.hasOwnProperty has been overridden, then calling
          // obj.hasOwnProperty(prop) will break.
          // See: https://github.com/joyent/node/issues/1707
          function hasOwnProperty(obj, prop) {
            return Object.prototype.hasOwnProperty.call(obj, prop);
          }

          module.exports = function(qs, sep, eq, options) {
            sep = sep || "&";
            eq = eq || "=";
            var obj = {};

            if (typeof qs !== "string" || qs.length === 0) {
              return obj;
            }

            var regexp = /\+/g;
            qs = qs.split(sep);

            var maxKeys = 1000;
            if (options && typeof options.maxKeys === "number") {
              maxKeys = options.maxKeys;
            }

            var len = qs.length;
            // maxKeys <= 0 means that we should not limit keys count
            if (maxKeys > 0 && len > maxKeys) {
              len = maxKeys;
            }

            for (var i = 0; i < len; ++i) {
              var x = qs[i].replace(regexp, "%20"),
                idx = x.indexOf(eq),
                kstr,
                vstr,
                k,
                v;

              if (idx >= 0) {
                kstr = x.substr(0, idx);
                vstr = x.substr(idx + 1);
              } else {
                kstr = x;
                vstr = "";
              }

              k = decodeURIComponent(kstr);
              v = decodeURIComponent(vstr);

              if (!hasOwnProperty(obj, k)) {
                obj[k] = v;
              } else if (isArray(obj[k])) {
                obj[k].push(v);
              } else {
                obj[k] = [obj[k], v];
              }
            }

            return obj;
          };

          var isArray =
            Array.isArray ||
            function(xs) {
              return Object.prototype.toString.call(xs) === "[object Array]";
            };
        },
        {}
      ],
      14: [
        function(require, module, exports) {
          // Copyright Joyent, Inc. and other Node contributors.
          //
          // Permission is hereby granted, free of charge, to any person obtaining a
          // copy of this software and associated documentation files (the
          // "Software"), to deal in the Software without restriction, including
          // without limitation the rights to use, copy, modify, merge, publish,
          // distribute, sublicense, and/or sell copies of the Software, and to permit
          // persons to whom the Software is furnished to do so, subject to the
          // following conditions:
          //
          // The above copyright notice and this permission notice shall be included
          // in all copies or substantial portions of the Software.
          //
          // THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
          // OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
          // MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
          // NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
          // DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
          // OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
          // USE OR OTHER DEALINGS IN THE SOFTWARE.

          "use strict";

          var stringifyPrimitive = function(v) {
            switch (typeof v) {
              case "string":
                return v;

              case "boolean":
                return v ? "true" : "false";

              case "number":
                return isFinite(v) ? v : "";

              default:
                return "";
            }
          };

          module.exports = function(obj, sep, eq, name) {
            sep = sep || "&";
            eq = eq || "=";
            if (obj === null) {
              obj = undefined;
            }

            if (typeof obj === "object") {
              return map(objectKeys(obj), function(k) {
                var ks = encodeURIComponent(stringifyPrimitive(k)) + eq;
                if (isArray(obj[k])) {
                  return map(obj[k], function(v) {
                    return ks + encodeURIComponent(stringifyPrimitive(v));
                  }).join(sep);
                } else {
                  return ks + encodeURIComponent(stringifyPrimitive(obj[k]));
                }
              }).join(sep);
            }

            if (!name) return "";
            return (
              encodeURIComponent(stringifyPrimitive(name)) +
              eq +
              encodeURIComponent(stringifyPrimitive(obj))
            );
          };

          var isArray =
            Array.isArray ||
            function(xs) {
              return Object.prototype.toString.call(xs) === "[object Array]";
            };

          function map(xs, f) {
            if (xs.map) return xs.map(f);
            var res = [];
            for (var i = 0; i < xs.length; i++) {
              res.push(f(xs[i], i));
            }
            return res;
          }

          var objectKeys =
            Object.keys ||
            function(obj) {
              var res = [];
              for (var key in obj) {
                if (Object.prototype.hasOwnProperty.call(obj, key))
                  res.push(key);
              }
              return res;
            };
        },
        {}
      ],
      15: [
        function(require, module, exports) {
          "use strict";

          exports.decode = exports.parse = require("./decode");
          exports.encode = exports.stringify = require("./encode");
        },
        { "./decode": 13, "./encode": 14 }
      ],
      16: [
        function(require, module, exports) {
          // Copyright Joyent, Inc. and other Node contributors.
          //
          // Permission is hereby granted, free of charge, to any person obtaining a
          // copy of this software and associated documentation files (the
          // "Software"), to deal in the Software without restriction, including
          // without limitation the rights to use, copy, modify, merge, publish,
          // distribute, sublicense, and/or sell copies of the Software, and to permit
          // persons to whom the Software is furnished to do so, subject to the
          // following conditions:
          //
          // The above copyright notice and this permission notice shall be included
          // in all copies or substantial portions of the Software.
          //
          // THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
          // OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
          // MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
          // NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
          // DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
          // OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
          // USE OR OTHER DEALINGS IN THE SOFTWARE.

          "use strict";

          var punycode = require("punycode");
          var util = require("./util");

          exports.parse = urlParse;
          exports.resolve = urlResolve;
          exports.resolveObject = urlResolveObject;
          exports.format = urlFormat;

          exports.Url = Url;

          function Url() {
            this.protocol = null;
            this.slashes = null;
            this.auth = null;
            this.host = null;
            this.port = null;
            this.hostname = null;
            this.hash = null;
            this.search = null;
            this.query = null;
            this.pathname = null;
            this.path = null;
            this.href = null;
          }

          // Reference: RFC 3986, RFC 1808, RFC 2396

          // define these here so at least they only have to be
          // compiled once on the first module load.
          var protocolPattern = /^([a-z0-9.+-]+:)/i,
            portPattern = /:[0-9]*$/,
            // Special case for a simple path URL
            simplePathPattern = /^(\/\/?(?!\/)[^\?\s]*)(\?[^\s]*)?$/,
            // RFC 2396: characters reserved for delimiting URLs.
            // We actually just auto-escape these.
            delims = ["<", ">", '"', "`", " ", "\r", "\n", "\t"],
            // RFC 2396: characters not allowed for various reasons.
            unwise = ["{", "}", "|", "\\", "^", "`"].concat(delims),
            // Allowed by RFCs, but cause of XSS attacks.  Always escape these.
            autoEscape = ["'"].concat(unwise),
            // Characters that are never ever allowed in a hostname.
            // Note that any invalid chars are also handled, but these
            // are the ones that are *expected* to be seen, so we fast-path
            // them.
            nonHostChars = ["%", "/", "?", ";", "#"].concat(autoEscape),
            hostEndingChars = ["/", "?", "#"],
            hostnameMaxLen = 255,
            hostnamePartPattern = /^[+a-z0-9A-Z_-]{0,63}$/,
            hostnamePartStart = /^([+a-z0-9A-Z_-]{0,63})(.*)$/,
            // protocols that can allow "unsafe" and "unwise" chars.
            unsafeProtocol = {
              javascript: true,
              "javascript:": true
            },
            // protocols that never have a hostname.
            hostlessProtocol = {
              javascript: true,
              "javascript:": true
            },
            // protocols that always contain a // bit.
            slashedProtocol = {
              http: true,
              https: true,
              ftp: true,
              gopher: true,
              file: true,
              "http:": true,
              "https:": true,
              "ftp:": true,
              "gopher:": true,
              "file:": true
            },
            querystring = require("querystring");

          function urlParse(url, parseQueryString, slashesDenoteHost) {
            if (url && util.isObject(url) && url instanceof Url) return url;

            var u = new Url();
            u.parse(url, parseQueryString, slashesDenoteHost);
            return u;
          }

          Url.prototype.parse = function(
            url,
            parseQueryString,
            slashesDenoteHost
          ) {
            if (!util.isString(url)) {
              throw new TypeError(
                "Parameter 'url' must be a string, not " + typeof url
              );
            }

            // Copy chrome, IE, opera backslash-handling behavior.
            // Back slashes before the query string get converted to forward slashes
            // See: https://code.google.com/p/chromium/issues/detail?id=25916
            var queryIndex = url.indexOf("?"),
              splitter =
                queryIndex !== -1 && queryIndex < url.indexOf("#") ? "?" : "#",
              uSplit = url.split(splitter),
              slashRegex = /\\/g;
            uSplit[0] = uSplit[0].replace(slashRegex, "/");
            url = uSplit.join(splitter);

            var rest = url;

            // trim before proceeding.
            // This is to support parse stuff like "  http://foo.com  \n"
            rest = rest.trim();

            if (!slashesDenoteHost && url.split("#").length === 1) {
              // Try fast path regexp
              var simplePath = simplePathPattern.exec(rest);
              if (simplePath) {
                this.path = rest;
                this.href = rest;
                this.pathname = simplePath[1];
                if (simplePath[2]) {
                  this.search = simplePath[2];
                  if (parseQueryString) {
                    this.query = querystring.parse(this.search.substr(1));
                  } else {
                    this.query = this.search.substr(1);
                  }
                } else if (parseQueryString) {
                  this.search = "";
                  this.query = {};
                }
                return this;
              }
            }

            var proto = protocolPattern.exec(rest);
            if (proto) {
              proto = proto[0];
              var lowerProto = proto.toLowerCase();
              this.protocol = lowerProto;
              rest = rest.substr(proto.length);
            }

            // figure out if it's got a host
            // user@server is *always* interpreted as a hostname, and url
            // resolution will treat //foo/bar as host=foo,path=bar because that's
            // how the browser resolves relative URLs.
            if (
              slashesDenoteHost ||
              proto ||
              rest.match(/^\/\/[^@\/]+@[^@\/]+/)
            ) {
              var slashes = rest.substr(0, 2) === "//";
              if (slashes && !(proto && hostlessProtocol[proto])) {
                rest = rest.substr(2);
                this.slashes = true;
              }
            }

            if (
              !hostlessProtocol[proto] &&
              (slashes || (proto && !slashedProtocol[proto]))
            ) {
              // there's a hostname.
              // the first instance of /, ?, ;, or # ends the host.
              //
              // If there is an @ in the hostname, then non-host chars *are* allowed
              // to the left of the last @ sign, unless some host-ending character
              // comes *before* the @-sign.
              // URLs are obnoxious.
              //
              // ex:
              // http://a@b@c/ => user:a@b host:c
              // http://a@b?@c => user:a host:c path:/?@c

              // v0.12 TODO(isaacs): This is not quite how Chrome does things.
              // Review our test case against browsers more comprehensively.

              // find the first instance of any hostEndingChars
              var hostEnd = -1;
              for (var i = 0; i < hostEndingChars.length; i++) {
                var hec = rest.indexOf(hostEndingChars[i]);
                if (hec !== -1 && (hostEnd === -1 || hec < hostEnd))
                  hostEnd = hec;
              }

              // at this point, either we have an explicit point where the
              // auth portion cannot go past, or the last @ char is the decider.
              var auth, atSign;
              if (hostEnd === -1) {
                // atSign can be anywhere.
                atSign = rest.lastIndexOf("@");
              } else {
                // atSign must be in auth portion.
                // http://a@b/c@d => host:b auth:a path:/c@d
                atSign = rest.lastIndexOf("@", hostEnd);
              }

              // Now we have a portion which is definitely the auth.
              // Pull that off.
              if (atSign !== -1) {
                auth = rest.slice(0, atSign);
                rest = rest.slice(atSign + 1);
                this.auth = decodeURIComponent(auth);
              }

              // the host is the remaining to the left of the first non-host char
              hostEnd = -1;
              for (var i = 0; i < nonHostChars.length; i++) {
                var hec = rest.indexOf(nonHostChars[i]);
                if (hec !== -1 && (hostEnd === -1 || hec < hostEnd))
                  hostEnd = hec;
              }
              // if we still have not hit it, then the entire thing is a host.
              if (hostEnd === -1) hostEnd = rest.length;

              this.host = rest.slice(0, hostEnd);
              rest = rest.slice(hostEnd);

              // pull out port.
              this.parseHost();

              // we've indicated that there is a hostname,
              // so even if it's empty, it has to be present.
              this.hostname = this.hostname || "";

              // if hostname begins with [ and ends with ]
              // assume that it's an IPv6 address.
              var ipv6Hostname =
                this.hostname[0] === "[" &&
                this.hostname[this.hostname.length - 1] === "]";

              // validate a little.
              if (!ipv6Hostname) {
                var hostparts = this.hostname.split(/\./);
                for (var i = 0, l = hostparts.length; i < l; i++) {
                  var part = hostparts[i];
                  if (!part) continue;
                  if (!part.match(hostnamePartPattern)) {
                    var newpart = "";
                    for (var j = 0, k = part.length; j < k; j++) {
                      if (part.charCodeAt(j) > 127) {
                        // we replace non-ASCII char with a temporary placeholder
                        // we need this to make sure size of hostname is not
                        // broken by replacing non-ASCII by nothing
                        newpart += "x";
                      } else {
                        newpart += part[j];
                      }
                    }
                    // we test again with ASCII char only
                    if (!newpart.match(hostnamePartPattern)) {
                      var validParts = hostparts.slice(0, i);
                      var notHost = hostparts.slice(i + 1);
                      var bit = part.match(hostnamePartStart);
                      if (bit) {
                        validParts.push(bit[1]);
                        notHost.unshift(bit[2]);
                      }
                      if (notHost.length) {
                        rest = "/" + notHost.join(".") + rest;
                      }
                      this.hostname = validParts.join(".");
                      break;
                    }
                  }
                }
              }

              if (this.hostname.length > hostnameMaxLen) {
                this.hostname = "";
              } else {
                // hostnames are always lower case.
                this.hostname = this.hostname.toLowerCase();
              }

              if (!ipv6Hostname) {
                // IDNA Support: Returns a punycoded representation of "domain".
                // It only converts parts of the domain name that
                // have non-ASCII characters, i.e. it doesn't matter if
                // you call it with a domain that already is ASCII-only.
                this.hostname = punycode.toASCII(this.hostname);
              }

              var p = this.port ? ":" + this.port : "";
              var h = this.hostname || "";
              this.host = h + p;
              this.href += this.host;

              // strip [ and ] from the hostname
              // the host field still retains them, though
              if (ipv6Hostname) {
                this.hostname = this.hostname.substr(
                  1,
                  this.hostname.length - 2
                );
                if (rest[0] !== "/") {
                  rest = "/" + rest;
                }
              }
            }

            // now rest is set to the post-host stuff.
            // chop off any delim chars.
            if (!unsafeProtocol[lowerProto]) {
              // First, make 100% sure that any "autoEscape" chars get
              // escaped, even if encodeURIComponent doesn't think they
              // need to be.
              for (var i = 0, l = autoEscape.length; i < l; i++) {
                var ae = autoEscape[i];
                if (rest.indexOf(ae) === -1) continue;
                var esc = encodeURIComponent(ae);
                if (esc === ae) {
                  esc = escape(ae);
                }
                rest = rest.split(ae).join(esc);
              }
            }

            // chop off from the tail first.
            var hash = rest.indexOf("#");
            if (hash !== -1) {
              // got a fragment string.
              this.hash = rest.substr(hash);
              rest = rest.slice(0, hash);
            }
            var qm = rest.indexOf("?");
            if (qm !== -1) {
              this.search = rest.substr(qm);
              this.query = rest.substr(qm + 1);
              if (parseQueryString) {
                this.query = querystring.parse(this.query);
              }
              rest = rest.slice(0, qm);
            } else if (parseQueryString) {
              // no query string, but parseQueryString still requested
              this.search = "";
              this.query = {};
            }
            if (rest) this.pathname = rest;
            if (
              slashedProtocol[lowerProto] &&
              this.hostname &&
              !this.pathname
            ) {
              this.pathname = "/";
            }

            //to support http.request
            if (this.pathname || this.search) {
              var p = this.pathname || "";
              var s = this.search || "";
              this.path = p + s;
            }

            // finally, reconstruct the href based on what has been validated.
            this.href = this.format();
            return this;
          };

          // format a parsed object into a url string
          function urlFormat(obj) {
            // ensure it's an object, and not a string url.
            // If it's an obj, this is a no-op.
            // this way, you can call url_format() on strings
            // to clean up potentially wonky urls.
            if (util.isString(obj)) obj = urlParse(obj);
            if (!(obj instanceof Url)) return Url.prototype.format.call(obj);
            return obj.format();
          }

          Url.prototype.format = function() {
            var auth = this.auth || "";
            if (auth) {
              auth = encodeURIComponent(auth);
              auth = auth.replace(/%3A/i, ":");
              auth += "@";
            }

            var protocol = this.protocol || "",
              pathname = this.pathname || "",
              hash = this.hash || "",
              host = false,
              query = "";

            if (this.host) {
              host = auth + this.host;
            } else if (this.hostname) {
              host =
                auth +
                (this.hostname.indexOf(":") === -1
                  ? this.hostname
                  : "[" + this.hostname + "]");
              if (this.port) {
                host += ":" + this.port;
              }
            }

            if (
              this.query &&
              util.isObject(this.query) &&
              Object.keys(this.query).length
            ) {
              query = querystring.stringify(this.query);
            }

            var search = this.search || (query && "?" + query) || "";

            if (protocol && protocol.substr(-1) !== ":") protocol += ":";

            // only the slashedProtocols get the //.  Not mailto:, xmpp:, etc.
            // unless they had them to begin with.
            if (
              this.slashes ||
              ((!protocol || slashedProtocol[protocol]) && host !== false)
            ) {
              host = "//" + (host || "");
              if (pathname && pathname.charAt(0) !== "/")
                pathname = "/" + pathname;
            } else if (!host) {
              host = "";
            }

            if (hash && hash.charAt(0) !== "#") hash = "#" + hash;
            if (search && search.charAt(0) !== "?") search = "?" + search;

            pathname = pathname.replace(/[?#]/g, function(match) {
              return encodeURIComponent(match);
            });
            search = search.replace("#", "%23");

            return protocol + host + pathname + search + hash;
          };

          function urlResolve(source, relative) {
            return urlParse(source, false, true).resolve(relative);
          }

          Url.prototype.resolve = function(relative) {
            return this.resolveObject(urlParse(relative, false, true)).format();
          };

          function urlResolveObject(source, relative) {
            if (!source) return relative;
            return urlParse(source, false, true).resolveObject(relative);
          }

          Url.prototype.resolveObject = function(relative) {
            if (util.isString(relative)) {
              var rel = new Url();
              rel.parse(relative, false, true);
              relative = rel;
            }

            var result = new Url();
            var tkeys = Object.keys(this);
            for (var tk = 0; tk < tkeys.length; tk++) {
              var tkey = tkeys[tk];
              result[tkey] = this[tkey];
            }

            // hash is always overridden, no matter what.
            // even href="" will remove it.
            result.hash = relative.hash;

            // if the relative url is empty, then there's nothing left to do here.
            if (relative.href === "") {
              result.href = result.format();
              return result;
            }

            // hrefs like //foo/bar always cut to the protocol.
            if (relative.slashes && !relative.protocol) {
              // take everything except the protocol from relative
              var rkeys = Object.keys(relative);
              for (var rk = 0; rk < rkeys.length; rk++) {
                var rkey = rkeys[rk];
                if (rkey !== "protocol") result[rkey] = relative[rkey];
              }

              //urlParse appends trailing / to urls like http://www.example.com
              if (
                slashedProtocol[result.protocol] &&
                result.hostname &&
                !result.pathname
              ) {
                result.path = result.pathname = "/";
              }

              result.href = result.format();
              return result;
            }

            if (relative.protocol && relative.protocol !== result.protocol) {
              // if it's a known url protocol, then changing
              // the protocol does weird things
              // first, if it's not file:, then we MUST have a host,
              // and if there was a path
              // to begin with, then we MUST have a path.
              // if it is file:, then the host is dropped,
              // because that's known to be hostless.
              // anything else is assumed to be absolute.
              if (!slashedProtocol[relative.protocol]) {
                var keys = Object.keys(relative);
                for (var v = 0; v < keys.length; v++) {
                  var k = keys[v];
                  result[k] = relative[k];
                }
                result.href = result.format();
                return result;
              }

              result.protocol = relative.protocol;
              if (!relative.host && !hostlessProtocol[relative.protocol]) {
                var relPath = (relative.pathname || "").split("/");
                while (relPath.length && !(relative.host = relPath.shift()));
                if (!relative.host) relative.host = "";
                if (!relative.hostname) relative.hostname = "";
                if (relPath[0] !== "") relPath.unshift("");
                if (relPath.length < 2) relPath.unshift("");
                result.pathname = relPath.join("/");
              } else {
                result.pathname = relative.pathname;
              }
              result.search = relative.search;
              result.query = relative.query;
              result.host = relative.host || "";
              result.auth = relative.auth;
              result.hostname = relative.hostname || relative.host;
              result.port = relative.port;
              // to support http.request
              if (result.pathname || result.search) {
                var p = result.pathname || "";
                var s = result.search || "";
                result.path = p + s;
              }
              result.slashes = result.slashes || relative.slashes;
              result.href = result.format();
              return result;
            }

            var isSourceAbs =
                result.pathname && result.pathname.charAt(0) === "/",
              isRelAbs =
                relative.host ||
                (relative.pathname && relative.pathname.charAt(0) === "/"),
              mustEndAbs =
                isRelAbs || isSourceAbs || (result.host && relative.pathname),
              removeAllDots = mustEndAbs,
              srcPath = (result.pathname && result.pathname.split("/")) || [],
              relPath =
                (relative.pathname && relative.pathname.split("/")) || [],
              psychotic = result.protocol && !slashedProtocol[result.protocol];

            // if the url is a non-slashed url, then relative
            // links like ../.. should be able
            // to crawl up to the hostname, as well.  This is strange.
            // result.protocol has already been set by now.
            // Later on, put the first path part into the host field.
            if (psychotic) {
              result.hostname = "";
              result.port = null;
              if (result.host) {
                if (srcPath[0] === "") srcPath[0] = result.host;
                else srcPath.unshift(result.host);
              }
              result.host = "";
              if (relative.protocol) {
                relative.hostname = null;
                relative.port = null;
                if (relative.host) {
                  if (relPath[0] === "") relPath[0] = relative.host;
                  else relPath.unshift(relative.host);
                }
                relative.host = null;
              }
              mustEndAbs =
                mustEndAbs && (relPath[0] === "" || srcPath[0] === "");
            }

            if (isRelAbs) {
              // it's absolute.
              result.host =
                relative.host || relative.host === ""
                  ? relative.host
                  : result.host;
              result.hostname =
                relative.hostname || relative.hostname === ""
                  ? relative.hostname
                  : result.hostname;
              result.search = relative.search;
              result.query = relative.query;
              srcPath = relPath;
              // fall through to the dot-handling below.
            } else if (relPath.length) {
              // it's relative
              // throw away the existing file, and take the new path instead.
              if (!srcPath) srcPath = [];
              srcPath.pop();
              srcPath = srcPath.concat(relPath);
              result.search = relative.search;
              result.query = relative.query;
            } else if (!util.isNullOrUndefined(relative.search)) {
              // just pull out the search.
              // like href='?foo'.
              // Put this after the other two cases because it simplifies the booleans
              if (psychotic) {
                result.hostname = result.host = srcPath.shift();
                //occationaly the auth can get stuck only in host
                //this especially happens in cases like
                //url.resolveObject('mailto:local1@domain1', 'local2@domain2')
                var authInHost =
                  result.host && result.host.indexOf("@") > 0
                    ? result.host.split("@")
                    : false;
                if (authInHost) {
                  result.auth = authInHost.shift();
                  result.host = result.hostname = authInHost.shift();
                }
              }
              result.search = relative.search;
              result.query = relative.query;
              //to support http.request
              if (
                !util.isNull(result.pathname) ||
                !util.isNull(result.search)
              ) {
                result.path =
                  (result.pathname ? result.pathname : "") +
                  (result.search ? result.search : "");
              }
              result.href = result.format();
              return result;
            }

            if (!srcPath.length) {
              // no path at all.  easy.
              // we've already handled the other stuff above.
              result.pathname = null;
              //to support http.request
              if (result.search) {
                result.path = "/" + result.search;
              } else {
                result.path = null;
              }
              result.href = result.format();
              return result;
            }

            // if a url ENDs in . or .., then it must get a trailing slash.
            // however, if it ends in anything else non-slashy,
            // then it must NOT get a trailing slash.
            var last = srcPath.slice(-1)[0];
            var hasTrailingSlash =
              ((result.host || relative.host || srcPath.length > 1) &&
                (last === "." || last === "..")) ||
              last === "";

            // strip single dots, resolve double dots to parent dir
            // if the path tries to go above the root, `up` ends up > 0
            var up = 0;
            for (var i = srcPath.length; i >= 0; i--) {
              last = srcPath[i];
              if (last === ".") {
                srcPath.splice(i, 1);
              } else if (last === "..") {
                srcPath.splice(i, 1);
                up++;
              } else if (up) {
                srcPath.splice(i, 1);
                up--;
              }
            }

            // if the path is allowed to go above the root, restore leading ..s
            if (!mustEndAbs && !removeAllDots) {
              for (; up--; up) {
                srcPath.unshift("..");
              }
            }

            if (
              mustEndAbs &&
              srcPath[0] !== "" &&
              (!srcPath[0] || srcPath[0].charAt(0) !== "/")
            ) {
              srcPath.unshift("");
            }

            if (hasTrailingSlash && srcPath.join("/").substr(-1) !== "/") {
              srcPath.push("");
            }

            var isAbsolute =
              srcPath[0] === "" || (srcPath[0] && srcPath[0].charAt(0) === "/");

            // put the host back
            if (psychotic) {
              result.hostname = result.host = isAbsolute
                ? ""
                : srcPath.length ? srcPath.shift() : "";
              //occationaly the auth can get stuck only in host
              //this especially happens in cases like
              //url.resolveObject('mailto:local1@domain1', 'local2@domain2')
              var authInHost =
                result.host && result.host.indexOf("@") > 0
                  ? result.host.split("@")
                  : false;
              if (authInHost) {
                result.auth = authInHost.shift();
                result.host = result.hostname = authInHost.shift();
              }
            }

            mustEndAbs = mustEndAbs || (result.host && srcPath.length);

            if (mustEndAbs && !isAbsolute) {
              srcPath.unshift("");
            }

            if (!srcPath.length) {
              result.pathname = null;
              result.path = null;
            } else {
              result.pathname = srcPath.join("/");
            }

            //to support request.http
            if (!util.isNull(result.pathname) || !util.isNull(result.search)) {
              result.path =
                (result.pathname ? result.pathname : "") +
                (result.search ? result.search : "");
            }
            result.auth = relative.auth || result.auth;
            result.slashes = result.slashes || relative.slashes;
            result.href = result.format();
            return result;
          };

          Url.prototype.parseHost = function() {
            var host = this.host;
            var port = portPattern.exec(host);
            if (port) {
              port = port[0];
              if (port !== ":") {
                this.port = port.substr(1);
              }
              host = host.substr(0, host.length - port.length);
            }
            if (host) this.hostname = host;
          };
        },
        { "./util": 17, punycode: 12, querystring: 15 }
      ],
      17: [
        function(require, module, exports) {
          "use strict";

          module.exports = {
            isString: function(arg) {
              return typeof arg === "string";
            },
            isObject: function(arg) {
              return typeof arg === "object" && arg !== null;
            },
            isNull: function(arg) {
              return arg === null;
            },
            isNullOrUndefined: function(arg) {
              return arg == null;
            }
          };
        },
        {}
      ]
    },
    {},
    [1]
  )(1);
});
