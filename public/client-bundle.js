var fetchMock = /******/ (function(modules) {
  // webpackBootstrap
  /******/ // The module cache
  /******/ var installedModules = {}; // The require function
  /******/
  /******/ /******/ function __webpack_require__(moduleId) {
    /******/
    /******/ // Check if module is in cache
    /******/ if (installedModules[moduleId]) {
      /******/ return installedModules[moduleId].exports;
      /******/
    } // Create a new module (and put it into the cache)
    /******/ /******/ var module = (installedModules[moduleId] = {
      /******/ i: moduleId,
      /******/ l: false,
      /******/ exports: {}
      /******/
    }); // Execute the module function
    /******/
    /******/ /******/ modules[moduleId].call(
      module.exports,
      module,
      module.exports,
      __webpack_require__
    ); // Flag the module as loaded
    /******/
    /******/ /******/ module.l = true; // Return the exports of the module
    /******/
    /******/ /******/ return module.exports;
    /******/
  } // expose the modules object (__webpack_modules__)
  /******/
  /******/
  /******/ /******/ __webpack_require__.m = modules; // expose the module cache
  /******/
  /******/ /******/ __webpack_require__.c = installedModules; // define getter function for harmony exports
  /******/
  /******/ /******/ __webpack_require__.d = function(exports, name, getter) {
    /******/ if (!__webpack_require__.o(exports, name)) {
      /******/ Object.defineProperty(exports, name, {
        /******/ configurable: false,
        /******/ enumerable: true,
        /******/ get: getter
        /******/
      });
      /******/
    }
    /******/
  }; // getDefaultExport function for compatibility with non-harmony modules
  /******/
  /******/ /******/ __webpack_require__.n = function(module) {
    /******/ var getter =
      module && module.__esModule
        ? /******/ function getDefault() {
            return module["default"];
          }
        : /******/ function getModuleExports() {
            return module;
          };
    /******/ __webpack_require__.d(getter, "a", getter);
    /******/ return getter;
    /******/
  }; // Object.prototype.hasOwnProperty.call
  /******/
  /******/ /******/ __webpack_require__.o = function(object, property) {
    return Object.prototype.hasOwnProperty.call(object, property);
  }; // __webpack_public_path__
  /******/
  /******/ /******/ __webpack_require__.p = ""; // Load entry module and return exports
  /******/
  /******/ /******/ return __webpack_require__((__webpack_require__.s = 62));
  /******/
})(
  /************************************************************************/
  /******/ [
    /* 0 */
    /***/ function(module, exports) {
      var core = (module.exports = { version: "2.5.3" });
      if (typeof __e == "number") __e = core; // eslint-disable-line no-undef

      /***/
    },
    /* 1 */
    /***/ function(module, exports, __webpack_require__) {
      var store = __webpack_require__(32)("wks");
      var uid = __webpack_require__(21);
      var Symbol = __webpack_require__(2).Symbol;
      var USE_SYMBOL = typeof Symbol == "function";

      var $exports = (module.exports = function(name) {
        return (
          store[name] ||
          (store[name] =
            (USE_SYMBOL && Symbol[name]) ||
            (USE_SYMBOL ? Symbol : uid)("Symbol." + name))
        );
      });

      $exports.store = store;

      /***/
    },
    /* 2 */
    /***/ function(module, exports) {
      // https://github.com/zloirock/core-js/issues/86#issuecomment-115759028
      var global = (module.exports =
        typeof window != "undefined" && window.Math == Math
          ? window
          : typeof self != "undefined" && self.Math == Math
            ? self
            : // eslint-disable-next-line no-new-func
              Function("return this")());
      if (typeof __g == "number") __g = global; // eslint-disable-line no-undef

      /***/
    },
    /* 3 */
    /***/ function(module, exports, __webpack_require__) {
      var global = __webpack_require__(2);
      var core = __webpack_require__(0);
      var ctx = __webpack_require__(14);
      var hide = __webpack_require__(7);
      var PROTOTYPE = "prototype";

      var $export = function(type, name, source) {
        var IS_FORCED = type & $export.F;
        var IS_GLOBAL = type & $export.G;
        var IS_STATIC = type & $export.S;
        var IS_PROTO = type & $export.P;
        var IS_BIND = type & $export.B;
        var IS_WRAP = type & $export.W;
        var exports = IS_GLOBAL ? core : core[name] || (core[name] = {});
        var expProto = exports[PROTOTYPE];
        var target = IS_GLOBAL
          ? global
          : IS_STATIC ? global[name] : (global[name] || {})[PROTOTYPE];
        var key, own, out;
        if (IS_GLOBAL) source = name;
        for (key in source) {
          // contains in native
          own = !IS_FORCED && target && target[key] !== undefined;
          if (own && key in exports) continue;
          // export native or passed
          out = own ? target[key] : source[key];
          // prevent global pollution for namespaces
          exports[key] =
            IS_GLOBAL && typeof target[key] != "function"
              ? source[key]
              : // bind timers to global for call from export context
                IS_BIND && own
                ? ctx(out, global)
                : // wrap global constructors for prevent change them in library
                  IS_WRAP && target[key] == out
                  ? (function(C) {
                      var F = function(a, b, c) {
                        if (this instanceof C) {
                          switch (arguments.length) {
                            case 0:
                              return new C();
                            case 1:
                              return new C(a);
                            case 2:
                              return new C(a, b);
                          }
                          return new C(a, b, c);
                        }
                        return C.apply(this, arguments);
                      };
                      F[PROTOTYPE] = C[PROTOTYPE];
                      return F;
                      // make static versions for prototype methods
                    })(out)
                  : IS_PROTO && typeof out == "function"
                    ? ctx(Function.call, out)
                    : out;
          // export proto methods to core.%CONSTRUCTOR%.methods.%NAME%
          if (IS_PROTO) {
            (exports.virtual || (exports.virtual = {}))[key] = out;
            // export proto methods to core.%CONSTRUCTOR%.prototype.%NAME%
            if (type & $export.R && expProto && !expProto[key])
              hide(expProto, key, out);
          }
        }
      };
      // type bitmap
      $export.F = 1; // forced
      $export.G = 2; // global
      $export.S = 4; // static
      $export.P = 8; // proto
      $export.B = 16; // bind
      $export.W = 32; // wrap
      $export.U = 64; // safe
      $export.R = 128; // real proto method for `library`
      module.exports = $export;

      /***/
    },
    /* 4 */
    /***/ function(module, exports, __webpack_require__) {
      var anObject = __webpack_require__(5);
      var IE8_DOM_DEFINE = __webpack_require__(41);
      var toPrimitive = __webpack_require__(27);
      var dP = Object.defineProperty;

      exports.f = __webpack_require__(6)
        ? Object.defineProperty
        : function defineProperty(O, P, Attributes) {
            anObject(O);
            P = toPrimitive(P, true);
            anObject(Attributes);
            if (IE8_DOM_DEFINE)
              try {
                return dP(O, P, Attributes);
              } catch (e) {
                /* empty */
              }
            if ("get" in Attributes || "set" in Attributes)
              throw TypeError("Accessors not supported!");
            if ("value" in Attributes) O[P] = Attributes.value;
            return O;
          };

      /***/
    },
    /* 5 */
    /***/ function(module, exports, __webpack_require__) {
      var isObject = __webpack_require__(8);
      module.exports = function(it) {
        if (!isObject(it)) throw TypeError(it + " is not an object!");
        return it;
      };

      /***/
    },
    /* 6 */
    /***/ function(module, exports, __webpack_require__) {
      // Thank's IE8 for his funny defineProperty
      module.exports = !__webpack_require__(11)(function() {
        return (
          Object.defineProperty({}, "a", {
            get: function() {
              return 7;
            }
          }).a != 7
        );
      });

      /***/
    },
    /* 7 */
    /***/ function(module, exports, __webpack_require__) {
      var dP = __webpack_require__(4);
      var createDesc = __webpack_require__(15);
      module.exports = __webpack_require__(6)
        ? function(object, key, value) {
            return dP.f(object, key, createDesc(1, value));
          }
        : function(object, key, value) {
            object[key] = value;
            return object;
          };

      /***/
    },
    /* 8 */
    /***/ function(module, exports) {
      module.exports = function(it) {
        return typeof it === "object" ? it !== null : typeof it === "function";
      };

      /***/
    },
    /* 9 */
    /***/ function(module, exports) {
      var hasOwnProperty = {}.hasOwnProperty;
      module.exports = function(it, key) {
        return hasOwnProperty.call(it, key);
      };

      /***/
    },
    /* 10 */
    /***/ function(module, exports, __webpack_require__) {
      // to indexed object, toObject with fallback for non-array-like ES3 strings
      var IObject = __webpack_require__(43);
      var defined = __webpack_require__(28);
      module.exports = function(it) {
        return IObject(defined(it));
      };

      /***/
    },
    /* 11 */
    /***/ function(module, exports) {
      module.exports = function(exec) {
        try {
          return !!exec();
        } catch (e) {
          return true;
        }
      };

      /***/
    },
    /* 12 */
    /***/ function(module, exports, __webpack_require__) {
      // 19.1.2.14 / 15.2.3.14 Object.keys(O)
      var $keys = __webpack_require__(42);
      var enumBugKeys = __webpack_require__(33);

      module.exports =
        Object.keys ||
        function keys(O) {
          return $keys(O, enumBugKeys);
        };

      /***/
    },
    /* 13 */
    /***/ function(module, exports) {
      module.exports = {};

      /***/
    },
    /* 14 */
    /***/ function(module, exports, __webpack_require__) {
      // optional / simple context binding
      var aFunction = __webpack_require__(20);
      module.exports = function(fn, that, length) {
        aFunction(fn);
        if (that === undefined) return fn;
        switch (length) {
          case 1:
            return function(a) {
              return fn.call(that, a);
            };
          case 2:
            return function(a, b) {
              return fn.call(that, a, b);
            };
          case 3:
            return function(a, b, c) {
              return fn.call(that, a, b, c);
            };
        }
        return function(/* ...args */) {
          return fn.apply(that, arguments);
        };
      };

      /***/
    },
    /* 15 */
    /***/ function(module, exports) {
      module.exports = function(bitmap, value) {
        return {
          enumerable: !(bitmap & 1),
          configurable: !(bitmap & 2),
          writable: !(bitmap & 4),
          value: value
        };
      };

      /***/
    },
    /* 16 */
    /***/ function(module, exports) {
      var toString = {}.toString;

      module.exports = function(it) {
        return toString.call(it).slice(8, -1);
      };

      /***/
    },
    /* 17 */
    /***/ function(module, exports) {
      exports.f = {}.propertyIsEnumerable;

      /***/
    },
    /* 18 */
    /***/ function(module, exports, __webpack_require__) {
      "use strict";

      var $at = __webpack_require__(81)(true);

      // 21.1.3.27 String.prototype[@@iterator]()
      __webpack_require__(47)(
        String,
        "String",
        function(iterated) {
          this._t = String(iterated); // target
          this._i = 0; // next index
          // 21.1.5.2.1 %StringIteratorPrototype%.next()
        },
        function() {
          var O = this._t;
          var index = this._i;
          var point;
          if (index >= O.length) return { value: undefined, done: true };
          point = $at(O, index);
          this._i += point.length;
          return { value: point, done: false };
        }
      );

      /***/
    },
    /* 19 */
    /***/ function(module, exports, __webpack_require__) {
      module.exports = { default: __webpack_require__(63), __esModule: true };

      /***/
    },
    /* 20 */
    /***/ function(module, exports) {
      module.exports = function(it) {
        if (typeof it != "function")
          throw TypeError(it + " is not a function!");
        return it;
      };

      /***/
    },
    /* 21 */
    /***/ function(module, exports) {
      var id = 0;
      var px = Math.random();
      module.exports = function(key) {
        return "Symbol(".concat(
          key === undefined ? "" : key,
          ")_",
          (++id + px).toString(36)
        );
      };

      /***/
    },
    /* 22 */
    /***/ function(module, exports, __webpack_require__) {
      // 7.1.13 ToObject(argument)
      var defined = __webpack_require__(28);
      module.exports = function(it) {
        return Object(defined(it));
      };

      /***/
    },
    /* 23 */
    /***/ function(module, exports, __webpack_require__) {
      __webpack_require__(76);
      var global = __webpack_require__(2);
      var hide = __webpack_require__(7);
      var Iterators = __webpack_require__(13);
      var TO_STRING_TAG = __webpack_require__(1)("toStringTag");

      var DOMIterables = (
        "CSSRuleList,CSSStyleDeclaration,CSSValueList,ClientRectList,DOMRectList,DOMStringList," +
        "DOMTokenList,DataTransferItemList,FileList,HTMLAllCollection,HTMLCollection,HTMLFormElement,HTMLSelectElement," +
        "MediaList,MimeTypeArray,NamedNodeMap,NodeList,PaintRequestList,Plugin,PluginArray,SVGLengthList,SVGNumberList," +
        "SVGPathSegList,SVGPointList,SVGStringList,SVGTransformList,SourceBufferList,StyleSheetList,TextTrackCueList," +
        "TextTrackList,TouchList"
      ).split(",");

      for (var i = 0; i < DOMIterables.length; i++) {
        var NAME = DOMIterables[i];
        var Collection = global[NAME];
        var proto = Collection && Collection.prototype;
        if (proto && !proto[TO_STRING_TAG]) hide(proto, TO_STRING_TAG, NAME);
        Iterators[NAME] = Iterators.Array;
      }

      /***/
    },
    /* 24 */
    /***/ function(module, exports) {
      module.exports = true;

      /***/
    },
    /* 25 */
    /***/ function(module, exports, __webpack_require__) {
      var def = __webpack_require__(4).f;
      var has = __webpack_require__(9);
      var TAG = __webpack_require__(1)("toStringTag");

      module.exports = function(it, tag, stat) {
        if (it && !has((it = stat ? it : it.prototype), TAG))
          def(it, TAG, { configurable: true, value: tag });
      };

      /***/
    },
    /* 26 */
    /***/ function(module, exports, __webpack_require__) {
      var isObject = __webpack_require__(8);
      var document = __webpack_require__(2).document;
      // typeof document.createElement is 'object' in old IE
      var is = isObject(document) && isObject(document.createElement);
      module.exports = function(it) {
        return is ? document.createElement(it) : {};
      };

      /***/
    },
    /* 27 */
    /***/ function(module, exports, __webpack_require__) {
      // 7.1.1 ToPrimitive(input [, PreferredType])
      var isObject = __webpack_require__(8);
      // instead of the ES6 spec version, we didn't implement @@toPrimitive case
      // and the second argument - flag - preferred type is a string
      module.exports = function(it, S) {
        if (!isObject(it)) return it;
        var fn, val;
        if (
          S &&
          typeof (fn = it.toString) == "function" &&
          !isObject((val = fn.call(it)))
        )
          return val;
        if (
          typeof (fn = it.valueOf) == "function" &&
          !isObject((val = fn.call(it)))
        )
          return val;
        if (
          !S &&
          typeof (fn = it.toString) == "function" &&
          !isObject((val = fn.call(it)))
        )
          return val;
        throw TypeError("Can't convert object to primitive value");
      };

      /***/
    },
    /* 28 */
    /***/ function(module, exports) {
      // 7.2.1 RequireObjectCoercible(argument)
      module.exports = function(it) {
        if (it == undefined) throw TypeError("Can't call method on  " + it);
        return it;
      };

      /***/
    },
    /* 29 */
    /***/ function(module, exports, __webpack_require__) {
      // 7.1.15 ToLength
      var toInteger = __webpack_require__(30);
      var min = Math.min;
      module.exports = function(it) {
        return it > 0 ? min(toInteger(it), 0x1fffffffffffff) : 0; // pow(2, 53) - 1 == 9007199254740991
      };

      /***/
    },
    /* 30 */
    /***/ function(module, exports) {
      // 7.1.4 ToInteger
      var ceil = Math.ceil;
      var floor = Math.floor;
      module.exports = function(it) {
        return isNaN((it = +it)) ? 0 : (it > 0 ? floor : ceil)(it);
      };

      /***/
    },
    /* 31 */
    /***/ function(module, exports, __webpack_require__) {
      var shared = __webpack_require__(32)("keys");
      var uid = __webpack_require__(21);
      module.exports = function(key) {
        return shared[key] || (shared[key] = uid(key));
      };

      /***/
    },
    /* 32 */
    /***/ function(module, exports, __webpack_require__) {
      var global = __webpack_require__(2);
      var SHARED = "__core-js_shared__";
      var store = global[SHARED] || (global[SHARED] = {});
      module.exports = function(key) {
        return store[key] || (store[key] = {});
      };

      /***/
    },
    /* 33 */
    /***/ function(module, exports) {
      // IE 8- don't enum bug keys
      module.exports = "constructor,hasOwnProperty,isPrototypeOf,propertyIsEnumerable,toLocaleString,toString,valueOf".split(
        ","
      );

      /***/
    },
    /* 34 */
    /***/ function(module, exports) {
      exports.f = Object.getOwnPropertySymbols;

      /***/
    },
    /* 35 */
    /***/ function(module, exports, __webpack_require__) {
      // 19.1.2.2 / 15.2.3.5 Object.create(O [, Properties])
      var anObject = __webpack_require__(5);
      var dPs = __webpack_require__(71);
      var enumBugKeys = __webpack_require__(33);
      var IE_PROTO = __webpack_require__(31)("IE_PROTO");
      var Empty = function() {
        /* empty */
      };
      var PROTOTYPE = "prototype";

      // Create object with fake `null` prototype: use iframe Object with cleared prototype
      var createDict = function() {
        // Thrash, waste and sodomy: IE GC bug
        var iframe = __webpack_require__(26)("iframe");
        var i = enumBugKeys.length;
        var lt = "<";
        var gt = ">";
        var iframeDocument;
        iframe.style.display = "none";
        __webpack_require__(45).appendChild(iframe);
        iframe.src = "javascript:"; // eslint-disable-line no-script-url
        // createDict = iframe.contentWindow.Object;
        // html.removeChild(iframe);
        iframeDocument = iframe.contentWindow.document;
        iframeDocument.open();
        iframeDocument.write(
          lt + "script" + gt + "document.F=Object" + lt + "/script" + gt
        );
        iframeDocument.close();
        createDict = iframeDocument.F;
        while (i--) delete createDict[PROTOTYPE][enumBugKeys[i]];
        return createDict();
      };

      module.exports =
        Object.create ||
        function create(O, Properties) {
          var result;
          if (O !== null) {
            Empty[PROTOTYPE] = anObject(O);
            result = new Empty();
            Empty[PROTOTYPE] = null;
            // add "__proto__" for Object.getPrototypeOf polyfill
            result[IE_PROTO] = O;
          } else result = createDict();
          return Properties === undefined ? result : dPs(result, Properties);
        };

      /***/
    },
    /* 36 */
    /***/ function(module, exports, __webpack_require__) {
      // getting tag from 19.1.3.6 Object.prototype.toString()
      var cof = __webpack_require__(16);
      var TAG = __webpack_require__(1)("toStringTag");
      // ES3 wrong here
      var ARG =
        cof(
          (function() {
            return arguments;
          })()
        ) == "Arguments";

      // fallback for IE11 Script Access Denied error
      var tryGet = function(it, key) {
        try {
          return it[key];
        } catch (e) {
          /* empty */
        }
      };

      module.exports = function(it) {
        var O, T, B;
        return it === undefined
          ? "Undefined"
          : it === null
            ? "Null"
            : // @@toStringTag case
              typeof (T = tryGet((O = Object(it)), TAG)) == "string"
              ? T
              : // builtinTag case
                ARG
                ? cof(O)
                : // ES3 arguments fallback
                  (B = cof(O)) == "Object" && typeof O.callee == "function"
                  ? "Arguments"
                  : B;
      };

      /***/
    },
    /* 37 */
    /***/ function(module, exports, __webpack_require__) {
      var classof = __webpack_require__(36);
      var ITERATOR = __webpack_require__(1)("iterator");
      var Iterators = __webpack_require__(13);
      module.exports = __webpack_require__(0).getIteratorMethod = function(it) {
        if (it != undefined)
          return it[ITERATOR] || it["@@iterator"] || Iterators[classof(it)];
      };

      /***/
    },
    /* 38 */
    /***/ function(module, exports, __webpack_require__) {
      "use strict";

      // 25.4.1.5 NewPromiseCapability(C)
      var aFunction = __webpack_require__(20);

      function PromiseCapability(C) {
        var resolve, reject;
        this.promise = new C(function($$resolve, $$reject) {
          if (resolve !== undefined || reject !== undefined)
            throw TypeError("Bad Promise constructor");
          resolve = $$resolve;
          reject = $$reject;
        });
        this.resolve = aFunction(resolve);
        this.reject = aFunction(reject);
      }

      module.exports.f = function(C) {
        return new PromiseCapability(C);
      };

      /***/
    },
    /* 39 */
    /***/ function(module, exports, __webpack_require__) {
      exports.f = __webpack_require__(1);

      /***/
    },
    /* 40 */
    /***/ function(module, exports, __webpack_require__) {
      var global = __webpack_require__(2);
      var core = __webpack_require__(0);
      var LIBRARY = __webpack_require__(24);
      var wksExt = __webpack_require__(39);
      var defineProperty = __webpack_require__(4).f;
      module.exports = function(name) {
        var $Symbol =
          core.Symbol || (core.Symbol = LIBRARY ? {} : global.Symbol || {});
        if (name.charAt(0) != "_" && !(name in $Symbol))
          defineProperty($Symbol, name, { value: wksExt.f(name) });
      };

      /***/
    },
    /* 41 */
    /***/ function(module, exports, __webpack_require__) {
      module.exports =
        !__webpack_require__(6) &&
        !__webpack_require__(11)(function() {
          return (
            Object.defineProperty(__webpack_require__(26)("div"), "a", {
              get: function() {
                return 7;
              }
            }).a != 7
          );
        });

      /***/
    },
    /* 42 */
    /***/ function(module, exports, __webpack_require__) {
      var has = __webpack_require__(9);
      var toIObject = __webpack_require__(10);
      var arrayIndexOf = __webpack_require__(66)(false);
      var IE_PROTO = __webpack_require__(31)("IE_PROTO");

      module.exports = function(object, names) {
        var O = toIObject(object);
        var i = 0;
        var result = [];
        var key;
        for (key in O) if (key != IE_PROTO) has(O, key) && result.push(key);
        // Don't enum bug & hidden keys
        while (names.length > i)
          if (has(O, (key = names[i++]))) {
            ~arrayIndexOf(result, key) || result.push(key);
          }
        return result;
      };

      /***/
    },
    /* 43 */
    /***/ function(module, exports, __webpack_require__) {
      // fallback for non-array-like ES3 and non-enumerable old V8 strings
      var cof = __webpack_require__(16);
      // eslint-disable-next-line no-prototype-builtins
      module.exports = Object("z").propertyIsEnumerable(0)
        ? Object
        : function(it) {
            return cof(it) == "String" ? it.split("") : Object(it);
          };

      /***/
    },
    /* 44 */
    /***/ function(module, exports, __webpack_require__) {
      module.exports = { default: __webpack_require__(69), __esModule: true };

      /***/
    },
    /* 45 */
    /***/ function(module, exports, __webpack_require__) {
      var document = __webpack_require__(2).document;
      module.exports = document && document.documentElement;

      /***/
    },
    /* 46 */
    /***/ function(module, exports, __webpack_require__) {
      "use strict";

      exports.__esModule = true;

      var _isIterable2 = __webpack_require__(74);

      var _isIterable3 = _interopRequireDefault(_isIterable2);

      var _getIterator2 = __webpack_require__(83);

      var _getIterator3 = _interopRequireDefault(_getIterator2);

      function _interopRequireDefault(obj) {
        return obj && obj.__esModule ? obj : { default: obj };
      }

      exports.default = (function() {
        function sliceIterator(arr, i) {
          var _arr = [];
          var _n = true;
          var _d = false;
          var _e = undefined;

          try {
            for (
              var _i = (0, _getIterator3.default)(arr), _s;
              !(_n = (_s = _i.next()).done);
              _n = true
            ) {
              _arr.push(_s.value);

              if (i && _arr.length === i) break;
            }
          } catch (err) {
            _d = true;
            _e = err;
          } finally {
            try {
              if (!_n && _i["return"]) _i["return"]();
            } finally {
              if (_d) throw _e;
            }
          }

          return _arr;
        }

        return function(arr, i) {
          if (Array.isArray(arr)) {
            return arr;
          } else if ((0, _isIterable3.default)(Object(arr))) {
            return sliceIterator(arr, i);
          } else {
            throw new TypeError(
              "Invalid attempt to destructure non-iterable instance"
            );
          }
        };
      })();

      /***/
    },
    /* 47 */
    /***/ function(module, exports, __webpack_require__) {
      "use strict";

      var LIBRARY = __webpack_require__(24);
      var $export = __webpack_require__(3);
      var redefine = __webpack_require__(48);
      var hide = __webpack_require__(7);
      var has = __webpack_require__(9);
      var Iterators = __webpack_require__(13);
      var $iterCreate = __webpack_require__(79);
      var setToStringTag = __webpack_require__(25);
      var getPrototypeOf = __webpack_require__(80);
      var ITERATOR = __webpack_require__(1)("iterator");
      var BUGGY = !([].keys && "next" in [].keys()); // Safari has buggy iterators w/o `next`
      var FF_ITERATOR = "@@iterator";
      var KEYS = "keys";
      var VALUES = "values";

      var returnThis = function() {
        return this;
      };

      module.exports = function(
        Base,
        NAME,
        Constructor,
        next,
        DEFAULT,
        IS_SET,
        FORCED
      ) {
        $iterCreate(Constructor, NAME, next);
        var getMethod = function(kind) {
          if (!BUGGY && kind in proto) return proto[kind];
          switch (kind) {
            case KEYS:
              return function keys() {
                return new Constructor(this, kind);
              };
            case VALUES:
              return function values() {
                return new Constructor(this, kind);
              };
          }
          return function entries() {
            return new Constructor(this, kind);
          };
        };
        var TAG = NAME + " Iterator";
        var DEF_VALUES = DEFAULT == VALUES;
        var VALUES_BUG = false;
        var proto = Base.prototype;
        var $native =
          proto[ITERATOR] || proto[FF_ITERATOR] || (DEFAULT && proto[DEFAULT]);
        var $default = (!BUGGY && $native) || getMethod(DEFAULT);
        var $entries = DEFAULT
          ? !DEF_VALUES ? $default : getMethod("entries")
          : undefined;
        var $anyNative = NAME == "Array" ? proto.entries || $native : $native;
        var methods, key, IteratorPrototype;
        // Fix native
        if ($anyNative) {
          IteratorPrototype = getPrototypeOf($anyNative.call(new Base()));
          if (
            IteratorPrototype !== Object.prototype &&
            IteratorPrototype.next
          ) {
            // Set @@toStringTag to native iterators
            setToStringTag(IteratorPrototype, TAG, true);
            // fix for some old engines
            if (!LIBRARY && !has(IteratorPrototype, ITERATOR))
              hide(IteratorPrototype, ITERATOR, returnThis);
          }
        }
        // fix Array#{values, @@iterator}.name in V8 / FF
        if (DEF_VALUES && $native && $native.name !== VALUES) {
          VALUES_BUG = true;
          $default = function values() {
            return $native.call(this);
          };
        }
        // Define iterator
        if ((!LIBRARY || FORCED) && (BUGGY || VALUES_BUG || !proto[ITERATOR])) {
          hide(proto, ITERATOR, $default);
        }
        // Plug for library
        Iterators[NAME] = $default;
        Iterators[TAG] = returnThis;
        if (DEFAULT) {
          methods = {
            values: DEF_VALUES ? $default : getMethod(VALUES),
            keys: IS_SET ? $default : getMethod(KEYS),
            entries: $entries
          };
          if (FORCED)
            for (key in methods) {
              if (!(key in proto)) redefine(proto, key, methods[key]);
            }
          else
            $export(
              $export.P + $export.F * (BUGGY || VALUES_BUG),
              NAME,
              methods
            );
        }
        return methods;
      };

      /***/
    },
    /* 48 */
    /***/ function(module, exports, __webpack_require__) {
      module.exports = __webpack_require__(7);

      /***/
    },
    /* 49 */
    /***/ function(module, exports, __webpack_require__) {
      "use strict";

      exports.__esModule = true;

      var _from = __webpack_require__(86);

      var _from2 = _interopRequireDefault(_from);

      function _interopRequireDefault(obj) {
        return obj && obj.__esModule ? obj : { default: obj };
      }

      exports.default = function(arr) {
        if (Array.isArray(arr)) {
          for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) {
            arr2[i] = arr[i];
          }

          return arr2;
        } else {
          return (0, _from2.default)(arr);
        }
      };

      /***/
    },
    /* 50 */
    /***/ function(module, exports, __webpack_require__) {
      // call something on iterator step with safe closing on error
      var anObject = __webpack_require__(5);
      module.exports = function(iterator, fn, value, entries) {
        try {
          return entries ? fn(anObject(value)[0], value[1]) : fn(value);
          // 7.4.6 IteratorClose(iterator, completion)
        } catch (e) {
          var ret = iterator["return"];
          if (ret !== undefined) anObject(ret.call(iterator));
          throw e;
        }
      };

      /***/
    },
    /* 51 */
    /***/ function(module, exports, __webpack_require__) {
      // check on default Array iterator
      var Iterators = __webpack_require__(13);
      var ITERATOR = __webpack_require__(1)("iterator");
      var ArrayProto = Array.prototype;

      module.exports = function(it) {
        return (
          it !== undefined &&
          (Iterators.Array === it || ArrayProto[ITERATOR] === it)
        );
      };

      /***/
    },
    /* 52 */
    /***/ function(module, exports, __webpack_require__) {
      var ITERATOR = __webpack_require__(1)("iterator");
      var SAFE_CLOSING = false;

      try {
        var riter = [7][ITERATOR]();
        riter["return"] = function() {
          SAFE_CLOSING = true;
        };
        // eslint-disable-next-line no-throw-literal
        Array.from(riter, function() {
          throw 2;
        });
      } catch (e) {
        /* empty */
      }

      module.exports = function(exec, skipClosing) {
        if (!skipClosing && !SAFE_CLOSING) return false;
        var safe = false;
        try {
          var arr = [7];
          var iter = arr[ITERATOR]();
          iter.next = function() {
            return { done: (safe = true) };
          };
          arr[ITERATOR] = function() {
            return iter;
          };
          exec(arr);
        } catch (e) {
          /* empty */
        }
        return safe;
      };

      /***/
    },
    /* 53 */
    /***/ function(module, exports, __webpack_require__) {
      module.exports = { default: __webpack_require__(94), __esModule: true };

      /***/
    },
    /* 54 */
    /***/ function(module, exports, __webpack_require__) {
      "use strict";

      exports.decode = exports.parse = __webpack_require__(104);
      exports.encode = exports.stringify = __webpack_require__(105);

      /***/
    },
    /* 55 */
    /***/ function(module, exports, __webpack_require__) {
      module.exports = { default: __webpack_require__(111), __esModule: true };

      /***/
    },
    /* 56 */
    /***/ function(module, exports) {
      /***/
    },
    /* 57 */
    /***/ function(module, exports, __webpack_require__) {
      // 7.3.20 SpeciesConstructor(O, defaultConstructor)
      var anObject = __webpack_require__(5);
      var aFunction = __webpack_require__(20);
      var SPECIES = __webpack_require__(1)("species");
      module.exports = function(O, D) {
        var C = anObject(O).constructor;
        var S;
        return C === undefined || (S = anObject(C)[SPECIES]) == undefined
          ? D
          : aFunction(S);
      };

      /***/
    },
    /* 58 */
    /***/ function(module, exports, __webpack_require__) {
      var ctx = __webpack_require__(14);
      var invoke = __webpack_require__(115);
      var html = __webpack_require__(45);
      var cel = __webpack_require__(26);
      var global = __webpack_require__(2);
      var process = global.process;
      var setTask = global.setImmediate;
      var clearTask = global.clearImmediate;
      var MessageChannel = global.MessageChannel;
      var Dispatch = global.Dispatch;
      var counter = 0;
      var queue = {};
      var ONREADYSTATECHANGE = "onreadystatechange";
      var defer, channel, port;
      var run = function() {
        var id = +this;
        // eslint-disable-next-line no-prototype-builtins
        if (queue.hasOwnProperty(id)) {
          var fn = queue[id];
          delete queue[id];
          fn();
        }
      };
      var listener = function(event) {
        run.call(event.data);
      };
      // Node.js 0.9+ & IE10+ has setImmediate, otherwise:
      if (!setTask || !clearTask) {
        setTask = function setImmediate(fn) {
          var args = [];
          var i = 1;
          while (arguments.length > i) args.push(arguments[i++]);
          queue[++counter] = function() {
            // eslint-disable-next-line no-new-func
            invoke(typeof fn == "function" ? fn : Function(fn), args);
          };
          defer(counter);
          return counter;
        };
        clearTask = function clearImmediate(id) {
          delete queue[id];
        };
        // Node.js 0.8-
        if (__webpack_require__(16)(process) == "process") {
          defer = function(id) {
            process.nextTick(ctx(run, id, 1));
          };
          // Sphere (JS game engine) Dispatch API
        } else if (Dispatch && Dispatch.now) {
          defer = function(id) {
            Dispatch.now(ctx(run, id, 1));
          };
          // Browsers with MessageChannel, includes WebWorkers
        } else if (MessageChannel) {
          channel = new MessageChannel();
          port = channel.port2;
          channel.port1.onmessage = listener;
          defer = ctx(port.postMessage, port, 1);
          // Browsers with postMessage, skip WebWorkers
          // IE8 has postMessage, but it's sync & typeof its postMessage is 'object'
        } else if (
          global.addEventListener &&
          typeof postMessage == "function" &&
          !global.importScripts
        ) {
          defer = function(id) {
            global.postMessage(id + "", "*");
          };
          global.addEventListener("message", listener, false);
          // IE8-
        } else if (ONREADYSTATECHANGE in cel("script")) {
          defer = function(id) {
            html.appendChild(cel("script"))[ONREADYSTATECHANGE] = function() {
              html.removeChild(this);
              run.call(id);
            };
          };
          // Rest old browsers
        } else {
          defer = function(id) {
            setTimeout(ctx(run, id, 1), 0);
          };
        }
      }
      module.exports = {
        set: setTask,
        clear: clearTask
      };

      /***/
    },
    /* 59 */
    /***/ function(module, exports) {
      module.exports = function(exec) {
        try {
          return { e: false, v: exec() };
        } catch (e) {
          return { e: true, v: e };
        }
      };

      /***/
    },
    /* 60 */
    /***/ function(module, exports, __webpack_require__) {
      var anObject = __webpack_require__(5);
      var isObject = __webpack_require__(8);
      var newPromiseCapability = __webpack_require__(38);

      module.exports = function(C, x) {
        anObject(C);
        if (isObject(x) && x.constructor === C) return x;
        var promiseCapability = newPromiseCapability.f(C);
        var resolve = promiseCapability.resolve;
        resolve(x);
        return promiseCapability.promise;
      };

      /***/
    },
    /* 61 */
    /***/ function(module, exports, __webpack_require__) {
      // 19.1.2.7 / 15.2.3.4 Object.getOwnPropertyNames(O)
      var $keys = __webpack_require__(42);
      var hiddenKeys = __webpack_require__(33).concat("length", "prototype");

      exports.f =
        Object.getOwnPropertyNames ||
        function getOwnPropertyNames(O) {
          return $keys(O, hiddenKeys);
        };

      /***/
    },
    /* 62 */
    /***/ function(module, exports, __webpack_require__) {
      "use strict";

      var _assign = __webpack_require__(19);

      var _assign2 = _interopRequireDefault(_assign);

      function _interopRequireDefault(obj) {
        return obj && obj.__esModule ? obj : { default: obj };
      }

      var FetchMock = __webpack_require__(68);
      var statusTextMap = __webpack_require__(143);
      var theGlobal = typeof window !== "undefined" ? window : self;

      FetchMock.global = theGlobal;
      FetchMock.statusTextMap = statusTextMap;

      FetchMock.config = (0, _assign2.default)(FetchMock.config, {
        Promise: theGlobal.Promise,
        Request: theGlobal.Request,
        Response: theGlobal.Response,
        Headers: theGlobal.Headers
      });

      module.exports = FetchMock.createInstance();

      /***/
    },
    /* 63 */
    /***/ function(module, exports, __webpack_require__) {
      __webpack_require__(64);
      module.exports = __webpack_require__(0).Object.assign;

      /***/
    },
    /* 64 */
    /***/ function(module, exports, __webpack_require__) {
      // 19.1.3.1 Object.assign(target, source)
      var $export = __webpack_require__(3);

      $export($export.S + $export.F, "Object", {
        assign: __webpack_require__(65)
      });

      /***/
    },
    /* 65 */
    /***/ function(module, exports, __webpack_require__) {
      "use strict";

      // 19.1.2.1 Object.assign(target, source, ...)
      var getKeys = __webpack_require__(12);
      var gOPS = __webpack_require__(34);
      var pIE = __webpack_require__(17);
      var toObject = __webpack_require__(22);
      var IObject = __webpack_require__(43);
      var $assign = Object.assign;

      // should work with symbols and should have deterministic property order (V8 bug)
      module.exports =
        !$assign ||
        __webpack_require__(11)(function() {
          var A = {};
          var B = {};
          // eslint-disable-next-line no-undef
          var S = Symbol();
          var K = "abcdefghijklmnopqrst";
          A[S] = 7;
          K.split("").forEach(function(k) {
            B[k] = k;
          });
          return (
            $assign({}, A)[S] != 7 || Object.keys($assign({}, B)).join("") != K
          );
        })
          ? function assign(target, source) {
              // eslint-disable-line no-unused-vars
              var T = toObject(target);
              var aLen = arguments.length;
              var index = 1;
              var getSymbols = gOPS.f;
              var isEnum = pIE.f;
              while (aLen > index) {
                var S = IObject(arguments[index++]);
                var keys = getSymbols
                  ? getKeys(S).concat(getSymbols(S))
                  : getKeys(S);
                var length = keys.length;
                var j = 0;
                var key;
                while (length > j)
                  if (isEnum.call(S, (key = keys[j++]))) T[key] = S[key];
              }
              return T;
            }
          : $assign;

      /***/
    },
    /* 66 */
    /***/ function(module, exports, __webpack_require__) {
      // false -> Array#indexOf
      // true  -> Array#includes
      var toIObject = __webpack_require__(10);
      var toLength = __webpack_require__(29);
      var toAbsoluteIndex = __webpack_require__(67);
      module.exports = function(IS_INCLUDES) {
        return function($this, el, fromIndex) {
          var O = toIObject($this);
          var length = toLength(O.length);
          var index = toAbsoluteIndex(fromIndex, length);
          var value;
          // Array#includes uses SameValueZero equality algorithm
          // eslint-disable-next-line no-self-compare
          if (IS_INCLUDES && el != el)
            while (length > index) {
              value = O[index++];
              // eslint-disable-next-line no-self-compare
              if (value != value) return true;
              // Array#indexOf ignores holes, Array#includes - not
            }
          else
            for (; length > index; index++)
              if (IS_INCLUDES || index in O) {
                if (O[index] === el) return IS_INCLUDES || index || 0;
              }
          return !IS_INCLUDES && -1;
        };
      };

      /***/
    },
    /* 67 */
    /***/ function(module, exports, __webpack_require__) {
      var toInteger = __webpack_require__(30);
      var max = Math.max;
      var min = Math.min;
      module.exports = function(index, length) {
        index = toInteger(index);
        return index < 0 ? max(index + length, 0) : min(index, length);
      };

      /***/
    },
    /* 68 */
    /***/ function(module, exports, __webpack_require__) {
      "use strict";

      var _create = __webpack_require__(44);

      var _create2 = _interopRequireDefault(_create);

      var _assign = __webpack_require__(19);

      var _assign2 = _interopRequireDefault(_assign);

      function _interopRequireDefault(obj) {
        return obj && obj.__esModule ? obj : { default: obj };
      }

      var setUpAndTearDown = __webpack_require__(72);
      var fetchHandler = __webpack_require__(106);
      var inspecting = __webpack_require__(142);

      var FetchMock = (0, _assign2.default)(
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
        var instance = (0, _create2.default)(FetchMock);
        instance.routes = (this.routes || []).slice();
        instance.fallbackResponse = this.fallbackResponse || undefined;
        instance.config = (0, _assign2.default)(
          {},
          this.config || FetchMock.config
        );
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
        var proxy = function proxy(url, options) {
          return sandbox.fetchHandler(url, options);
        };

        var sandbox = (0, _assign2.default)(
          proxy, // Ensures that the entire returned object is a callable function
          FetchMock, // prototype methods
          this.createInstance() // instance data
        );

        sandbox.bindMethods();
        sandbox.isSandbox = true;
        return sandbox;
      };

      module.exports = FetchMock;

      /***/
    },
    /* 69 */
    /***/ function(module, exports, __webpack_require__) {
      __webpack_require__(70);
      var $Object = __webpack_require__(0).Object;
      module.exports = function create(P, D) {
        return $Object.create(P, D);
      };

      /***/
    },
    /* 70 */
    /***/ function(module, exports, __webpack_require__) {
      var $export = __webpack_require__(3);
      // 19.1.2.2 / 15.2.3.5 Object.create(O [, Properties])
      $export($export.S, "Object", { create: __webpack_require__(35) });

      /***/
    },
    /* 71 */
    /***/ function(module, exports, __webpack_require__) {
      var dP = __webpack_require__(4);
      var anObject = __webpack_require__(5);
      var getKeys = __webpack_require__(12);

      module.exports = __webpack_require__(6)
        ? Object.defineProperties
        : function defineProperties(O, Properties) {
            anObject(O);
            var keys = getKeys(Properties);
            var length = keys.length;
            var i = 0;
            var P;
            while (length > i) dP.f(O, (P = keys[i++]), Properties[P]);
            return O;
          };

      /***/
    },
    /* 72 */
    /***/ function(module, exports, __webpack_require__) {
      "use strict";

      var _assign = __webpack_require__(19);

      var _assign2 = _interopRequireDefault(_assign);

      function _interopRequireDefault(obj) {
        return obj && obj.__esModule ? obj : { default: obj };
      }

      var compileRoute = __webpack_require__(73);
      var FetchMock = {};

      FetchMock.mock = function(matcher, response) {
        var options =
          arguments.length > 2 && arguments[2] !== undefined
            ? arguments[2]
            : {};

        var route = void 0;

        // Handle the variety of parameters accepted by mock (see README)
        if (matcher && response) {
          route = (0, _assign2.default)(
            {
              matcher: matcher,
              response: response
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

      var getMatcher = function getMatcher(route, propName) {
        return function(route2) {
          return route[propName] === route2[propName];
        };
      };

      FetchMock.addRoute = function(route) {
        route = this.compileRoute(route);

        var clashes = this.routes.filter(getMatcher(route, "name"));
        var overwriteRoutes =
          "overwriteRoutes" in route
            ? route.overwriteRoutes
            : this.config.overwriteRoutes;

        if (overwriteRoutes === false || !clashes.length) {
          return this.routes.push(route);
        }

        var methodsMatch = getMatcher(route, "method");

        if (overwriteRoutes === true) {
          return this.routes.splice(
            this.routes.indexOf(clashes.find(methodsMatch)),
            1,
            route
          );
        }

        if (
          clashes.some(function(existingRoute) {
            return !route.method || methodsMatch(existingRoute);
          })
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

      FetchMock.once = function(matcher, response) {
        var options =
          arguments.length > 2 && arguments[2] !== undefined
            ? arguments[2]
            : {};

        return this.mock(
          matcher,
          response,
          (0, _assign2.default)({}, options, { repeat: 1 })
        );
      };

      ["get", "post", "put", "delete", "head", "patch"].forEach(function(
        method
      ) {
        FetchMock[method] = function(matcher, response) {
          var options =
            arguments.length > 2 && arguments[2] !== undefined
              ? arguments[2]
              : {};

          return this.mock(
            matcher,
            response,
            (0, _assign2.default)({}, options, { method: method.toUpperCase() })
          );
        };
        FetchMock[method + "Once"] = function(matcher, response) {
          var options =
            arguments.length > 2 && arguments[2] !== undefined
              ? arguments[2]
              : {};

          return this.once(
            matcher,
            response,
            (0, _assign2.default)({}, options, { method: method.toUpperCase() })
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
        this.routes.forEach(function(route) {
          return route.reset && route.reset();
        });
        return this;
      };

      module.exports = FetchMock;

      /***/
    },
    /* 73 */
    /***/ function(module, exports, __webpack_require__) {
      "use strict";

      var _assign = __webpack_require__(19);

      var _assign2 = _interopRequireDefault(_assign);

      var _slicedToArray2 = __webpack_require__(46);

      var _slicedToArray3 = _interopRequireDefault(_slicedToArray2);

      var _toConsumableArray2 = __webpack_require__(49);

      var _toConsumableArray3 = _interopRequireDefault(_toConsumableArray2);

      var _entries = __webpack_require__(90);

      var _entries2 = _interopRequireDefault(_entries);

      var _keys = __webpack_require__(53);

      var _keys2 = _interopRequireDefault(_keys);

      function _interopRequireDefault(obj) {
        return obj && obj.__esModule ? obj : { default: obj };
      }

      var _glob = __webpack_require__(97);
      var _express = __webpack_require__(98);
      var URL = __webpack_require__(99);
      var querystring = __webpack_require__(54);

      function normalizeRequest(url, options, Request) {
        if (Request.prototype.isPrototypeOf(url)) {
          return {
            url: url.url,
            method: url.method,
            headers: (function() {
              var headers = {};
              url.headers.forEach(function(name) {
                return (headers[name] = url.headers.name);
              });
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

      var stringMatchers = {
        begin: function begin(targetString) {
          return function(_ref) {
            var url = _ref.url;
            return url.indexOf(targetString) === 0;
          };
        },
        end: function end(targetString) {
          return function(_ref2) {
            var url = _ref2.url;
            return url.substr(-targetString.length) === targetString;
          };
        },
        glob: function glob(targetString) {
          var urlRX = _glob(targetString);
          return function(_ref3) {
            var url = _ref3.url;
            return urlRX.test(url);
          };
        },
        express: function express(targetString) {
          var urlRX = _express(targetString);
          return function(_ref4) {
            var url = _ref4.url;
            return urlRX.test(url);
          };
        }
      };

      var headersToLowerCase = function headersToLowerCase(headers) {
        return (0, _keys2.default)(headers).reduce(function(obj, k) {
          obj[k.toLowerCase()] = headers[k];
          return obj;
        }, {});
      };

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

        return actualHeader.every(function(val, i) {
          return val === expectedHeader[i];
        });
      }

      function getHeaderMatcher(_ref5, Headers) {
        var expectedHeaders = _ref5.headers;

        if (!expectedHeaders) {
          return function() {
            return true;
          };
        }
        var expectation = headersToLowerCase(expectedHeaders);

        return function(_ref6) {
          var _ref6$headers = _ref6.headers,
            headers = _ref6$headers === undefined ? {} : _ref6$headers;

          if (headers instanceof Headers) {
            // node-fetch 1 Headers
            if (typeof headers.raw === "function") {
              headers = (0, _entries2.default)(headers.raw());
            }
            headers = []
              .concat((0, _toConsumableArray3.default)(headers))
              .reduce(function(map, _ref7) {
                var _ref8 = (0, _slicedToArray3.default)(_ref7, 2),
                  key = _ref8[0],
                  val = _ref8[1];

                map[key] = val;
                return map;
              }, {});
          }

          var lowerCaseHeaders = headersToLowerCase(headers);

          return (0, _keys2.default)(expectation).every(function(headerName) {
            return areHeadersEqual(
              lowerCaseHeaders[headerName],
              expectation[headerName]
            );
          });
        };
      }

      var getMethodMatcher = function getMethodMatcher(route) {
        return function(_ref9) {
          var method = _ref9.method;

          return (
            !route.method ||
            route.method === (method ? method.toLowerCase() : "get")
          );
        };
      };

      var getQueryStringMatcher = function getQueryStringMatcher(route) {
        if (!route.query) {
          return function() {
            return true;
          };
        }
        var keys = (0, _keys2.default)(route.query);
        return function(_ref10) {
          var url = _ref10.url;

          var query = querystring.parse(URL.parse(url).query);
          return keys.every(function(key) {
            return query[key] === route.query[key];
          });
        };
      };

      var getUrlMatcher = function getUrlMatcher(route) {
        // When the matcher is a function it shodul not be compared with the url
        // in the normal way
        if (typeof route.matcher === "function") {
          return function() {
            return true;
          };
        }

        if (route.matcher instanceof RegExp) {
          var urlRX = route.matcher;
          return function(_ref11) {
            var url = _ref11.url;
            return urlRX.test(url);
          };
        }

        if (route.matcher === "*") {
          return function() {
            return true;
          };
        }

        if (route.matcher.indexOf("^") === 0) {
          throw new Error(
            "Using '^' to denote the start of a url is deprecated. Use 'begin:' instead"
          );
        }

        for (var shorthand in stringMatchers) {
          if (route.matcher.indexOf(shorthand + ":") === 0) {
            var url = route.matcher.replace(
              new RegExp("^" + shorthand + ":"),
              ""
            );
            return stringMatchers[shorthand](url);
          }
        }

        // if none of the special syntaxes apply, it's just a simple string match
        var expectedUrl = route.matcher;
        return function(_ref12) {
          var url = _ref12.url;

          if (route.query && expectedUrl.indexOf("?")) {
            return url.indexOf(expectedUrl) === 0;
          }
          return url === expectedUrl;
        };
      };

      var sanitizeRoute = function sanitizeRoute(route) {
        route = (0, _assign2.default)({}, route);

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

      var getFunctionMatcher = function getFunctionMatcher(route) {
        if (typeof route.matcher === "function") {
          var matcher = route.matcher;
          return function(req, _ref13) {
            var _ref14 = (0, _slicedToArray3.default)(_ref13, 2),
              url = _ref14[0],
              options = _ref14[1];

            return matcher(url, options);
          };
        } else {
          return function() {
            return true;
          };
        }
      };

      var generateMatcher = function generateMatcher(route, config) {
        var matchers = [
          getQueryStringMatcher(route),
          getMethodMatcher(route),
          getHeaderMatcher(route, config.Headers),
          getUrlMatcher(route),
          getFunctionMatcher(route)
        ];

        return function(url, options) {
          var req = normalizeRequest(url, options, config.Request);
          return matchers.every(function(matcher) {
            return matcher(req, [url, options]);
          });
        };
      };

      var limitMatcher = function limitMatcher(route) {
        if (!route.repeat) {
          return;
        }

        var matcher = route.matcher;
        var timesLeft = route.repeat;
        route.matcher = function(url, options) {
          var match = timesLeft && matcher(url, options);
          if (match) {
            timesLeft--;
            return true;
          }
        };
        route.reset = function() {
          return (timesLeft = route.repeat);
        };
      };

      module.exports = function(route) {
        route = sanitizeRoute(route);

        route.matcher = generateMatcher(route, this.config);

        limitMatcher(route);

        return route;
      };

      /***/
    },
    /* 74 */
    /***/ function(module, exports, __webpack_require__) {
      module.exports = { default: __webpack_require__(75), __esModule: true };

      /***/
    },
    /* 75 */
    /***/ function(module, exports, __webpack_require__) {
      __webpack_require__(23);
      __webpack_require__(18);
      module.exports = __webpack_require__(82);

      /***/
    },
    /* 76 */
    /***/ function(module, exports, __webpack_require__) {
      "use strict";

      var addToUnscopables = __webpack_require__(77);
      var step = __webpack_require__(78);
      var Iterators = __webpack_require__(13);
      var toIObject = __webpack_require__(10);

      // 22.1.3.4 Array.prototype.entries()
      // 22.1.3.13 Array.prototype.keys()
      // 22.1.3.29 Array.prototype.values()
      // 22.1.3.30 Array.prototype[@@iterator]()
      module.exports = __webpack_require__(47)(
        Array,
        "Array",
        function(iterated, kind) {
          this._t = toIObject(iterated); // target
          this._i = 0; // next index
          this._k = kind; // kind
          // 22.1.5.2.1 %ArrayIteratorPrototype%.next()
        },
        function() {
          var O = this._t;
          var kind = this._k;
          var index = this._i++;
          if (!O || index >= O.length) {
            this._t = undefined;
            return step(1);
          }
          if (kind == "keys") return step(0, index);
          if (kind == "values") return step(0, O[index]);
          return step(0, [index, O[index]]);
        },
        "values"
      );

      // argumentsList[@@iterator] is %ArrayProto_values% (9.4.4.6, 9.4.4.7)
      Iterators.Arguments = Iterators.Array;

      addToUnscopables("keys");
      addToUnscopables("values");
      addToUnscopables("entries");

      /***/
    },
    /* 77 */
    /***/ function(module, exports) {
      module.exports = function() {
        /* empty */
      };

      /***/
    },
    /* 78 */
    /***/ function(module, exports) {
      module.exports = function(done, value) {
        return { value: value, done: !!done };
      };

      /***/
    },
    /* 79 */
    /***/ function(module, exports, __webpack_require__) {
      "use strict";

      var create = __webpack_require__(35);
      var descriptor = __webpack_require__(15);
      var setToStringTag = __webpack_require__(25);
      var IteratorPrototype = {};

      // 25.1.2.1.1 %IteratorPrototype%[@@iterator]()
      __webpack_require__(7)(
        IteratorPrototype,
        __webpack_require__(1)("iterator"),
        function() {
          return this;
        }
      );

      module.exports = function(Constructor, NAME, next) {
        Constructor.prototype = create(IteratorPrototype, {
          next: descriptor(1, next)
        });
        setToStringTag(Constructor, NAME + " Iterator");
      };

      /***/
    },
    /* 80 */
    /***/ function(module, exports, __webpack_require__) {
      // 19.1.2.9 / 15.2.3.2 Object.getPrototypeOf(O)
      var has = __webpack_require__(9);
      var toObject = __webpack_require__(22);
      var IE_PROTO = __webpack_require__(31)("IE_PROTO");
      var ObjectProto = Object.prototype;

      module.exports =
        Object.getPrototypeOf ||
        function(O) {
          O = toObject(O);
          if (has(O, IE_PROTO)) return O[IE_PROTO];
          if (
            typeof O.constructor == "function" &&
            O instanceof O.constructor
          ) {
            return O.constructor.prototype;
          }
          return O instanceof Object ? ObjectProto : null;
        };

      /***/
    },
    /* 81 */
    /***/ function(module, exports, __webpack_require__) {
      var toInteger = __webpack_require__(30);
      var defined = __webpack_require__(28);
      // true  -> String#at
      // false -> String#codePointAt
      module.exports = function(TO_STRING) {
        return function(that, pos) {
          var s = String(defined(that));
          var i = toInteger(pos);
          var l = s.length;
          var a, b;
          if (i < 0 || i >= l) return TO_STRING ? "" : undefined;
          a = s.charCodeAt(i);
          return a < 0xd800 ||
            a > 0xdbff ||
            i + 1 === l ||
            (b = s.charCodeAt(i + 1)) < 0xdc00 ||
            b > 0xdfff
            ? TO_STRING ? s.charAt(i) : a
            : TO_STRING
              ? s.slice(i, i + 2)
              : ((a - 0xd800) << 10) + (b - 0xdc00) + 0x10000;
        };
      };

      /***/
    },
    /* 82 */
    /***/ function(module, exports, __webpack_require__) {
      var classof = __webpack_require__(36);
      var ITERATOR = __webpack_require__(1)("iterator");
      var Iterators = __webpack_require__(13);
      module.exports = __webpack_require__(0).isIterable = function(it) {
        var O = Object(it);
        return (
          O[ITERATOR] !== undefined ||
          "@@iterator" in O ||
          // eslint-disable-next-line no-prototype-builtins
          Iterators.hasOwnProperty(classof(O))
        );
      };

      /***/
    },
    /* 83 */
    /***/ function(module, exports, __webpack_require__) {
      module.exports = { default: __webpack_require__(84), __esModule: true };

      /***/
    },
    /* 84 */
    /***/ function(module, exports, __webpack_require__) {
      __webpack_require__(23);
      __webpack_require__(18);
      module.exports = __webpack_require__(85);

      /***/
    },
    /* 85 */
    /***/ function(module, exports, __webpack_require__) {
      var anObject = __webpack_require__(5);
      var get = __webpack_require__(37);
      module.exports = __webpack_require__(0).getIterator = function(it) {
        var iterFn = get(it);
        if (typeof iterFn != "function")
          throw TypeError(it + " is not iterable!");
        return anObject(iterFn.call(it));
      };

      /***/
    },
    /* 86 */
    /***/ function(module, exports, __webpack_require__) {
      module.exports = { default: __webpack_require__(87), __esModule: true };

      /***/
    },
    /* 87 */
    /***/ function(module, exports, __webpack_require__) {
      __webpack_require__(18);
      __webpack_require__(88);
      module.exports = __webpack_require__(0).Array.from;

      /***/
    },
    /* 88 */
    /***/ function(module, exports, __webpack_require__) {
      "use strict";

      var ctx = __webpack_require__(14);
      var $export = __webpack_require__(3);
      var toObject = __webpack_require__(22);
      var call = __webpack_require__(50);
      var isArrayIter = __webpack_require__(51);
      var toLength = __webpack_require__(29);
      var createProperty = __webpack_require__(89);
      var getIterFn = __webpack_require__(37);

      $export(
        $export.S +
          $export.F *
            !__webpack_require__(52)(function(iter) {
              Array.from(iter);
            }),
        "Array",
        {
          // 22.1.2.1 Array.from(arrayLike, mapfn = undefined, thisArg = undefined)
          from: function from(
            arrayLike /* , mapfn = undefined, thisArg = undefined */
          ) {
            var O = toObject(arrayLike);
            var C = typeof this == "function" ? this : Array;
            var aLen = arguments.length;
            var mapfn = aLen > 1 ? arguments[1] : undefined;
            var mapping = mapfn !== undefined;
            var index = 0;
            var iterFn = getIterFn(O);
            var length, result, step, iterator;
            if (mapping)
              mapfn = ctx(mapfn, aLen > 2 ? arguments[2] : undefined, 2);
            // if object isn't iterable or it's array with default iterator - use simple case
            if (iterFn != undefined && !(C == Array && isArrayIter(iterFn))) {
              for (
                iterator = iterFn.call(O), result = new C();
                !(step = iterator.next()).done;
                index++
              ) {
                createProperty(
                  result,
                  index,
                  mapping
                    ? call(iterator, mapfn, [step.value, index], true)
                    : step.value
                );
              }
            } else {
              length = toLength(O.length);
              for (result = new C(length); length > index; index++) {
                createProperty(
                  result,
                  index,
                  mapping ? mapfn(O[index], index) : O[index]
                );
              }
            }
            result.length = index;
            return result;
          }
        }
      );

      /***/
    },
    /* 89 */
    /***/ function(module, exports, __webpack_require__) {
      "use strict";

      var $defineProperty = __webpack_require__(4);
      var createDesc = __webpack_require__(15);

      module.exports = function(object, index, value) {
        if (index in object)
          $defineProperty.f(object, index, createDesc(0, value));
        else object[index] = value;
      };

      /***/
    },
    /* 90 */
    /***/ function(module, exports, __webpack_require__) {
      module.exports = { default: __webpack_require__(91), __esModule: true };

      /***/
    },
    /* 91 */
    /***/ function(module, exports, __webpack_require__) {
      __webpack_require__(92);
      module.exports = __webpack_require__(0).Object.entries;

      /***/
    },
    /* 92 */
    /***/ function(module, exports, __webpack_require__) {
      // https://github.com/tc39/proposal-object-values-entries
      var $export = __webpack_require__(3);
      var $entries = __webpack_require__(93)(true);

      $export($export.S, "Object", {
        entries: function entries(it) {
          return $entries(it);
        }
      });

      /***/
    },
    /* 93 */
    /***/ function(module, exports, __webpack_require__) {
      var getKeys = __webpack_require__(12);
      var toIObject = __webpack_require__(10);
      var isEnum = __webpack_require__(17).f;
      module.exports = function(isEntries) {
        return function(it) {
          var O = toIObject(it);
          var keys = getKeys(O);
          var length = keys.length;
          var i = 0;
          var result = [];
          var key;
          while (length > i)
            if (isEnum.call(O, (key = keys[i++]))) {
              result.push(isEntries ? [key, O[key]] : O[key]);
            }
          return result;
        };
      };

      /***/
    },
    /* 94 */
    /***/ function(module, exports, __webpack_require__) {
      __webpack_require__(95);
      module.exports = __webpack_require__(0).Object.keys;

      /***/
    },
    /* 95 */
    /***/ function(module, exports, __webpack_require__) {
      // 19.1.2.14 Object.keys(O)
      var toObject = __webpack_require__(22);
      var $keys = __webpack_require__(12);

      __webpack_require__(96)("keys", function() {
        return function keys(it) {
          return $keys(toObject(it));
        };
      });

      /***/
    },
    /* 96 */
    /***/ function(module, exports, __webpack_require__) {
      // most Object methods by ES6 should accept primitives
      var $export = __webpack_require__(3);
      var core = __webpack_require__(0);
      var fails = __webpack_require__(11);
      module.exports = function(KEY, exec) {
        var fn = (core.Object || {})[KEY] || Object[KEY];
        var exp = {};
        exp[KEY] = exec(fn);
        $export(
          $export.S +
            $export.F *
              fails(function() {
                fn(1);
              }),
          "Object",
          exp
        );
      };

      /***/
    },
    /* 97 */
    /***/ function(module, exports) {
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
        var flags = opts && typeof opts.flags === "string" ? opts.flags : "";

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

      /***/
    },
    /* 98 */
    /***/ function(module, exports) {
      /**
       * Expose `pathToRegexp`.
       */
      module.exports = pathToRegexp;
      module.exports.parse = parse;
      module.exports.compile = compile;
      module.exports.tokensToFunction = tokensToFunction;
      module.exports.tokensToRegExp = tokensToRegExp;

      /**
       * Default configs.
       */
      var DEFAULT_DELIMITER = "/";
      var DEFAULT_DELIMITERS = "./";

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
          // "/:test(\\d+)?" => ["/", "test", "\d+", undefined, "?"]
          // "/route(\\d+)"  => [undefined, undefined, undefined, "\d+", undefined]
          "(?:\\:(\\w+)(?:\\(((?:\\\\.|[^\\\\()])+)\\))?|\\(((?:\\\\.|[^\\\\()])+)\\))([+*?])?"
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
        var defaultDelimiter =
          (options && options.delimiter) || DEFAULT_DELIMITER;
        var delimiters = (options && options.delimiters) || DEFAULT_DELIMITERS;
        var pathEscaped = false;
        var res;

        while ((res = PATH_REGEXP.exec(str)) !== null) {
          var m = res[0];
          var escaped = res[1];
          var offset = res.index;
          path += str.slice(index, offset);
          index = offset + m.length;

          // Ignore already escaped sequences.
          if (escaped) {
            path += escaped[1];
            pathEscaped = true;
            continue;
          }

          var prev = "";
          var next = str[index];
          var name = res[2];
          var capture = res[3];
          var group = res[4];
          var modifier = res[5];

          if (!pathEscaped && path.length) {
            var k = path.length - 1;

            if (delimiters.indexOf(path[k]) > -1) {
              prev = path[k];
              path = path.slice(0, k);
            }
          }

          // Push the current path onto the tokens.
          if (path) {
            tokens.push(path);
            path = "";
            pathEscaped = false;
          }

          var partial = prev !== "" && next !== undefined && next !== prev;
          var repeat = modifier === "+" || modifier === "*";
          var optional = modifier === "?" || modifier === "*";
          var delimiter = prev || defaultDelimiter;
          var pattern = capture || group;

          tokens.push({
            name: name || key++,
            prefix: prev,
            delimiter: delimiter,
            optional: optional,
            repeat: repeat,
            partial: partial,
            pattern: pattern
              ? escapeGroup(pattern)
              : "[^" + escapeString(delimiter) + "]+?"
          });
        }

        // Push any remaining characters.
        if (path || index < str.length) {
          tokens.push(path + str.substr(index));
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

        return function(data, options) {
          var path = "";
          var encode = (options && options.encode) || encodeURIComponent;

          for (var i = 0; i < tokens.length; i++) {
            var token = tokens[i];

            if (typeof token === "string") {
              path += token;
              continue;
            }

            var value = data ? data[token.name] : undefined;
            var segment;

            if (Array.isArray(value)) {
              if (!token.repeat) {
                throw new TypeError(
                  'Expected "' + token.name + '" to not repeat, but got array'
                );
              }

              if (value.length === 0) {
                if (token.optional) continue;

                throw new TypeError(
                  'Expected "' + token.name + '" to not be empty'
                );
              }

              for (var j = 0; j < value.length; j++) {
                segment = encode(value[j]);

                if (!matches[i].test(segment)) {
                  throw new TypeError(
                    'Expected all "' +
                      token.name +
                      '" to match "' +
                      token.pattern +
                      '"'
                  );
                }

                path += (j === 0 ? token.prefix : token.delimiter) + segment;
              }

              continue;
            }

            if (
              typeof value === "string" ||
              typeof value === "number" ||
              typeof value === "boolean"
            ) {
              segment = encode(String(value));

              if (!matches[i].test(segment)) {
                throw new TypeError(
                  'Expected "' +
                    token.name +
                    '" to match "' +
                    token.pattern +
                    '", but got "' +
                    segment +
                    '"'
                );
              }

              path += token.prefix + segment;
              continue;
            }

            if (token.optional) {
              // Prepend partial segment prefixes.
              if (token.partial) path += token.prefix;

              continue;
            }

            throw new TypeError(
              'Expected "' +
                token.name +
                '" to be ' +
                (token.repeat ? "an array" : "a string")
            );
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
        return str.replace(/([.+*?=^!:${}()[\]|/\\])/g, "\\$1");
      }

      /**
       * Escape the capturing group by escaping special characters and meaning.
       *
       * @param  {string} group
       * @return {string}
       */
      function escapeGroup(group) {
        return group.replace(/([=!:$/()])/g, "\\$1");
      }

      /**
       * Get the flags for a regexp from the options.
       *
       * @param  {Object} options
       * @return {string}
       */
      function flags(options) {
        return options && options.sensitive ? "" : "i";
      }

      /**
       * Pull out keys from a regexp.
       *
       * @param  {!RegExp} path
       * @param  {Array=}  keys
       * @return {!RegExp}
       */
      function regexpToRegexp(path, keys) {
        if (!keys) return path;

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
              pattern: null
            });
          }
        }

        return path;
      }

      /**
       * Transform an array into a regexp.
       *
       * @param  {!Array}  path
       * @param  {Array=}  keys
       * @param  {Object=} options
       * @return {!RegExp}
       */
      function arrayToRegexp(path, keys, options) {
        var parts = [];

        for (var i = 0; i < path.length; i++) {
          parts.push(pathToRegexp(path[i], keys, options).source);
        }

        return new RegExp("(?:" + parts.join("|") + ")", flags(options));
      }

      /**
       * Create a path regexp from string input.
       *
       * @param  {string}  path
       * @param  {Array=}  keys
       * @param  {Object=} options
       * @return {!RegExp}
       */
      function stringToRegexp(path, keys, options) {
        return tokensToRegExp(parse(path, options), keys, options);
      }

      /**
       * Expose a function for taking tokens and returning a RegExp.
       *
       * @param  {!Array}  tokens
       * @param  {Array=}  keys
       * @param  {Object=} options
       * @return {!RegExp}
       */
      function tokensToRegExp(tokens, keys, options) {
        options = options || {};

        var strict = options.strict;
        var end = options.end !== false;
        var delimiter = escapeString(options.delimiter || DEFAULT_DELIMITER);
        var delimiters = options.delimiters || DEFAULT_DELIMITERS;
        var endsWith = []
          .concat(options.endsWith || [])
          .map(escapeString)
          .concat("$")
          .join("|");
        var route = "";
        var isEndDelimited = false;

        // Iterate over the tokens and create our regexp string.
        for (var i = 0; i < tokens.length; i++) {
          var token = tokens[i];

          if (typeof token === "string") {
            route += escapeString(token);
            isEndDelimited =
              i === tokens.length - 1 &&
              delimiters.indexOf(token[token.length - 1]) > -1;
          } else {
            var prefix = escapeString(token.prefix);
            var capture = token.repeat
              ? "(?:" +
                token.pattern +
                ")(?:" +
                prefix +
                "(?:" +
                token.pattern +
                "))*"
              : token.pattern;

            if (keys) keys.push(token);

            if (token.optional) {
              if (token.partial) {
                route += prefix + "(" + capture + ")?";
              } else {
                route += "(?:" + prefix + "(" + capture + "))?";
              }
            } else {
              route += prefix + "(" + capture + ")";
            }
          }
        }

        if (end) {
          if (!strict) route += "(?:" + delimiter + ")?";

          route += endsWith === "$" ? "$" : "(?=" + endsWith + ")";
        } else {
          if (!strict) route += "(?:" + delimiter + "(?=" + endsWith + "))?";
          if (!isEndDelimited)
            route += "(?=" + delimiter + "|" + endsWith + ")";
        }

        return new RegExp("^" + route, flags(options));
      }

      /**
       * Normalize the given path string, returning a regular expression.
       *
       * An empty array can be passed in for the keys, which will hold the
       * placeholder key descriptions. For example, using `/user/:id`, `keys` will
       * contain `[{ name: 'id', delimiter: '/', optional: false, repeat: false }]`.
       *
       * @param  {(string|RegExp|Array)} path
       * @param  {Array=}                keys
       * @param  {Object=}               options
       * @return {!RegExp}
       */
      function pathToRegexp(path, keys, options) {
        if (path instanceof RegExp) {
          return regexpToRegexp(path, keys);
        }

        if (Array.isArray(path)) {
          return arrayToRegexp(/** @type {!Array} */ (path), keys, options);
        }

        return stringToRegexp(/** @type {string} */ (path), keys, options);
      }

      /***/
    },
    /* 99 */
    /***/ function(module, exports, __webpack_require__) {
      "use strict";
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

      var punycode = __webpack_require__(100);
      var util = __webpack_require__(103);

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
        querystring = __webpack_require__(54);

      function urlParse(url, parseQueryString, slashesDenoteHost) {
        if (url && util.isObject(url) && url instanceof Url) return url;

        var u = new Url();
        u.parse(url, parseQueryString, slashesDenoteHost);
        return u;
      }

      Url.prototype.parse = function(url, parseQueryString, slashesDenoteHost) {
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
        if (slashesDenoteHost || proto || rest.match(/^\/\/[^@\/]+@[^@\/]+/)) {
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
            if (hec !== -1 && (hostEnd === -1 || hec < hostEnd)) hostEnd = hec;
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
            if (hec !== -1 && (hostEnd === -1 || hec < hostEnd)) hostEnd = hec;
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
            this.hostname = this.hostname.substr(1, this.hostname.length - 2);
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
        if (slashedProtocol[lowerProto] && this.hostname && !this.pathname) {
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
          if (pathname && pathname.charAt(0) !== "/") pathname = "/" + pathname;
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

        var isSourceAbs = result.pathname && result.pathname.charAt(0) === "/",
          isRelAbs =
            relative.host ||
            (relative.pathname && relative.pathname.charAt(0) === "/"),
          mustEndAbs =
            isRelAbs || isSourceAbs || (result.host && relative.pathname),
          removeAllDots = mustEndAbs,
          srcPath = (result.pathname && result.pathname.split("/")) || [],
          relPath = (relative.pathname && relative.pathname.split("/")) || [],
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
          mustEndAbs = mustEndAbs && (relPath[0] === "" || srcPath[0] === "");
        }

        if (isRelAbs) {
          // it's absolute.
          result.host =
            relative.host || relative.host === "" ? relative.host : result.host;
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
          if (!util.isNull(result.pathname) || !util.isNull(result.search)) {
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

      /***/
    },
    /* 100 */
    /***/ function(module, exports, __webpack_require__) {
      /* WEBPACK VAR INJECTION */ (function(module, global) {
        var __WEBPACK_AMD_DEFINE_RESULT__; /*! https://mths.be/punycode v1.4.1 by @mathias */
        (function(root) {
          /** Detect free variables */
          var freeExports =
            typeof exports == "object" &&
            exports &&
            !exports.nodeType &&
            exports;
          var freeModule =
            typeof module == "object" && module && !module.nodeType && module;
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
                output += stringFromCharCode(((value >>> 10) & 0x3ff) | 0xd800);
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
              for (oldi = i, w = 1, k = base /* no condition */; ; k += base) {
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
                  for (q = delta, k = base /* no condition */; ; k += base) {
                    t = k <= bias ? tMin : k >= bias + tMax ? tMax : k - bias;
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
          if (true) {
            !((__WEBPACK_AMD_DEFINE_RESULT__ = function() {
              return punycode;
            }.call(exports, __webpack_require__, exports, module)),
            __WEBPACK_AMD_DEFINE_RESULT__ !== undefined &&
              (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
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

        /* WEBPACK VAR INJECTION */
      }.call(
        exports,
        __webpack_require__(101)(module),
        __webpack_require__(102)
      ));

      /***/
    },
    /* 101 */
    /***/ function(module, exports) {
      module.exports = function(module) {
        if (!module.webpackPolyfill) {
          module.deprecate = function() {};
          module.paths = [];
          // module.parent = undefined by default
          if (!module.children) module.children = [];
          Object.defineProperty(module, "loaded", {
            enumerable: true,
            get: function() {
              return module.l;
            }
          });
          Object.defineProperty(module, "id", {
            enumerable: true,
            get: function() {
              return module.i;
            }
          });
          module.webpackPolyfill = 1;
        }
        return module;
      };

      /***/
    },
    /* 102 */
    /***/ function(module, exports) {
      var g;

      // This works in non-strict mode
      g = (function() {
        return this;
      })();

      try {
        // This works if eval is allowed (see CSP)
        g = g || Function("return this")() || (1, eval)("this");
      } catch (e) {
        // This works if the window reference is available
        if (typeof window === "object") g = window;
      }

      // g can still be undefined, but nothing to do about it...
      // We return undefined, instead of nothing here, so it's
      // easier to handle this case. if(!global) { ...}

      module.exports = g;

      /***/
    },
    /* 103 */
    /***/ function(module, exports, __webpack_require__) {
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

      /***/
    },
    /* 104 */
    /***/ function(module, exports, __webpack_require__) {
      "use strict";
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

      /***/
    },
    /* 105 */
    /***/ function(module, exports, __webpack_require__) {
      "use strict";
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
            if (Object.prototype.hasOwnProperty.call(obj, key)) res.push(key);
          }
          return res;
        };

      /***/
    },
    /* 106 */
    /***/ function(module, exports, __webpack_require__) {
      "use strict";

      var _regenerator = __webpack_require__(107);

      var _regenerator2 = _interopRequireDefault(_regenerator);

      var _asyncToGenerator2 = __webpack_require__(110);

      var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

      function _interopRequireDefault(obj) {
        return obj && obj.__esModule ? obj : { default: obj };
      }

      var ResponseBuilder = __webpack_require__(121);

      var FetchMock = {};

      FetchMock.fetchHandler = function(url, opts) {
        var _this = this;

        var response = this.executeRouter(url, opts);

        // If the response says to throw an error, throw it
        // It only makes sense to do this before doing any async stuff below
        // as the async stuff swallows catastrophic errors in a promise
        // Type checking is to deal with sinon spies having a throws property :-0
        if (response.throws && typeof response !== "function") {
          throw response.throws;
        }

        // this is used to power the .flush() method
        var done = void 0;
        this._holdingPromises.push(
          new this.config.Promise(function(res) {
            return (done = res);
          })
        );

        // wrapped in this promise to make sure we respect custom Promise
        // constructors defined by the user
        return new this.config.Promise(function(res, rej) {
          _this
            .generateResponse(response, url, opts)
            .then(res, rej)
            .then(done, done);
        });
      };

      FetchMock.fetchHandler.isMock = true;

      FetchMock.executeRouter = function(url, opts) {
        var response = this.router(url, opts);

        if (response) {
          return response;
        }

        if (this.config.warnOnFallback) {
          console.warn(
            "Unmatched " + ((opts && opts.method) || "GET") + " to " + url
          ); // eslint-disable-line
        }

        this.push(null, [url, opts]);

        if (this.fallbackResponse) {
          return this.fallbackResponse;
        }

        if (!this.config.fallbackToNetwork) {
          throw new Error(
            "No fallback response defined for " +
              ((opts && opts.method) || "GET") +
              " to " +
              url
          );
        }

        return this.getNativeFetch();
      };

      FetchMock.generateResponse = (function() {
        var _ref = (0, _asyncToGenerator3.default)(
          /*#__PURE__*/ _regenerator2.default.mark(function _callee(
            response,
            url,
            opts
          ) {
            return _regenerator2.default.wrap(
              function _callee$(_context) {
                while (1) {
                  switch ((_context.prev = _context.next)) {
                    case 0:
                      if (
                        !(
                          typeof response === "function" ||
                          typeof response.then === "function"
                        )
                      ) {
                        _context.next = 10;
                        break;
                      }

                      if (!(typeof response === "function")) {
                        _context.next = 5;
                        break;
                      }

                      response = response(url, opts);
                      _context.next = 8;
                      break;

                    case 5:
                      _context.next = 7;
                      return response.then(function(it) {
                        return it;
                      });

                    case 7:
                      response = _context.sent;

                    case 8:
                      _context.next = 0;
                      break;

                    case 10:
                      if (
                        !this.config.Response.prototype.isPrototypeOf(response)
                      ) {
                        _context.next = 12;
                        break;
                      }

                      return _context.abrupt("return", response);

                    case 12:
                      return _context.abrupt(
                        "return",
                        new ResponseBuilder(url, response, this).exec()
                      );

                    case 13:
                    case "end":
                      return _context.stop();
                  }
                }
              },
              _callee,
              this
            );
          })
        );

        return function(_x, _x2, _x3) {
          return _ref.apply(this, arguments);
        };
      })();

      FetchMock.router = function(url, opts) {
        var route = this.routes.find(function(route) {
          return route.matcher(url, opts);
        });

        if (route) {
          this.push(route.name, [url, opts]);
          return route.response;
        }
      };

      FetchMock.getNativeFetch = function() {
        var func = this.realFetch || (this.isSandbox && this.config.fetch);
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

      /***/
    },
    /* 107 */
    /***/ function(module, exports, __webpack_require__) {
      module.exports = __webpack_require__(108);

      /***/
    },
    /* 108 */
    /***/ function(module, exports, __webpack_require__) {
      /**
       * Copyright (c) 2014-present, Facebook, Inc.
       *
       * This source code is licensed under the MIT license found in the
       * LICENSE file in the root directory of this source tree.
       */

      // This method of obtaining a reference to the global object needs to be
      // kept identical to the way it is obtained in runtime.js
      var g =
        (function() {
          return this;
        })() || Function("return this")();

      // Use `getOwnPropertyNames` because not all browsers support calling
      // `hasOwnProperty` on the global `self` object in a worker. See #183.
      var hadRuntime =
        g.regeneratorRuntime &&
        Object.getOwnPropertyNames(g).indexOf("regeneratorRuntime") >= 0;

      // Save the old regeneratorRuntime in case it needs to be restored later.
      var oldRuntime = hadRuntime && g.regeneratorRuntime;

      // Force reevalutation of runtime.js.
      g.regeneratorRuntime = undefined;

      module.exports = __webpack_require__(109);

      if (hadRuntime) {
        // Restore the original runtime.
        g.regeneratorRuntime = oldRuntime;
      } else {
        // Remove the global property added by runtime.js.
        try {
          delete g.regeneratorRuntime;
        } catch (e) {
          g.regeneratorRuntime = undefined;
        }
      }

      /***/
    },
    /* 109 */
    /***/ function(module, exports) {
      /**
       * Copyright (c) 2014-present, Facebook, Inc.
       *
       * This source code is licensed under the MIT license found in the
       * LICENSE file in the root directory of this source tree.
       */

      !(function(global) {
        "use strict";

        var Op = Object.prototype;
        var hasOwn = Op.hasOwnProperty;
        var undefined; // More compressible than void 0.
        var $Symbol = typeof Symbol === "function" ? Symbol : {};
        var iteratorSymbol = $Symbol.iterator || "@@iterator";
        var asyncIteratorSymbol = $Symbol.asyncIterator || "@@asyncIterator";
        var toStringTagSymbol = $Symbol.toStringTag || "@@toStringTag";

        var inModule = typeof module === "object";
        var runtime = global.regeneratorRuntime;
        if (runtime) {
          if (inModule) {
            // If regeneratorRuntime is defined globally and we're in a module,
            // make the exports object identical to regeneratorRuntime.
            module.exports = runtime;
          }
          // Don't bother evaluating the rest of this file if the runtime was
          // already defined globally.
          return;
        }

        // Define the runtime globally (as expected by generated code) as either
        // module.exports (if we're in a module) or a new, empty object.
        runtime = global.regeneratorRuntime = inModule ? module.exports : {};

        function wrap(innerFn, outerFn, self, tryLocsList) {
          // If outerFn provided and outerFn.prototype is a Generator, then outerFn.prototype instanceof Generator.
          var protoGenerator =
            outerFn && outerFn.prototype instanceof Generator
              ? outerFn
              : Generator;
          var generator = Object.create(protoGenerator.prototype);
          var context = new Context(tryLocsList || []);

          // The ._invoke method unifies the implementations of the .next,
          // .throw, and .return methods.
          generator._invoke = makeInvokeMethod(innerFn, self, context);

          return generator;
        }
        runtime.wrap = wrap;

        // Try/catch helper to minimize deoptimizations. Returns a completion
        // record like context.tryEntries[i].completion. This interface could
        // have been (and was previously) designed to take a closure to be
        // invoked without arguments, but in all the cases we care about we
        // already have an existing method we want to call, so there's no need
        // to create a new function object. We can even get away with assuming
        // the method takes exactly one argument, since that happens to be true
        // in every case, so we don't have to touch the arguments object. The
        // only additional allocation required is the completion record, which
        // has a stable shape and so hopefully should be cheap to allocate.
        function tryCatch(fn, obj, arg) {
          try {
            return { type: "normal", arg: fn.call(obj, arg) };
          } catch (err) {
            return { type: "throw", arg: err };
          }
        }

        var GenStateSuspendedStart = "suspendedStart";
        var GenStateSuspendedYield = "suspendedYield";
        var GenStateExecuting = "executing";
        var GenStateCompleted = "completed";

        // Returning this object from the innerFn has the same effect as
        // breaking out of the dispatch switch statement.
        var ContinueSentinel = {};

        // Dummy constructor functions that we use as the .constructor and
        // .constructor.prototype properties for functions that return Generator
        // objects. For full spec compliance, you may wish to configure your
        // minifier not to mangle the names of these two functions.
        function Generator() {}
        function GeneratorFunction() {}
        function GeneratorFunctionPrototype() {}

        // This is a polyfill for %IteratorPrototype% for environments that
        // don't natively support it.
        var IteratorPrototype = {};
        IteratorPrototype[iteratorSymbol] = function() {
          return this;
        };

        var getProto = Object.getPrototypeOf;
        var NativeIteratorPrototype =
          getProto && getProto(getProto(values([])));
        if (
          NativeIteratorPrototype &&
          NativeIteratorPrototype !== Op &&
          hasOwn.call(NativeIteratorPrototype, iteratorSymbol)
        ) {
          // This environment has a native %IteratorPrototype%; use it instead
          // of the polyfill.
          IteratorPrototype = NativeIteratorPrototype;
        }

        var Gp = (GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(
          IteratorPrototype
        ));
        GeneratorFunction.prototype = Gp.constructor = GeneratorFunctionPrototype;
        GeneratorFunctionPrototype.constructor = GeneratorFunction;
        GeneratorFunctionPrototype[
          toStringTagSymbol
        ] = GeneratorFunction.displayName = "GeneratorFunction";

        // Helper for defining the .next, .throw, and .return methods of the
        // Iterator interface in terms of a single ._invoke method.
        function defineIteratorMethods(prototype) {
          ["next", "throw", "return"].forEach(function(method) {
            prototype[method] = function(arg) {
              return this._invoke(method, arg);
            };
          });
        }

        runtime.isGeneratorFunction = function(genFun) {
          var ctor = typeof genFun === "function" && genFun.constructor;
          return ctor
            ? ctor === GeneratorFunction ||
                // For the native GeneratorFunction constructor, the best we can
                // do is to check its .name property.
                (ctor.displayName || ctor.name) === "GeneratorFunction"
            : false;
        };

        runtime.mark = function(genFun) {
          if (Object.setPrototypeOf) {
            Object.setPrototypeOf(genFun, GeneratorFunctionPrototype);
          } else {
            genFun.__proto__ = GeneratorFunctionPrototype;
            if (!(toStringTagSymbol in genFun)) {
              genFun[toStringTagSymbol] = "GeneratorFunction";
            }
          }
          genFun.prototype = Object.create(Gp);
          return genFun;
        };

        // Within the body of any async function, `await x` is transformed to
        // `yield regeneratorRuntime.awrap(x)`, so that the runtime can test
        // `hasOwn.call(value, "__await")` to determine if the yielded value is
        // meant to be awaited.
        runtime.awrap = function(arg) {
          return { __await: arg };
        };

        function AsyncIterator(generator) {
          function invoke(method, arg, resolve, reject) {
            var record = tryCatch(generator[method], generator, arg);
            if (record.type === "throw") {
              reject(record.arg);
            } else {
              var result = record.arg;
              var value = result.value;
              if (
                value &&
                typeof value === "object" &&
                hasOwn.call(value, "__await")
              ) {
                return Promise.resolve(value.__await).then(
                  function(value) {
                    invoke("next", value, resolve, reject);
                  },
                  function(err) {
                    invoke("throw", err, resolve, reject);
                  }
                );
              }

              return Promise.resolve(value).then(function(unwrapped) {
                // When a yielded Promise is resolved, its final value becomes
                // the .value of the Promise<{value,done}> result for the
                // current iteration. If the Promise is rejected, however, the
                // result for this iteration will be rejected with the same
                // reason. Note that rejections of yielded Promises are not
                // thrown back into the generator function, as is the case
                // when an awaited Promise is rejected. This difference in
                // behavior between yield and await is important, because it
                // allows the consumer to decide what to do with the yielded
                // rejection (swallow it and continue, manually .throw it back
                // into the generator, abandon iteration, whatever). With
                // await, by contrast, there is no opportunity to examine the
                // rejection reason outside the generator function, so the
                // only option is to throw it from the await expression, and
                // let the generator function handle the exception.
                result.value = unwrapped;
                resolve(result);
              }, reject);
            }
          }

          var previousPromise;

          function enqueue(method, arg) {
            function callInvokeWithMethodAndArg() {
              return new Promise(function(resolve, reject) {
                invoke(method, arg, resolve, reject);
              });
            }

            return (previousPromise =
              // If enqueue has been called before, then we want to wait until
              // all previous Promises have been resolved before calling invoke,
              // so that results are always delivered in the correct order. If
              // enqueue has not been called before, then it is important to
              // call invoke immediately, without waiting on a callback to fire,
              // so that the async generator function has the opportunity to do
              // any necessary setup in a predictable way. This predictability
              // is why the Promise constructor synchronously invokes its
              // executor callback, and why async functions synchronously
              // execute code before the first await. Since we implement simple
              // async functions in terms of async generators, it is especially
              // important to get this right, even though it requires care.
              previousPromise
                ? previousPromise.then(
                    callInvokeWithMethodAndArg,
                    // Avoid propagating failures to Promises returned by later
                    // invocations of the iterator.
                    callInvokeWithMethodAndArg
                  )
                : callInvokeWithMethodAndArg());
          }

          // Define the unified helper method that is used to implement .next,
          // .throw, and .return (see defineIteratorMethods).
          this._invoke = enqueue;
        }

        defineIteratorMethods(AsyncIterator.prototype);
        AsyncIterator.prototype[asyncIteratorSymbol] = function() {
          return this;
        };
        runtime.AsyncIterator = AsyncIterator;

        // Note that simple async functions are implemented on top of
        // AsyncIterator objects; they just return a Promise for the value of
        // the final result produced by the iterator.
        runtime.async = function(innerFn, outerFn, self, tryLocsList) {
          var iter = new AsyncIterator(
            wrap(innerFn, outerFn, self, tryLocsList)
          );

          return runtime.isGeneratorFunction(outerFn)
            ? iter // If outerFn is a generator, return the full iterator.
            : iter.next().then(function(result) {
                return result.done ? result.value : iter.next();
              });
        };

        function makeInvokeMethod(innerFn, self, context) {
          var state = GenStateSuspendedStart;

          return function invoke(method, arg) {
            if (state === GenStateExecuting) {
              throw new Error("Generator is already running");
            }

            if (state === GenStateCompleted) {
              if (method === "throw") {
                throw arg;
              }

              // Be forgiving, per 25.3.3.3.3 of the spec:
              // https://people.mozilla.org/~jorendorff/es6-draft.html#sec-generatorresume
              return doneResult();
            }

            context.method = method;
            context.arg = arg;

            while (true) {
              var delegate = context.delegate;
              if (delegate) {
                var delegateResult = maybeInvokeDelegate(delegate, context);
                if (delegateResult) {
                  if (delegateResult === ContinueSentinel) continue;
                  return delegateResult;
                }
              }

              if (context.method === "next") {
                // Setting context._sent for legacy support of Babel's
                // function.sent implementation.
                context.sent = context._sent = context.arg;
              } else if (context.method === "throw") {
                if (state === GenStateSuspendedStart) {
                  state = GenStateCompleted;
                  throw context.arg;
                }

                context.dispatchException(context.arg);
              } else if (context.method === "return") {
                context.abrupt("return", context.arg);
              }

              state = GenStateExecuting;

              var record = tryCatch(innerFn, self, context);
              if (record.type === "normal") {
                // If an exception is thrown from innerFn, we leave state ===
                // GenStateExecuting and loop back for another invocation.
                state = context.done
                  ? GenStateCompleted
                  : GenStateSuspendedYield;

                if (record.arg === ContinueSentinel) {
                  continue;
                }

                return {
                  value: record.arg,
                  done: context.done
                };
              } else if (record.type === "throw") {
                state = GenStateCompleted;
                // Dispatch the exception by looping back around to the
                // context.dispatchException(context.arg) call above.
                context.method = "throw";
                context.arg = record.arg;
              }
            }
          };
        }

        // Call delegate.iterator[context.method](context.arg) and handle the
        // result, either by returning a { value, done } result from the
        // delegate iterator, or by modifying context.method and context.arg,
        // setting context.delegate to null, and returning the ContinueSentinel.
        function maybeInvokeDelegate(delegate, context) {
          var method = delegate.iterator[context.method];
          if (method === undefined) {
            // A .throw or .return when the delegate iterator has no .throw
            // method always terminates the yield* loop.
            context.delegate = null;

            if (context.method === "throw") {
              if (delegate.iterator.return) {
                // If the delegate iterator has a return method, give it a
                // chance to clean up.
                context.method = "return";
                context.arg = undefined;
                maybeInvokeDelegate(delegate, context);

                if (context.method === "throw") {
                  // If maybeInvokeDelegate(context) changed context.method from
                  // "return" to "throw", let that override the TypeError below.
                  return ContinueSentinel;
                }
              }

              context.method = "throw";
              context.arg = new TypeError(
                "The iterator does not provide a 'throw' method"
              );
            }

            return ContinueSentinel;
          }

          var record = tryCatch(method, delegate.iterator, context.arg);

          if (record.type === "throw") {
            context.method = "throw";
            context.arg = record.arg;
            context.delegate = null;
            return ContinueSentinel;
          }

          var info = record.arg;

          if (!info) {
            context.method = "throw";
            context.arg = new TypeError("iterator result is not an object");
            context.delegate = null;
            return ContinueSentinel;
          }

          if (info.done) {
            // Assign the result of the finished delegate to the temporary
            // variable specified by delegate.resultName (see delegateYield).
            context[delegate.resultName] = info.value;

            // Resume execution at the desired location (see delegateYield).
            context.next = delegate.nextLoc;

            // If context.method was "throw" but the delegate handled the
            // exception, let the outer generator proceed normally. If
            // context.method was "next", forget context.arg since it has been
            // "consumed" by the delegate iterator. If context.method was
            // "return", allow the original .return call to continue in the
            // outer generator.
            if (context.method !== "return") {
              context.method = "next";
              context.arg = undefined;
            }
          } else {
            // Re-yield the result returned by the delegate method.
            return info;
          }

          // The delegate iterator is finished, so forget it and continue with
          // the outer generator.
          context.delegate = null;
          return ContinueSentinel;
        }

        // Define Generator.prototype.{next,throw,return} in terms of the
        // unified ._invoke helper method.
        defineIteratorMethods(Gp);

        Gp[toStringTagSymbol] = "Generator";

        // A Generator should always return itself as the iterator object when the
        // @@iterator function is called on it. Some browsers' implementations of the
        // iterator prototype chain incorrectly implement this, causing the Generator
        // object to not be returned from this call. This ensures that doesn't happen.
        // See https://github.com/facebook/regenerator/issues/274 for more details.
        Gp[iteratorSymbol] = function() {
          return this;
        };

        Gp.toString = function() {
          return "[object Generator]";
        };

        function pushTryEntry(locs) {
          var entry = { tryLoc: locs[0] };

          if (1 in locs) {
            entry.catchLoc = locs[1];
          }

          if (2 in locs) {
            entry.finallyLoc = locs[2];
            entry.afterLoc = locs[3];
          }

          this.tryEntries.push(entry);
        }

        function resetTryEntry(entry) {
          var record = entry.completion || {};
          record.type = "normal";
          delete record.arg;
          entry.completion = record;
        }

        function Context(tryLocsList) {
          // The root entry object (effectively a try statement without a catch
          // or a finally block) gives us a place to store values thrown from
          // locations where there is no enclosing try statement.
          this.tryEntries = [{ tryLoc: "root" }];
          tryLocsList.forEach(pushTryEntry, this);
          this.reset(true);
        }

        runtime.keys = function(object) {
          var keys = [];
          for (var key in object) {
            keys.push(key);
          }
          keys.reverse();

          // Rather than returning an object with a next method, we keep
          // things simple and return the next function itself.
          return function next() {
            while (keys.length) {
              var key = keys.pop();
              if (key in object) {
                next.value = key;
                next.done = false;
                return next;
              }
            }

            // To avoid creating an additional object, we just hang the .value
            // and .done properties off the next function object itself. This
            // also ensures that the minifier will not anonymize the function.
            next.done = true;
            return next;
          };
        };

        function values(iterable) {
          if (iterable) {
            var iteratorMethod = iterable[iteratorSymbol];
            if (iteratorMethod) {
              return iteratorMethod.call(iterable);
            }

            if (typeof iterable.next === "function") {
              return iterable;
            }

            if (!isNaN(iterable.length)) {
              var i = -1,
                next = function next() {
                  while (++i < iterable.length) {
                    if (hasOwn.call(iterable, i)) {
                      next.value = iterable[i];
                      next.done = false;
                      return next;
                    }
                  }

                  next.value = undefined;
                  next.done = true;

                  return next;
                };

              return (next.next = next);
            }
          }

          // Return an iterator with no values.
          return { next: doneResult };
        }
        runtime.values = values;

        function doneResult() {
          return { value: undefined, done: true };
        }

        Context.prototype = {
          constructor: Context,

          reset: function(skipTempReset) {
            this.prev = 0;
            this.next = 0;
            // Resetting context._sent for legacy support of Babel's
            // function.sent implementation.
            this.sent = this._sent = undefined;
            this.done = false;
            this.delegate = null;

            this.method = "next";
            this.arg = undefined;

            this.tryEntries.forEach(resetTryEntry);

            if (!skipTempReset) {
              for (var name in this) {
                // Not sure about the optimal order of these conditions:
                if (
                  name.charAt(0) === "t" &&
                  hasOwn.call(this, name) &&
                  !isNaN(+name.slice(1))
                ) {
                  this[name] = undefined;
                }
              }
            }
          },

          stop: function() {
            this.done = true;

            var rootEntry = this.tryEntries[0];
            var rootRecord = rootEntry.completion;
            if (rootRecord.type === "throw") {
              throw rootRecord.arg;
            }

            return this.rval;
          },

          dispatchException: function(exception) {
            if (this.done) {
              throw exception;
            }

            var context = this;
            function handle(loc, caught) {
              record.type = "throw";
              record.arg = exception;
              context.next = loc;

              if (caught) {
                // If the dispatched exception was caught by a catch block,
                // then let that catch block handle the exception normally.
                context.method = "next";
                context.arg = undefined;
              }

              return !!caught;
            }

            for (var i = this.tryEntries.length - 1; i >= 0; --i) {
              var entry = this.tryEntries[i];
              var record = entry.completion;

              if (entry.tryLoc === "root") {
                // Exception thrown outside of any try block that could handle
                // it, so set the completion value of the entire function to
                // throw the exception.
                return handle("end");
              }

              if (entry.tryLoc <= this.prev) {
                var hasCatch = hasOwn.call(entry, "catchLoc");
                var hasFinally = hasOwn.call(entry, "finallyLoc");

                if (hasCatch && hasFinally) {
                  if (this.prev < entry.catchLoc) {
                    return handle(entry.catchLoc, true);
                  } else if (this.prev < entry.finallyLoc) {
                    return handle(entry.finallyLoc);
                  }
                } else if (hasCatch) {
                  if (this.prev < entry.catchLoc) {
                    return handle(entry.catchLoc, true);
                  }
                } else if (hasFinally) {
                  if (this.prev < entry.finallyLoc) {
                    return handle(entry.finallyLoc);
                  }
                } else {
                  throw new Error("try statement without catch or finally");
                }
              }
            }
          },

          abrupt: function(type, arg) {
            for (var i = this.tryEntries.length - 1; i >= 0; --i) {
              var entry = this.tryEntries[i];
              if (
                entry.tryLoc <= this.prev &&
                hasOwn.call(entry, "finallyLoc") &&
                this.prev < entry.finallyLoc
              ) {
                var finallyEntry = entry;
                break;
              }
            }

            if (
              finallyEntry &&
              (type === "break" || type === "continue") &&
              finallyEntry.tryLoc <= arg &&
              arg <= finallyEntry.finallyLoc
            ) {
              // Ignore the finally entry if control is not jumping to a
              // location outside the try/catch block.
              finallyEntry = null;
            }

            var record = finallyEntry ? finallyEntry.completion : {};
            record.type = type;
            record.arg = arg;

            if (finallyEntry) {
              this.method = "next";
              this.next = finallyEntry.finallyLoc;
              return ContinueSentinel;
            }

            return this.complete(record);
          },

          complete: function(record, afterLoc) {
            if (record.type === "throw") {
              throw record.arg;
            }

            if (record.type === "break" || record.type === "continue") {
              this.next = record.arg;
            } else if (record.type === "return") {
              this.rval = this.arg = record.arg;
              this.method = "return";
              this.next = "end";
            } else if (record.type === "normal" && afterLoc) {
              this.next = afterLoc;
            }

            return ContinueSentinel;
          },

          finish: function(finallyLoc) {
            for (var i = this.tryEntries.length - 1; i >= 0; --i) {
              var entry = this.tryEntries[i];
              if (entry.finallyLoc === finallyLoc) {
                this.complete(entry.completion, entry.afterLoc);
                resetTryEntry(entry);
                return ContinueSentinel;
              }
            }
          },

          catch: function(tryLoc) {
            for (var i = this.tryEntries.length - 1; i >= 0; --i) {
              var entry = this.tryEntries[i];
              if (entry.tryLoc === tryLoc) {
                var record = entry.completion;
                if (record.type === "throw") {
                  var thrown = record.arg;
                  resetTryEntry(entry);
                }
                return thrown;
              }
            }

            // The context.catch method must only be called with a location
            // argument that corresponds to a known catch block.
            throw new Error("illegal catch attempt");
          },

          delegateYield: function(iterable, resultName, nextLoc) {
            this.delegate = {
              iterator: values(iterable),
              resultName: resultName,
              nextLoc: nextLoc
            };

            if (this.method === "next") {
              // Deliberately forget the last sent value so that we don't
              // accidentally pass it on to the delegate.
              this.arg = undefined;
            }

            return ContinueSentinel;
          }
        };
      })(
        // In sloppy mode, unbound `this` refers to the global object, fallback to
        // Function constructor if we're in global strict mode. That is sadly a form
        // of indirect eval which violates Content Security Policy.
        (function() {
          return this;
        })() || Function("return this")()
      );

      /***/
    },
    /* 110 */
    /***/ function(module, exports, __webpack_require__) {
      "use strict";

      exports.__esModule = true;

      var _promise = __webpack_require__(55);

      var _promise2 = _interopRequireDefault(_promise);

      function _interopRequireDefault(obj) {
        return obj && obj.__esModule ? obj : { default: obj };
      }

      exports.default = function(fn) {
        return function() {
          var gen = fn.apply(this, arguments);
          return new _promise2.default(function(resolve, reject) {
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
                return _promise2.default.resolve(value).then(
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
      };

      /***/
    },
    /* 111 */
    /***/ function(module, exports, __webpack_require__) {
      __webpack_require__(56);
      __webpack_require__(18);
      __webpack_require__(23);
      __webpack_require__(112);
      __webpack_require__(119);
      __webpack_require__(120);
      module.exports = __webpack_require__(0).Promise;

      /***/
    },
    /* 112 */
    /***/ function(module, exports, __webpack_require__) {
      "use strict";

      var LIBRARY = __webpack_require__(24);
      var global = __webpack_require__(2);
      var ctx = __webpack_require__(14);
      var classof = __webpack_require__(36);
      var $export = __webpack_require__(3);
      var isObject = __webpack_require__(8);
      var aFunction = __webpack_require__(20);
      var anInstance = __webpack_require__(113);
      var forOf = __webpack_require__(114);
      var speciesConstructor = __webpack_require__(57);
      var task = __webpack_require__(58).set;
      var microtask = __webpack_require__(116)();
      var newPromiseCapabilityModule = __webpack_require__(38);
      var perform = __webpack_require__(59);
      var promiseResolve = __webpack_require__(60);
      var PROMISE = "Promise";
      var TypeError = global.TypeError;
      var process = global.process;
      var $Promise = global[PROMISE];
      var isNode = classof(process) == "process";
      var empty = function() {
        /* empty */
      };
      var Internal, newGenericPromiseCapability, OwnPromiseCapability, Wrapper;
      var newPromiseCapability = (newGenericPromiseCapability =
        newPromiseCapabilityModule.f);

      var USE_NATIVE = !!(function() {
        try {
          // correct subclassing with @@species support
          var promise = $Promise.resolve(1);
          var FakePromise = ((promise.constructor = {})[
            __webpack_require__(1)("species")
          ] = function(exec) {
            exec(empty, empty);
          });
          // unhandled rejections tracking support, NodeJS Promise without it fails @@species test
          return (
            (isNode || typeof PromiseRejectionEvent == "function") &&
            promise.then(empty) instanceof FakePromise
          );
        } catch (e) {
          /* empty */
        }
      })();

      // helpers
      var isThenable = function(it) {
        var then;
        return isObject(it) && typeof (then = it.then) == "function"
          ? then
          : false;
      };
      var notify = function(promise, isReject) {
        if (promise._n) return;
        promise._n = true;
        var chain = promise._c;
        microtask(function() {
          var value = promise._v;
          var ok = promise._s == 1;
          var i = 0;
          var run = function(reaction) {
            var handler = ok ? reaction.ok : reaction.fail;
            var resolve = reaction.resolve;
            var reject = reaction.reject;
            var domain = reaction.domain;
            var result, then;
            try {
              if (handler) {
                if (!ok) {
                  if (promise._h == 2) onHandleUnhandled(promise);
                  promise._h = 1;
                }
                if (handler === true) result = value;
                else {
                  if (domain) domain.enter();
                  result = handler(value);
                  if (domain) domain.exit();
                }
                if (result === reaction.promise) {
                  reject(TypeError("Promise-chain cycle"));
                } else if ((then = isThenable(result))) {
                  then.call(result, resolve, reject);
                } else resolve(result);
              } else reject(value);
            } catch (e) {
              reject(e);
            }
          };
          while (chain.length > i) run(chain[i++]); // variable length - can't use forEach
          promise._c = [];
          promise._n = false;
          if (isReject && !promise._h) onUnhandled(promise);
        });
      };
      var onUnhandled = function(promise) {
        task.call(global, function() {
          var value = promise._v;
          var unhandled = isUnhandled(promise);
          var result, handler, console;
          if (unhandled) {
            result = perform(function() {
              if (isNode) {
                process.emit("unhandledRejection", value, promise);
              } else if ((handler = global.onunhandledrejection)) {
                handler({ promise: promise, reason: value });
              } else if ((console = global.console) && console.error) {
                console.error("Unhandled promise rejection", value);
              }
            });
            // Browsers should not trigger `rejectionHandled` event if it was handled here, NodeJS - should
            promise._h = isNode || isUnhandled(promise) ? 2 : 1;
          }
          promise._a = undefined;
          if (unhandled && result.e) throw result.v;
        });
      };
      var isUnhandled = function(promise) {
        return promise._h !== 1 && (promise._a || promise._c).length === 0;
      };
      var onHandleUnhandled = function(promise) {
        task.call(global, function() {
          var handler;
          if (isNode) {
            process.emit("rejectionHandled", promise);
          } else if ((handler = global.onrejectionhandled)) {
            handler({ promise: promise, reason: promise._v });
          }
        });
      };
      var $reject = function(value) {
        var promise = this;
        if (promise._d) return;
        promise._d = true;
        promise = promise._w || promise; // unwrap
        promise._v = value;
        promise._s = 2;
        if (!promise._a) promise._a = promise._c.slice();
        notify(promise, true);
      };
      var $resolve = function(value) {
        var promise = this;
        var then;
        if (promise._d) return;
        promise._d = true;
        promise = promise._w || promise; // unwrap
        try {
          if (promise === value)
            throw TypeError("Promise can't be resolved itself");
          if ((then = isThenable(value))) {
            microtask(function() {
              var wrapper = { _w: promise, _d: false }; // wrap
              try {
                then.call(
                  value,
                  ctx($resolve, wrapper, 1),
                  ctx($reject, wrapper, 1)
                );
              } catch (e) {
                $reject.call(wrapper, e);
              }
            });
          } else {
            promise._v = value;
            promise._s = 1;
            notify(promise, false);
          }
        } catch (e) {
          $reject.call({ _w: promise, _d: false }, e); // wrap
        }
      };

      // constructor polyfill
      if (!USE_NATIVE) {
        // 25.4.3.1 Promise(executor)
        $Promise = function Promise(executor) {
          anInstance(this, $Promise, PROMISE, "_h");
          aFunction(executor);
          Internal.call(this);
          try {
            executor(ctx($resolve, this, 1), ctx($reject, this, 1));
          } catch (err) {
            $reject.call(this, err);
          }
        };
        // eslint-disable-next-line no-unused-vars
        Internal = function Promise(executor) {
          this._c = []; // <- awaiting reactions
          this._a = undefined; // <- checked in isUnhandled reactions
          this._s = 0; // <- state
          this._d = false; // <- done
          this._v = undefined; // <- value
          this._h = 0; // <- rejection state, 0 - default, 1 - handled, 2 - unhandled
          this._n = false; // <- notify
        };
        Internal.prototype = __webpack_require__(117)($Promise.prototype, {
          // 25.4.5.3 Promise.prototype.then(onFulfilled, onRejected)
          then: function then(onFulfilled, onRejected) {
            var reaction = newPromiseCapability(
              speciesConstructor(this, $Promise)
            );
            reaction.ok = typeof onFulfilled == "function" ? onFulfilled : true;
            reaction.fail = typeof onRejected == "function" && onRejected;
            reaction.domain = isNode ? process.domain : undefined;
            this._c.push(reaction);
            if (this._a) this._a.push(reaction);
            if (this._s) notify(this, false);
            return reaction.promise;
          },
          // 25.4.5.1 Promise.prototype.catch(onRejected)
          catch: function(onRejected) {
            return this.then(undefined, onRejected);
          }
        });
        OwnPromiseCapability = function() {
          var promise = new Internal();
          this.promise = promise;
          this.resolve = ctx($resolve, promise, 1);
          this.reject = ctx($reject, promise, 1);
        };
        newPromiseCapabilityModule.f = newPromiseCapability = function(C) {
          return C === $Promise || C === Wrapper
            ? new OwnPromiseCapability(C)
            : newGenericPromiseCapability(C);
        };
      }

      $export($export.G + $export.W + $export.F * !USE_NATIVE, {
        Promise: $Promise
      });
      __webpack_require__(25)($Promise, PROMISE);
      __webpack_require__(118)(PROMISE);
      Wrapper = __webpack_require__(0)[PROMISE];

      // statics
      $export($export.S + $export.F * !USE_NATIVE, PROMISE, {
        // 25.4.4.5 Promise.reject(r)
        reject: function reject(r) {
          var capability = newPromiseCapability(this);
          var $$reject = capability.reject;
          $$reject(r);
          return capability.promise;
        }
      });
      $export($export.S + $export.F * (LIBRARY || !USE_NATIVE), PROMISE, {
        // 25.4.4.6 Promise.resolve(x)
        resolve: function resolve(x) {
          return promiseResolve(
            LIBRARY && this === Wrapper ? $Promise : this,
            x
          );
        }
      });
      $export(
        $export.S +
          $export.F *
            !(
              USE_NATIVE &&
              __webpack_require__(52)(function(iter) {
                $Promise.all(iter)["catch"](empty);
              })
            ),
        PROMISE,
        {
          // 25.4.4.1 Promise.all(iterable)
          all: function all(iterable) {
            var C = this;
            var capability = newPromiseCapability(C);
            var resolve = capability.resolve;
            var reject = capability.reject;
            var result = perform(function() {
              var values = [];
              var index = 0;
              var remaining = 1;
              forOf(iterable, false, function(promise) {
                var $index = index++;
                var alreadyCalled = false;
                values.push(undefined);
                remaining++;
                C.resolve(promise).then(function(value) {
                  if (alreadyCalled) return;
                  alreadyCalled = true;
                  values[$index] = value;
                  --remaining || resolve(values);
                }, reject);
              });
              --remaining || resolve(values);
            });
            if (result.e) reject(result.v);
            return capability.promise;
          },
          // 25.4.4.4 Promise.race(iterable)
          race: function race(iterable) {
            var C = this;
            var capability = newPromiseCapability(C);
            var reject = capability.reject;
            var result = perform(function() {
              forOf(iterable, false, function(promise) {
                C.resolve(promise).then(capability.resolve, reject);
              });
            });
            if (result.e) reject(result.v);
            return capability.promise;
          }
        }
      );

      /***/
    },
    /* 113 */
    /***/ function(module, exports) {
      module.exports = function(it, Constructor, name, forbiddenField) {
        if (
          !(it instanceof Constructor) ||
          (forbiddenField !== undefined && forbiddenField in it)
        ) {
          throw TypeError(name + ": incorrect invocation!");
        }
        return it;
      };

      /***/
    },
    /* 114 */
    /***/ function(module, exports, __webpack_require__) {
      var ctx = __webpack_require__(14);
      var call = __webpack_require__(50);
      var isArrayIter = __webpack_require__(51);
      var anObject = __webpack_require__(5);
      var toLength = __webpack_require__(29);
      var getIterFn = __webpack_require__(37);
      var BREAK = {};
      var RETURN = {};
      var exports = (module.exports = function(
        iterable,
        entries,
        fn,
        that,
        ITERATOR
      ) {
        var iterFn = ITERATOR
          ? function() {
              return iterable;
            }
          : getIterFn(iterable);
        var f = ctx(fn, that, entries ? 2 : 1);
        var index = 0;
        var length, step, iterator, result;
        if (typeof iterFn != "function")
          throw TypeError(iterable + " is not iterable!");
        // fast case for arrays with default iterator
        if (isArrayIter(iterFn))
          for (length = toLength(iterable.length); length > index; index++) {
            result = entries
              ? f(anObject((step = iterable[index]))[0], step[1])
              : f(iterable[index]);
            if (result === BREAK || result === RETURN) return result;
          }
        else
          for (
            iterator = iterFn.call(iterable);
            !(step = iterator.next()).done;

          ) {
            result = call(iterator, f, step.value, entries);
            if (result === BREAK || result === RETURN) return result;
          }
      });
      exports.BREAK = BREAK;
      exports.RETURN = RETURN;

      /***/
    },
    /* 115 */
    /***/ function(module, exports) {
      // fast apply, http://jsperf.lnkit.com/fast-apply/5
      module.exports = function(fn, args, that) {
        var un = that === undefined;
        switch (args.length) {
          case 0:
            return un ? fn() : fn.call(that);
          case 1:
            return un ? fn(args[0]) : fn.call(that, args[0]);
          case 2:
            return un ? fn(args[0], args[1]) : fn.call(that, args[0], args[1]);
          case 3:
            return un
              ? fn(args[0], args[1], args[2])
              : fn.call(that, args[0], args[1], args[2]);
          case 4:
            return un
              ? fn(args[0], args[1], args[2], args[3])
              : fn.call(that, args[0], args[1], args[2], args[3]);
        }
        return fn.apply(that, args);
      };

      /***/
    },
    /* 116 */
    /***/ function(module, exports, __webpack_require__) {
      var global = __webpack_require__(2);
      var macrotask = __webpack_require__(58).set;
      var Observer = global.MutationObserver || global.WebKitMutationObserver;
      var process = global.process;
      var Promise = global.Promise;
      var isNode = __webpack_require__(16)(process) == "process";

      module.exports = function() {
        var head, last, notify;

        var flush = function() {
          var parent, fn;
          if (isNode && (parent = process.domain)) parent.exit();
          while (head) {
            fn = head.fn;
            head = head.next;
            try {
              fn();
            } catch (e) {
              if (head) notify();
              else last = undefined;
              throw e;
            }
          }
          last = undefined;
          if (parent) parent.enter();
        };

        // Node.js
        if (isNode) {
          notify = function() {
            process.nextTick(flush);
          };
          // browsers with MutationObserver, except iOS Safari - https://github.com/zloirock/core-js/issues/339
        } else if (
          Observer &&
          !(global.navigator && global.navigator.standalone)
        ) {
          var toggle = true;
          var node = document.createTextNode("");
          new Observer(flush).observe(node, { characterData: true }); // eslint-disable-line no-new
          notify = function() {
            node.data = toggle = !toggle;
          };
          // environments with maybe non-completely correct, but existent Promise
        } else if (Promise && Promise.resolve) {
          var promise = Promise.resolve();
          notify = function() {
            promise.then(flush);
          };
          // for other environments - macrotask based on:
          // - setImmediate
          // - MessageChannel
          // - window.postMessag
          // - onreadystatechange
          // - setTimeout
        } else {
          notify = function() {
            // strange IE + webpack dev server bug - use .call(global)
            macrotask.call(global, flush);
          };
        }

        return function(fn) {
          var task = { fn: fn, next: undefined };
          if (last) last.next = task;
          if (!head) {
            head = task;
            notify();
          }
          last = task;
        };
      };

      /***/
    },
    /* 117 */
    /***/ function(module, exports, __webpack_require__) {
      var hide = __webpack_require__(7);
      module.exports = function(target, src, safe) {
        for (var key in src) {
          if (safe && target[key]) target[key] = src[key];
          else hide(target, key, src[key]);
        }
        return target;
      };

      /***/
    },
    /* 118 */
    /***/ function(module, exports, __webpack_require__) {
      "use strict";

      var global = __webpack_require__(2);
      var core = __webpack_require__(0);
      var dP = __webpack_require__(4);
      var DESCRIPTORS = __webpack_require__(6);
      var SPECIES = __webpack_require__(1)("species");

      module.exports = function(KEY) {
        var C = typeof core[KEY] == "function" ? core[KEY] : global[KEY];
        if (DESCRIPTORS && C && !C[SPECIES])
          dP.f(C, SPECIES, {
            configurable: true,
            get: function() {
              return this;
            }
          });
      };

      /***/
    },
    /* 119 */
    /***/ function(module, exports, __webpack_require__) {
      "use strict";
      // https://github.com/tc39/proposal-promise-finally

      var $export = __webpack_require__(3);
      var core = __webpack_require__(0);
      var global = __webpack_require__(2);
      var speciesConstructor = __webpack_require__(57);
      var promiseResolve = __webpack_require__(60);

      $export($export.P + $export.R, "Promise", {
        finally: function(onFinally) {
          var C = speciesConstructor(this, core.Promise || global.Promise);
          var isFunction = typeof onFinally == "function";
          return this.then(
            isFunction
              ? function(x) {
                  return promiseResolve(C, onFinally()).then(function() {
                    return x;
                  });
                }
              : onFinally,
            isFunction
              ? function(e) {
                  return promiseResolve(C, onFinally()).then(function() {
                    throw e;
                  });
                }
              : onFinally
          );
        }
      });

      /***/
    },
    /* 120 */
    /***/ function(module, exports, __webpack_require__) {
      "use strict";

      // https://github.com/tc39/proposal-promise-try
      var $export = __webpack_require__(3);
      var newPromiseCapability = __webpack_require__(38);
      var perform = __webpack_require__(59);

      $export($export.S, "Promise", {
        try: function(callbackfn) {
          var promiseCapability = newPromiseCapability.f(this);
          var result = perform(callbackfn);
          (result.e ? promiseCapability.reject : promiseCapability.resolve)(
            result.v
          );
          return promiseCapability.promise;
        }
      });

      /***/
    },
    /* 121 */
    /***/ function(module, exports, __webpack_require__) {
      "use strict";

      var _create = __webpack_require__(44);

      var _create2 = _interopRequireDefault(_create);

      var _stringify = __webpack_require__(122);

      var _stringify2 = _interopRequireDefault(_stringify);

      var _typeof2 = __webpack_require__(124);

      var _typeof3 = _interopRequireDefault(_typeof2);

      var _keys = __webpack_require__(53);

      var _keys2 = _interopRequireDefault(_keys);

      var _classCallCheck2 = __webpack_require__(137);

      var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

      var _createClass2 = __webpack_require__(138);

      var _createClass3 = _interopRequireDefault(_createClass2);

      function _interopRequireDefault(obj) {
        return obj && obj.__esModule ? obj : { default: obj };
      }

      var responseConfigProps = [
        "body",
        "headers",
        "throws",
        "status",
        "redirectUrl",
        "includeContentLength",
        "sendAsJson"
      ];

      module.exports = (function() {
        function ResponseBuilder(url, responseConfig, fetchMock) {
          (0, _classCallCheck3.default)(this, ResponseBuilder);

          this.url = url;
          this.responseConfig = responseConfig;
          this.fetchMockConfig = fetchMock.config;
          this.statusTextMap = fetchMock.statusTextMap;
          this.Response = fetchMock.config.Response;
          this.Headers = fetchMock.config.Headers;
        }

        (0, _createClass3.default)(ResponseBuilder, [
          {
            key: "exec",
            value: function exec() {
              this.normalizeResponseConfig();
              this.constructFetchOpts();
              this.constructResponseBody();
              return this.redirect(new this.Response(this.body, this.opts));
            }
          },
          {
            key: "sendAsObject",
            value: function sendAsObject() {
              var _this = this;

              if (
                responseConfigProps.some(function(prop) {
                  return _this.responseConfig[prop];
                })
              ) {
                if (
                  (0, _keys2.default)(this.responseConfig).every(function(key) {
                    return responseConfigProps.includes(key);
                  })
                ) {
                  return false;
                } else {
                  return true;
                }
              } else {
                return true;
              }
            }
          },
          {
            key: "normalizeResponseConfig",
            value: function normalizeResponseConfig() {
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
          },
          {
            key: "validateStatus",
            value: function validateStatus(status) {
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

              throw new TypeError(
                "Invalid status " +
                  status +
                  ' passed on response object.\nTo respond with a JSON object that has status as a property assign the object to body\ne.g. {"body": {"status: "registered"}}'
              );
            }
          },
          {
            key: "constructFetchOpts",
            value: function constructFetchOpts() {
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
          },
          {
            key: "getOption",
            value: function getOption(name) {
              return this.responseConfig[name] === undefined
                ? this.fetchMockConfig[name]
                : this.responseConfig[name];
            }
          },
          {
            key: "constructResponseBody",
            value: function constructResponseBody() {
              // start to construct the body
              var body = this.responseConfig.body;

              // convert to json if we need to
              if (
                this.getOption("sendAsJson") &&
                this.responseConfig.body != null &&
                (typeof body === "undefined"
                  ? "undefined"
                  : (0, _typeof3.default)(body)) === "object"
              ) {
                //eslint-disable-line
                body = (0, _stringify2.default)(body);
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
                var s = new this.stream.Readable();
                if (body != null) {
                  //eslint-disable-line
                  s.push(body, "utf-8");
                }
                s.push(null);
                body = s;
              }
              this.body = body;
            }
          },
          {
            key: "redirect",
            value: function redirect(response) {
              // When mocking a followed redirect we must wrap the response in an object
              // which sets the redirected flag (not a writable property on the actual
              // response)
              if (this.responseConfig.redirectUrl) {
                response = (0, _create2.default)(response, {
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
          }
        ]);
        return ResponseBuilder;
      })();

      /***/
    },
    /* 122 */
    /***/ function(module, exports, __webpack_require__) {
      module.exports = { default: __webpack_require__(123), __esModule: true };

      /***/
    },
    /* 123 */
    /***/ function(module, exports, __webpack_require__) {
      var core = __webpack_require__(0);
      var $JSON = core.JSON || (core.JSON = { stringify: JSON.stringify });
      module.exports = function stringify(it) {
        // eslint-disable-line no-unused-vars
        return $JSON.stringify.apply($JSON, arguments);
      };

      /***/
    },
    /* 124 */
    /***/ function(module, exports, __webpack_require__) {
      "use strict";

      exports.__esModule = true;

      var _iterator = __webpack_require__(125);

      var _iterator2 = _interopRequireDefault(_iterator);

      var _symbol = __webpack_require__(127);

      var _symbol2 = _interopRequireDefault(_symbol);

      var _typeof =
        typeof _symbol2.default === "function" &&
        typeof _iterator2.default === "symbol"
          ? function(obj) {
              return typeof obj;
            }
          : function(obj) {
              return obj &&
                typeof _symbol2.default === "function" &&
                obj.constructor === _symbol2.default &&
                obj !== _symbol2.default.prototype
                ? "symbol"
                : typeof obj;
            };

      function _interopRequireDefault(obj) {
        return obj && obj.__esModule ? obj : { default: obj };
      }

      exports.default =
        typeof _symbol2.default === "function" &&
        _typeof(_iterator2.default) === "symbol"
          ? function(obj) {
              return typeof obj === "undefined" ? "undefined" : _typeof(obj);
            }
          : function(obj) {
              return obj &&
                typeof _symbol2.default === "function" &&
                obj.constructor === _symbol2.default &&
                obj !== _symbol2.default.prototype
                ? "symbol"
                : typeof obj === "undefined" ? "undefined" : _typeof(obj);
            };

      /***/
    },
    /* 125 */
    /***/ function(module, exports, __webpack_require__) {
      module.exports = { default: __webpack_require__(126), __esModule: true };

      /***/
    },
    /* 126 */
    /***/ function(module, exports, __webpack_require__) {
      __webpack_require__(18);
      __webpack_require__(23);
      module.exports = __webpack_require__(39).f("iterator");

      /***/
    },
    /* 127 */
    /***/ function(module, exports, __webpack_require__) {
      module.exports = { default: __webpack_require__(128), __esModule: true };

      /***/
    },
    /* 128 */
    /***/ function(module, exports, __webpack_require__) {
      __webpack_require__(129);
      __webpack_require__(56);
      __webpack_require__(135);
      __webpack_require__(136);
      module.exports = __webpack_require__(0).Symbol;

      /***/
    },
    /* 129 */
    /***/ function(module, exports, __webpack_require__) {
      "use strict";

      // ECMAScript 6 symbols shim
      var global = __webpack_require__(2);
      var has = __webpack_require__(9);
      var DESCRIPTORS = __webpack_require__(6);
      var $export = __webpack_require__(3);
      var redefine = __webpack_require__(48);
      var META = __webpack_require__(130).KEY;
      var $fails = __webpack_require__(11);
      var shared = __webpack_require__(32);
      var setToStringTag = __webpack_require__(25);
      var uid = __webpack_require__(21);
      var wks = __webpack_require__(1);
      var wksExt = __webpack_require__(39);
      var wksDefine = __webpack_require__(40);
      var enumKeys = __webpack_require__(131);
      var isArray = __webpack_require__(132);
      var anObject = __webpack_require__(5);
      var isObject = __webpack_require__(8);
      var toIObject = __webpack_require__(10);
      var toPrimitive = __webpack_require__(27);
      var createDesc = __webpack_require__(15);
      var _create = __webpack_require__(35);
      var gOPNExt = __webpack_require__(133);
      var $GOPD = __webpack_require__(134);
      var $DP = __webpack_require__(4);
      var $keys = __webpack_require__(12);
      var gOPD = $GOPD.f;
      var dP = $DP.f;
      var gOPN = gOPNExt.f;
      var $Symbol = global.Symbol;
      var $JSON = global.JSON;
      var _stringify = $JSON && $JSON.stringify;
      var PROTOTYPE = "prototype";
      var HIDDEN = wks("_hidden");
      var TO_PRIMITIVE = wks("toPrimitive");
      var isEnum = {}.propertyIsEnumerable;
      var SymbolRegistry = shared("symbol-registry");
      var AllSymbols = shared("symbols");
      var OPSymbols = shared("op-symbols");
      var ObjectProto = Object[PROTOTYPE];
      var USE_NATIVE = typeof $Symbol == "function";
      var QObject = global.QObject;
      // Don't use setters in Qt Script, https://github.com/zloirock/core-js/issues/173
      var setter =
        !QObject || !QObject[PROTOTYPE] || !QObject[PROTOTYPE].findChild;

      // fallback for old Android, https://code.google.com/p/v8/issues/detail?id=687
      var setSymbolDesc =
        DESCRIPTORS &&
        $fails(function() {
          return (
            _create(
              dP({}, "a", {
                get: function() {
                  return dP(this, "a", { value: 7 }).a;
                }
              })
            ).a != 7
          );
        })
          ? function(it, key, D) {
              var protoDesc = gOPD(ObjectProto, key);
              if (protoDesc) delete ObjectProto[key];
              dP(it, key, D);
              if (protoDesc && it !== ObjectProto)
                dP(ObjectProto, key, protoDesc);
            }
          : dP;

      var wrap = function(tag) {
        var sym = (AllSymbols[tag] = _create($Symbol[PROTOTYPE]));
        sym._k = tag;
        return sym;
      };

      var isSymbol =
        USE_NATIVE && typeof $Symbol.iterator == "symbol"
          ? function(it) {
              return typeof it == "symbol";
            }
          : function(it) {
              return it instanceof $Symbol;
            };

      var $defineProperty = function defineProperty(it, key, D) {
        if (it === ObjectProto) $defineProperty(OPSymbols, key, D);
        anObject(it);
        key = toPrimitive(key, true);
        anObject(D);
        if (has(AllSymbols, key)) {
          if (!D.enumerable) {
            if (!has(it, HIDDEN)) dP(it, HIDDEN, createDesc(1, {}));
            it[HIDDEN][key] = true;
          } else {
            if (has(it, HIDDEN) && it[HIDDEN][key]) it[HIDDEN][key] = false;
            D = _create(D, { enumerable: createDesc(0, false) });
          }
          return setSymbolDesc(it, key, D);
        }
        return dP(it, key, D);
      };
      var $defineProperties = function defineProperties(it, P) {
        anObject(it);
        var keys = enumKeys((P = toIObject(P)));
        var i = 0;
        var l = keys.length;
        var key;
        while (l > i) $defineProperty(it, (key = keys[i++]), P[key]);
        return it;
      };
      var $create = function create(it, P) {
        return P === undefined
          ? _create(it)
          : $defineProperties(_create(it), P);
      };
      var $propertyIsEnumerable = function propertyIsEnumerable(key) {
        var E = isEnum.call(this, (key = toPrimitive(key, true)));
        if (
          this === ObjectProto &&
          has(AllSymbols, key) &&
          !has(OPSymbols, key)
        )
          return false;
        return E ||
          !has(this, key) ||
          !has(AllSymbols, key) ||
          (has(this, HIDDEN) && this[HIDDEN][key])
          ? E
          : true;
      };
      var $getOwnPropertyDescriptor = function getOwnPropertyDescriptor(
        it,
        key
      ) {
        it = toIObject(it);
        key = toPrimitive(key, true);
        if (it === ObjectProto && has(AllSymbols, key) && !has(OPSymbols, key))
          return;
        var D = gOPD(it, key);
        if (D && has(AllSymbols, key) && !(has(it, HIDDEN) && it[HIDDEN][key]))
          D.enumerable = true;
        return D;
      };
      var $getOwnPropertyNames = function getOwnPropertyNames(it) {
        var names = gOPN(toIObject(it));
        var result = [];
        var i = 0;
        var key;
        while (names.length > i) {
          if (
            !has(AllSymbols, (key = names[i++])) &&
            key != HIDDEN &&
            key != META
          )
            result.push(key);
        }
        return result;
      };
      var $getOwnPropertySymbols = function getOwnPropertySymbols(it) {
        var IS_OP = it === ObjectProto;
        var names = gOPN(IS_OP ? OPSymbols : toIObject(it));
        var result = [];
        var i = 0;
        var key;
        while (names.length > i) {
          if (
            has(AllSymbols, (key = names[i++])) &&
            (IS_OP ? has(ObjectProto, key) : true)
          )
            result.push(AllSymbols[key]);
        }
        return result;
      };

      // 19.4.1.1 Symbol([description])
      if (!USE_NATIVE) {
        $Symbol = function Symbol() {
          if (this instanceof $Symbol)
            throw TypeError("Symbol is not a constructor!");
          var tag = uid(arguments.length > 0 ? arguments[0] : undefined);
          var $set = function(value) {
            if (this === ObjectProto) $set.call(OPSymbols, value);
            if (has(this, HIDDEN) && has(this[HIDDEN], tag))
              this[HIDDEN][tag] = false;
            setSymbolDesc(this, tag, createDesc(1, value));
          };
          if (DESCRIPTORS && setter)
            setSymbolDesc(ObjectProto, tag, { configurable: true, set: $set });
          return wrap(tag);
        };
        redefine($Symbol[PROTOTYPE], "toString", function toString() {
          return this._k;
        });

        $GOPD.f = $getOwnPropertyDescriptor;
        $DP.f = $defineProperty;
        __webpack_require__(61).f = gOPNExt.f = $getOwnPropertyNames;
        __webpack_require__(17).f = $propertyIsEnumerable;
        __webpack_require__(34).f = $getOwnPropertySymbols;

        if (DESCRIPTORS && !__webpack_require__(24)) {
          redefine(
            ObjectProto,
            "propertyIsEnumerable",
            $propertyIsEnumerable,
            true
          );
        }

        wksExt.f = function(name) {
          return wrap(wks(name));
        };
      }

      $export($export.G + $export.W + $export.F * !USE_NATIVE, {
        Symbol: $Symbol
      });

      for (
        var es6Symbols = // 19.4.2.2, 19.4.2.3, 19.4.2.4, 19.4.2.6, 19.4.2.8, 19.4.2.9, 19.4.2.10, 19.4.2.11, 19.4.2.12, 19.4.2.13, 19.4.2.14
          "hasInstance,isConcatSpreadable,iterator,match,replace,search,species,split,toPrimitive,toStringTag,unscopables".split(
            ","
          ),
          j = 0;
        es6Symbols.length > j;

      )
        wks(es6Symbols[j++]);

      for (
        var wellKnownSymbols = $keys(wks.store), k = 0;
        wellKnownSymbols.length > k;

      )
        wksDefine(wellKnownSymbols[k++]);

      $export($export.S + $export.F * !USE_NATIVE, "Symbol", {
        // 19.4.2.1 Symbol.for(key)
        for: function(key) {
          return has(SymbolRegistry, (key += ""))
            ? SymbolRegistry[key]
            : (SymbolRegistry[key] = $Symbol(key));
        },
        // 19.4.2.5 Symbol.keyFor(sym)
        keyFor: function keyFor(sym) {
          if (!isSymbol(sym)) throw TypeError(sym + " is not a symbol!");
          for (var key in SymbolRegistry)
            if (SymbolRegistry[key] === sym) return key;
        },
        useSetter: function() {
          setter = true;
        },
        useSimple: function() {
          setter = false;
        }
      });

      $export($export.S + $export.F * !USE_NATIVE, "Object", {
        // 19.1.2.2 Object.create(O [, Properties])
        create: $create,
        // 19.1.2.4 Object.defineProperty(O, P, Attributes)
        defineProperty: $defineProperty,
        // 19.1.2.3 Object.defineProperties(O, Properties)
        defineProperties: $defineProperties,
        // 19.1.2.6 Object.getOwnPropertyDescriptor(O, P)
        getOwnPropertyDescriptor: $getOwnPropertyDescriptor,
        // 19.1.2.7 Object.getOwnPropertyNames(O)
        getOwnPropertyNames: $getOwnPropertyNames,
        // 19.1.2.8 Object.getOwnPropertySymbols(O)
        getOwnPropertySymbols: $getOwnPropertySymbols
      });

      // 24.3.2 JSON.stringify(value [, replacer [, space]])
      $JSON &&
        $export(
          $export.S +
            $export.F *
              (!USE_NATIVE ||
                $fails(function() {
                  var S = $Symbol();
                  // MS Edge converts symbol values to JSON as {}
                  // WebKit converts symbol values to JSON as null
                  // V8 throws on boxed symbols
                  return (
                    _stringify([S]) != "[null]" ||
                    _stringify({ a: S }) != "{}" ||
                    _stringify(Object(S)) != "{}"
                  );
                })),
          "JSON",
          {
            stringify: function stringify(it) {
              var args = [it];
              var i = 1;
              var replacer, $replacer;
              while (arguments.length > i) args.push(arguments[i++]);
              $replacer = replacer = args[1];
              if ((!isObject(replacer) && it === undefined) || isSymbol(it))
                return; // IE8 returns string on undefined
              if (!isArray(replacer))
                replacer = function(key, value) {
                  if (typeof $replacer == "function")
                    value = $replacer.call(this, key, value);
                  if (!isSymbol(value)) return value;
                };
              args[1] = replacer;
              return _stringify.apply($JSON, args);
            }
          }
        );

      // 19.4.3.4 Symbol.prototype[@@toPrimitive](hint)
      $Symbol[PROTOTYPE][TO_PRIMITIVE] ||
        __webpack_require__(7)(
          $Symbol[PROTOTYPE],
          TO_PRIMITIVE,
          $Symbol[PROTOTYPE].valueOf
        );
      // 19.4.3.5 Symbol.prototype[@@toStringTag]
      setToStringTag($Symbol, "Symbol");
      // 20.2.1.9 Math[@@toStringTag]
      setToStringTag(Math, "Math", true);
      // 24.3.3 JSON[@@toStringTag]
      setToStringTag(global.JSON, "JSON", true);

      /***/
    },
    /* 130 */
    /***/ function(module, exports, __webpack_require__) {
      var META = __webpack_require__(21)("meta");
      var isObject = __webpack_require__(8);
      var has = __webpack_require__(9);
      var setDesc = __webpack_require__(4).f;
      var id = 0;
      var isExtensible =
        Object.isExtensible ||
        function() {
          return true;
        };
      var FREEZE = !__webpack_require__(11)(function() {
        return isExtensible(Object.preventExtensions({}));
      });
      var setMeta = function(it) {
        setDesc(it, META, {
          value: {
            i: "O" + ++id, // object ID
            w: {} // weak collections IDs
          }
        });
      };
      var fastKey = function(it, create) {
        // return primitive with prefix
        if (!isObject(it))
          return typeof it == "symbol"
            ? it
            : (typeof it == "string" ? "S" : "P") + it;
        if (!has(it, META)) {
          // can't set metadata to uncaught frozen object
          if (!isExtensible(it)) return "F";
          // not necessary to add metadata
          if (!create) return "E";
          // add missing metadata
          setMeta(it);
          // return object ID
        }
        return it[META].i;
      };
      var getWeak = function(it, create) {
        if (!has(it, META)) {
          // can't set metadata to uncaught frozen object
          if (!isExtensible(it)) return true;
          // not necessary to add metadata
          if (!create) return false;
          // add missing metadata
          setMeta(it);
          // return hash weak collections IDs
        }
        return it[META].w;
      };
      // add metadata on freeze-family methods calling
      var onFreeze = function(it) {
        if (FREEZE && meta.NEED && isExtensible(it) && !has(it, META))
          setMeta(it);
        return it;
      };
      var meta = (module.exports = {
        KEY: META,
        NEED: false,
        fastKey: fastKey,
        getWeak: getWeak,
        onFreeze: onFreeze
      });

      /***/
    },
    /* 131 */
    /***/ function(module, exports, __webpack_require__) {
      // all enumerable object keys, includes symbols
      var getKeys = __webpack_require__(12);
      var gOPS = __webpack_require__(34);
      var pIE = __webpack_require__(17);
      module.exports = function(it) {
        var result = getKeys(it);
        var getSymbols = gOPS.f;
        if (getSymbols) {
          var symbols = getSymbols(it);
          var isEnum = pIE.f;
          var i = 0;
          var key;
          while (symbols.length > i)
            if (isEnum.call(it, (key = symbols[i++]))) result.push(key);
        }
        return result;
      };

      /***/
    },
    /* 132 */
    /***/ function(module, exports, __webpack_require__) {
      // 7.2.2 IsArray(argument)
      var cof = __webpack_require__(16);
      module.exports =
        Array.isArray ||
        function isArray(arg) {
          return cof(arg) == "Array";
        };

      /***/
    },
    /* 133 */
    /***/ function(module, exports, __webpack_require__) {
      // fallback for IE11 buggy Object.getOwnPropertyNames with iframe and window
      var toIObject = __webpack_require__(10);
      var gOPN = __webpack_require__(61).f;
      var toString = {}.toString;

      var windowNames =
        typeof window == "object" && window && Object.getOwnPropertyNames
          ? Object.getOwnPropertyNames(window)
          : [];

      var getWindowNames = function(it) {
        try {
          return gOPN(it);
        } catch (e) {
          return windowNames.slice();
        }
      };

      module.exports.f = function getOwnPropertyNames(it) {
        return windowNames && toString.call(it) == "[object Window]"
          ? getWindowNames(it)
          : gOPN(toIObject(it));
      };

      /***/
    },
    /* 134 */
    /***/ function(module, exports, __webpack_require__) {
      var pIE = __webpack_require__(17);
      var createDesc = __webpack_require__(15);
      var toIObject = __webpack_require__(10);
      var toPrimitive = __webpack_require__(27);
      var has = __webpack_require__(9);
      var IE8_DOM_DEFINE = __webpack_require__(41);
      var gOPD = Object.getOwnPropertyDescriptor;

      exports.f = __webpack_require__(6)
        ? gOPD
        : function getOwnPropertyDescriptor(O, P) {
            O = toIObject(O);
            P = toPrimitive(P, true);
            if (IE8_DOM_DEFINE)
              try {
                return gOPD(O, P);
              } catch (e) {
                /* empty */
              }
            if (has(O, P)) return createDesc(!pIE.f.call(O, P), O[P]);
          };

      /***/
    },
    /* 135 */
    /***/ function(module, exports, __webpack_require__) {
      __webpack_require__(40)("asyncIterator");

      /***/
    },
    /* 136 */
    /***/ function(module, exports, __webpack_require__) {
      __webpack_require__(40)("observable");

      /***/
    },
    /* 137 */
    /***/ function(module, exports, __webpack_require__) {
      "use strict";

      exports.__esModule = true;

      exports.default = function(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
          throw new TypeError("Cannot call a class as a function");
        }
      };

      /***/
    },
    /* 138 */
    /***/ function(module, exports, __webpack_require__) {
      "use strict";

      exports.__esModule = true;

      var _defineProperty = __webpack_require__(139);

      var _defineProperty2 = _interopRequireDefault(_defineProperty);

      function _interopRequireDefault(obj) {
        return obj && obj.__esModule ? obj : { default: obj };
      }

      exports.default = (function() {
        function defineProperties(target, props) {
          for (var i = 0; i < props.length; i++) {
            var descriptor = props[i];
            descriptor.enumerable = descriptor.enumerable || false;
            descriptor.configurable = true;
            if ("value" in descriptor) descriptor.writable = true;
            (0, _defineProperty2.default)(target, descriptor.key, descriptor);
          }
        }

        return function(Constructor, protoProps, staticProps) {
          if (protoProps) defineProperties(Constructor.prototype, protoProps);
          if (staticProps) defineProperties(Constructor, staticProps);
          return Constructor;
        };
      })();

      /***/
    },
    /* 139 */
    /***/ function(module, exports, __webpack_require__) {
      module.exports = { default: __webpack_require__(140), __esModule: true };

      /***/
    },
    /* 140 */
    /***/ function(module, exports, __webpack_require__) {
      __webpack_require__(141);
      var $Object = __webpack_require__(0).Object;
      module.exports = function defineProperty(it, key, desc) {
        return $Object.defineProperty(it, key, desc);
      };

      /***/
    },
    /* 141 */
    /***/ function(module, exports, __webpack_require__) {
      var $export = __webpack_require__(3);
      // 19.1.2.4 / 15.2.3.6 Object.defineProperty(O, P, Attributes)
      $export($export.S + $export.F * !__webpack_require__(6), "Object", {
        defineProperty: __webpack_require__(4).f
      });

      /***/
    },
    /* 142 */
    /***/ function(module, exports, __webpack_require__) {
      "use strict";

      var _promise = __webpack_require__(55);

      var _promise2 = _interopRequireDefault(_promise);

      var _toConsumableArray2 = __webpack_require__(49);

      var _toConsumableArray3 = _interopRequireDefault(_toConsumableArray2);

      var _slicedToArray2 = __webpack_require__(46);

      var _slicedToArray3 = _interopRequireDefault(_slicedToArray2);

      function _interopRequireDefault(obj) {
        return obj && obj.__esModule ? obj : { default: obj };
      }

      var FetchMock = {};

      FetchMock.callsFilteredByName = function(name) {
        if (name === true) {
          return this._allCalls.filter(function(call) {
            return !call.unmatched;
          });
        }
        if (name === false) {
          return this._allCalls.filter(function(call) {
            return call.unmatched;
          });
        }

        if (typeof name === "undefined") {
          return this._allCalls;
        }

        if (this._calls[name]) {
          return this._calls[name];
        }
        return this._allCalls.filter(function(_ref) {
          var _ref2 = (0, _slicedToArray3.default)(_ref, 1),
            url = _ref2[0];

          return url === name || url.url === name;
        });
      };

      FetchMock.calls = function(name) {
        var options =
          arguments.length > 1 && arguments[1] !== undefined
            ? arguments[1]
            : {};

        if (typeof options === "string") {
          options = { method: options };
        }

        var calls = this.callsFilteredByName(name);

        if (options.method) {
          var testMethod = options.method.toLowerCase();
          calls = calls.filter(function(_ref3) {
            var _ref4 = (0, _slicedToArray3.default)(_ref3, 2),
              url = _ref4[0],
              _ref4$ = _ref4[1],
              opts = _ref4$ === undefined ? {} : _ref4$;

            var method = (url.method || opts.method || "get").toLowerCase();
            return method === testMethod;
          });
        }
        return calls;
      };

      FetchMock.lastCall = function(name, options) {
        return []
          .concat((0, _toConsumableArray3.default)(this.calls(name, options)))
          .pop();
      };

      FetchMock.normalizeLastCall = function(name, options) {
        var call = this.lastCall(name, options) || [];
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
        return _promise2.default.all(this._holdingPromises);
      };

      FetchMock.done = function(name) {
        var _this = this;

        var names =
          name && typeof name !== "boolean"
            ? [name]
            : this.routes.map(function(r) {
                return r.name;
              });

        // Can't use array.every because
        // a) not widely supported
        // b) would exit after first failure, which would break the logging
        return (
          names
            .map(function(name) {
              if (!_this.called(name)) {
                console.warn("Warning: " + name + " not called"); // eslint-disable-line
                return false;
              }
              // would use array.find... but again not so widely supported
              var expectedTimes = (_this.routes.filter(function(r) {
                return r.name === name;
              }) || [{}])[0].repeat;

              if (!expectedTimes) {
                return true;
              }

              var actualTimes = _this.calls(name).length;
              if (expectedTimes > actualTimes) {
                console.warn(
                  "Warning: " +
                    name +
                    " only called " +
                    actualTimes +
                    " times, but " +
                    expectedTimes +
                    " expected"
                ); // eslint-disable-line
                return false;
              } else {
                return true;
              }
            })
            .filter(function(bool) {
              return !bool;
            }).length === 0
        );
      };

      module.exports = FetchMock;

      /***/
    },
    /* 143 */
    /***/ function(module, exports, __webpack_require__) {
      "use strict";

      var statusTextMap = {
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

      /***/
    }
    /******/
  ]
);
