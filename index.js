var util = require('util');

var value = Symbol('value');

var safe = function safe(obj) {
  var target = isObject(obj) ? obj : function() {};

  return new Proxy(target, {
    get: function(receiver, name) {
      if (name === util.inspect.custom) {
        return function(depth, options) {
          var padding = ' '.repeat('safe( '.length);
          var inner = util.inspect(obj, options).replace(/\n/g, '\n' + padding);
          return options.stylize('safe', 'special') + '( ' + inner + ' )';
        }
      }

      if (name === value) {
        return obj;
      }

      if (obj == null) {
        return safe(undefined);
      }

      if (isFunction(obj[name])) {
        return safe(obj[name].bind(obj));
      }

      return safe(obj[name]);
    },
    apply: function(target, thisObj, args) {
      var fnResult = isFunction(obj) ?
        obj.apply(thisObj, args) : undefined;

      return safe(fnResult);
    }
  });
};

safe.value = value;

module.exports = safe;

var isFunction = function(obj) {
  return typeof obj === 'function';
};

var isObject = function(obj) {
  var type = typeof obj;
  return type === 'function' || type === 'object' && !!obj;
};
