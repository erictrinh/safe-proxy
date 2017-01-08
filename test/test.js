var expect = require('chai').expect;
var safe = require('../index.js');

var obj = {
  a: {
    b: {
      c: function() {
        return 'woo!';
      },

      d: function(n) {
        return n * n;
      },

      f: 'boom!',

      g: null,

      h: [1, 2, 3],

      i: function() {
        return this.h;
      }
    }
  },
  e: 'woo!'
};

var fn = function() {
  return 'pow!';
};

var Person = function(name, age) {
  this.getName = function() {
    return name;
  };

  this.getAge = function() {
    return age;
  };
};

var bob = new Person('Bob', 25);

var safeObj = safe(obj);
var safeFn = safe(fn);
var safeBob = safe(bob);

describe('safe-proxy', function() {
  it('should return a valid field', function() {
    expect(safeObj.e[safe.value]).to.equal('woo!');
  });

  it('should return undefined if an invalid field is accessed', function() {
    expect(safeObj.randomField[safe.value]).to.be.undefined();
  });

  it('should return a valid nested field', function() {
    expect(safeObj.a.b.f[safe.value]).to.equal('boom!');
  });

  it('should return undefined if middle of chain is undefined', function() {
    expect(safeObj.a.randomField.randomField.randomField[safe.value]).to.be.undefined();
  });

  it('should return null if property is null', function() {
    expect(safeObj.a.b.g[safe.value]).to.be.null;
  });

  it('should return undefined if middle of chain returns null', function() {
    expect(safeObj.a.b.g.randomField[safe.value]).to.be.undefined();
  });

  it('should return a valid non-primitive field', function() {
    expect(safeObj.a[safe.value]).to.equal(obj.a);
  });

  it('should call a function', function() {
    expect(safeObj.a.b.c()[safe.value]).to.equal('woo!');
  });

  it('should return undefined if the function doesn\'t exist', function() {
    expect(safeObj.a.b.randomField()[safe.value]).to.be.undefined();
  });

  it('should call a function with arguments', function() {
    expect(safeObj.a.b.d(5)[safe.value]).to.equal(25);
  });

  it('should be able to access properties on an object\'s prototype', function() {
    expect(safeObj.a.b.h.length[safe.value]).to.equal(3);
  });

  it('should retain this values', function() {
    expect(safeObj.a.b.i().length[safe.value]).to.equal(3);
  });

  it('should not throw an error if attempting to call a non-function as a function', function() {
    expect(safeObj.e).to.not.throw(TypeError);
  });

  it('should return undefined if we call a non-function', function() {
    expect(safeObj.e()[safe.value]).to.be.undefined();
  });

  it('should return undefined if we try to call random properties', function() {
    expect(safeObj.e().b()[safe.value]).to.be.undefined();
  });

  it('should call a safe object as a function', function() {
    expect(safeFn()[safe.value]).to.equal('pow!');
  });

  it('should be able to chain a safe function', function() {
    expect(safeFn().prop[safe.value]).to.be.undefined();
  });

  it('should be able to call properties on an instance of a class', function() {
    expect(safeBob.getName()[safe.value]).to.equal('Bob');
  });
});
