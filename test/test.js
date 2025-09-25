require('../index.js'); // This should make window.BetterArrays available

const alphabet = 'abcdefghijklmnopqrstuvwxyz'.split('');
const { BetterArrays } = window; // Assuming BetterArrays is exposed on window

// - first
test('BetterArrays.first returns first value', () => {
  expect(BetterArrays.first.call(alphabet)).toBe('a');
});

// - initial
test('BetterArrays.initial(n) returns everything but the terminal n values', () => {
  expect(BetterArrays.initial.call(alphabet, 2)).toEqual('abcdefghijklmnopqrstuvwx'.split(''));
});

// - last
test('BetterArrays.last() returns last value', () => {
  expect(BetterArrays.last.call(alphabet)).toBe('z');
});

// - rest
test('BetterArrays.rest() returns last n-1 values', () => {
  expect(BetterArrays.rest.call(alphabet)).toEqual('bcdefghijklmnopqrstuvwxyz'.split(''));
});
test('BetterArrays.rest(n) returns last n values', () => {
  expect(BetterArrays.rest.call(alphabet, 10)).toEqual('klmnopqrstuvwxyz'.split(''));
});

// - compact
test('BetterArrays.compact returns an array without falsy values', () => {
  expect(BetterArrays.compact.call(['a', null, 'b', undefined, 'c', false, 'd', 0])).toEqual(['a','b','c','d']);
});

// - flatten
test('BetterArrays.flatten returns a flat array', () => {
  expect(BetterArrays.flatten.call(['a','b','c'])).toEqual(['a','b','c']);
});
test('BetterArrays.flatten flattens an array', () => {
  expect(BetterArrays.flatten.call([['a'],'b','c'])).toEqual(['a','b','c']);
});
test('BetterArrays.flatten(true) shallowly flattens an array', () => {
  expect(BetterArrays.flatten.call([[['a']],'b','c'], true)).toEqual([['a'],'b','c']);
});

// - without
test('BetterArrays.without(Array) returns an array without elements in Array', () => {
  expect(BetterArrays.without.call(['a','b','c','a'], [['a']])).toEqual(['b','c']);
});
test('BetterArrays.without(...args) returns an array without elements in args', () => {
  expect(BetterArrays.without.call(['a','b','c','a'], 'a', 'b')).toEqual(['c']);
});

// - union
test('BetterArrays.union() returns an array with unique elements', () => {
  expect(BetterArrays.union.call(['a','b','c','a'], [])).toEqual(['a','b','c']);
});
test('BetterArrays.union(Array) returns an array with the union of unique elements', () => {
  expect(BetterArrays.union.call(['a','a','b','c'], ['b','c','d','e'])).toEqual(['a','b','c','d','e']);
});

// - intersection
test('BetterArrays.intersection(Array) returns an array with only common elements', () => {
  expect(BetterArrays.intersection.call(alphabet, ['a','b',3])).toEqual(['a','b']);
});

// - difference
test('BetterArrays.difference(Array) returns an array with only elements unique to this', () => {
  expect(BetterArrays.difference.call(['a','b','c'], ['b','d'])).toEqual(['a','c']);
});

// - uniq
test('BetterArrays.uniq() returns an array with unique elements', () => {
  expect(BetterArrays.uniq.call(['a','b','c','a'])).toEqual(['a','b','c']);
});

test('BetterArrays.uniq(true) returns an array with unique elements', () => {
  expect(BetterArrays.uniq.call(['a','a','b','c'], true)).toEqual(['a','b','c']);
});


describe('BetterArrays.attachToPrototype', () => {
  // Call attachToPrototype once for this test suite
  BetterArrays.attachToPrototype();

  test('should attach functions to Array.prototype', () => {
    expect(typeof [].first).toBe('function');
    expect(typeof [].last).toBe('function');
    expect(typeof [].compact).toBe('function');
  });

  test('attached functions should work correctly on Array.prototype', () => {
    expect(['x', 'y', 'z'].first()).toBe('x');
    expect(['x', 'y', 'z'].last()).toBe('z');
    expect([null, 'x', undefined, 'y', false].compact()).toEqual(['x', 'y']);
    expect(['a','a','b','c'].uniq(true)).toEqual(['a','b','c']);
  });

  test('attachToPrototype itself should not be added to Array.prototype', () => {
    expect(typeof [].attachToPrototype).toBe('undefined');
  });

  test('original BetterArrays methods still work', () => {
    expect(BetterArrays.first.call(alphabet)).toBe('a');
  });

  // It might be good to reset the prototype if other tests depend on a clean state,
  // but for this specific set of tests, it's probably fine.
  // If needed, one could store original Array.prototype methods and restore them.
});

// - zip
// - unzip
// - object
// - chunk
// - indexOf
// - lastIndexOf
// - sortedIndex
// - findIndex
// - findLastIndex
// - range
