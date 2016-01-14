# safe-proxy

`safe-proxy` is a Javascript utility to allow for safe accessing of nested properties by soaking up nulls, inspired by Coffeescript's existential operator. It is the spiritual successor to [safe-access](https://github.com/erictrinh/safe-access). My friend [Palash](https://github.com/palasha) had the genius idea of improving `safe-access`’s syntax for calling functions by using [ES6 Proxies](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy). **Note that since the ES6 Proxy spec is still in flux (no browsers have implemented the latest spec as of January 2015), this is not meant to be used in production. However, it’s really freakin’ cool, so try it out.**

## Install

```
npm install safe-proxy
```

## Usage

Usage of ES6 Proxies is hidden behind a flag in Node, so in order to use them, you will need to run your application with the `--harmony-proxies` flag.

Use `safe-proxy` like this:

```javascript
var safe = require('safe-proxy');
safe(obj).that.is.very.nested.__value;
// the same as `obj.that.is.very.nested` EXCEPT
// returns undefined if any property in the chain is undefined
```

You can access arrays and call functions as you normally would. Just remember to access `__value` at the end.

```javascript
safe(obj).nested.property.and.array[0].func('some', 'args').__value;
```

## What's going on?

You can think of calling `safe(obj)` as wrapping `obj` in an object which will not throw an error no matter what properties you access or functions you call on it (even if `obj` is undefined, for instance). In order to *unwrap* the value, you’ll need to access the special property `__value`.

## Development

Clone this repo, and then from directory root run `npm install`. Start running tests with `npm test`. Tests will re-run when files change.

## License

`safe-proxy` is freely distributable under the terms of the [MIT license](LICENSE).
