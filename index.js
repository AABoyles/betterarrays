(function(){
  "use strict";

  var BetterArrays = {};

  BetterArrays.first = function(){
    return this[0];
  };

  BetterArrays.initial = function(n){
    if(!n) n = 1;
    return this.slice(0, this.length-n);
  };

  BetterArrays.last = function(){
    return this[this.length - 1];
  };

  var rest = function(index){
    if(!index) index = 1;
    return this.slice(index);
  };

  BetterArrays.rest = rest;
  BetterArrays.tail = rest;
  BetterArrays.drop = rest;

  BetterArrays.compact = function(){
    var output = [];
    var n = this.length;
    for(var i = 0; i < n; i++){
      var el = this[i];
      if(el) output.push(el);
    }
    return output;
  };

  BetterArrays.flatten = function(shallow){
    //implementation based on https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/flat
    if(shallow){
      return this.reduce(function(acc, val){ return acc.concat(val); }, []);
    }
    // Note: In a scenario where BetterArrays.flatten is called on an array that contains other arrays,
    // those inner arrays won't have .flatten() if we only call it as BetterArrays.flatten.call(innerArray, true).
    // This will be addressed when deciding how to call these functions (e.g., by attaching them to Array.prototype again,
    // or by ensuring all array operations go through BetterArrays). For now, the function logic is preserved.
    return this.reduce(function(acc, val){ return Array.isArray(val) ? acc.concat(BetterArrays.flatten.call(val, true)) : acc.concat(val); }, []);
  };

  BetterArrays.clone = function(deep){
    if(deep) return JSON.parse(JSON.stringify(this));
    return this.slice();
  };

  BetterArrays.without = function(){
    var output = [];
    var values;
    if(arguments.length === 1 & Array.isArray(arguments[0])){
      values = arguments[0];
    } else {
      values = [];
      var n = arguments.length;
      for(var i = 0; i < n; i++) values.push(arguments[i]);
    }
    var n = this.length;
    for(var i = 0; i < n; i++){
      var el = this[i];
      if(values.indexOf(el) < 0) output.push(el);
    }
    return output;
  };

  BetterArrays.union = function(that){
    // Relies on .uniq being available on the result of this.concat(that)
    // This will need to be BetterArrays.uniq.call(this.concat(that)) if .uniq is not on Array.prototype
    var concatenated = this.concat(that);
    return BetterArrays.uniq.call(concatenated);
  };

  BetterArrays.intersection = function(that){
    var output = [];
    var n = this.length;
    for(var i = 0; i < n; i++){
      var el = this[i];
      if(that.indexOf(el) > -1) output.push(el); // .indexOf is fine as it's a native Array method
    }
    return output;
  };

  BetterArrays.difference = function(that){
    var output = [];
    var n = this.length;
    for(var i = 0; i < n; i++){
      var el = this[i];
      if(that.indexOf(el) == -1) output.push(el); // .indexOf is fine
    }
    return output;
  };

  BetterArrays.get = function(n){
    return this[n];
  }

  var uniq = function(isSorted, iteratee){ // This is the uniq implementation
    var output = [];
    if(!iteratee) iteratee = function(a, b){ return a != b; }
    if(isSorted){
      if (this.length > 0) output.push(this[0]); // Ensure 'this' is not empty before accessing this[0]
      var n = this.length;
      for(var i = 1; i < n; i++){
        if(iteratee(this[i], this[i-1])) output.push(this[i]);
      }
    } else {
      var n = this.length;
      for(var i = 0; i < n; i++){
        var distinct = true;
        for(var j = 0; j < i; j++){
          if(!iteratee(this[i], this[j])){
            distinct = false;
            break;
          }
        }
        if(distinct) output.push(this[i]);
      }
    }
    return output;
  };
  BetterArrays.uniq = uniq;
  BetterArrays.unique = uniq;

  // For 'contains', it should reference the 'includes' method, which might be a polyfill.
  // If 'includes' is polyfilled on Array.prototype, this will work.
  // If 'Array.prototype.includes' is not guaranteed (e.g. very old env), this would need to be BetterArrays.includes
  BetterArrays.contains = function() {
    return Array.prototype.includes.apply(this, arguments);
  };

  BetterArrays.attachToPrototype = function() {
    for (var key in this) {
      if (this.hasOwnProperty(key) && key !== 'attachToPrototype') {
        Array.prototype[key] = this[key];
      }
    }
  };

  //# Polyfills:

  //# from https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/isArray
  if (!Array.isArray){
    Array.isArray = function(arg) {
      return Object.prototype.toString.call(arg) === '[object Array]';
    };
  }

  //# from https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/from
  // Production steps of ECMA-262, Edition 6, 22.1.2.1
  if (!Array.from) {
    Array.from = (function () {
      var toStr = Object.prototype.toString;
      var isCallable = function (fn) {
        return typeof fn === 'function' || toStr.call(fn) === '[object Function]';
      };
      var toInteger = function (value) {
        var number = Number(value);
        if (isNaN(number)) { return 0; }
        if (number === 0 || !isFinite(number)) { return number; }
        return (number > 0 ? 1 : -1) * Math.floor(Math.abs(number));
      };
      var maxSafeInteger = Math.pow(2, 53) - 1;
      var toLength = function (value) {
        var len = toInteger(value);
        return Math.min(Math.max(len, 0), maxSafeInteger);
      };

      // The length property of the from method is 1.
      return function from(arrayLike/*, mapFn, thisArg */) {
        // 1. Let C be the this value.
        var C = this;

        // 2. Let items be ToObject(arrayLike).
        var items = Object(arrayLike);

        // 3. ReturnIfAbrupt(items).
        if (arrayLike == null) {
          throw new TypeError('Array.from requires an array-like object - not null or undefined');
        }

        // 4. If mapfn is undefined, then let mapping be false.
        var mapFn = arguments.length > 1 ? arguments[1] : void undefined;
        var T;
        if (typeof mapFn !== 'undefined') {
          // 5. else
          // 5. a If IsCallable(mapfn) is false, throw a TypeError exception.
          if (!isCallable(mapFn)) {
            throw new TypeError('Array.from: when provided, the second argument must be a function');
          }

          // 5. b. If thisArg was supplied, let T be thisArg; else let T be undefined.
          if (arguments.length > 2) {
            T = arguments[2];
          }
        }

        // 10. Let lenValue be Get(items, "length").
        // 11. Let len be ToLength(lenValue).
        var len = toLength(items.length);

        // 13. If IsConstructor(C) is true, then
        // 13. a. Let A be the result of calling the [[Construct]] internal method
        // of C with an argument list containing the single item len.
        // 14. a. Else, Let A be ArrayCreate(len).
        var A = isCallable(C) ? Object(new C(len)) : new Array(len);

        // 16. Let k be 0.
        var k = 0;
        // 17. Repeat, while k < len… (also steps a - h)
        var kValue;
        while (k < len) {
          kValue = items[k];
          if (mapFn) {
            A[k] = typeof T === 'undefined' ? mapFn(kValue, k) : mapFn.call(T, kValue, k);
          } else {
            A[k] = kValue;
          }
          k += 1;
        }
        // 18. Let putStatus be Put(A, "length", len, true).
        A.length = len;
        // 20. Return A.
        return A;
      };
    }());
  }

  //# From https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/includes
  // https://tc39.github.io/ecma262/#sec-array.prototype.includes
  if (!Array.prototype.includes) {
    Object.defineProperty(Array.prototype, 'includes', {
      value: function(valueToFind, fromIndex) {

        if (this == null) {
          throw new TypeError('"this" is null or not defined');
        }

        // 1. Let O be ? ToObject(this value).
        var o = Object(this);

        // 2. Let len be ? ToLength(? Get(O, "length")).
        var len = o.length >>> 0;

        // 3. If len is 0, return false.
        if (len === 0) {
          return false;
        }

        // 4. Let n be ? ToInteger(fromIndex).
        //    (If fromIndex is undefined, this step produces the value 0.)
        var n = fromIndex | 0;

        // 5. If n ≥ 0, then
        //  a. Let k be n.
        // 6. Else n < 0,
        //  a. Let k be len + n.
        //  b. If k < 0, let k be 0.
        var k = Math.max(n >= 0 ? n : len - Math.abs(n), 0);

        function sameValueZero(x, y) {
          return x === y || (typeof x === 'number' && typeof y === 'number' && isNaN(x) && isNaN(y));
        }

        // 7. Repeat, while k < len
        while (k < len) {
          // a. Let elementK be the result of ? Get(O, ! ToString(k)).
          // b. If SameValueZero(valueToFind, elementK) is true, return true.
          if (sameValueZero(o[k], valueToFind)) {
            return true;
          }
          // c. Increase k by 1.
          k++;
        }

        // 8. Return false
        return false;
      }
    });
  }

  // Expose BetterArrays globally
  if (typeof window !== 'undefined') {
    window.BetterArrays = BetterArrays;
  }
})();
