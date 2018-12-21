require('../index.js');

const alphabet = 'abcdefghijklmnopqrstuvwxyz'.split('');

// - first
test('Array.first returns first value', () => {
  expect(alphabet.first()).toBe('a');
});

// - initial
test('Array.initial(n) returns everything but the terminal n values', () => {
  expect(alphabet.initial(2)).toEqual('abcdefghijklmnopqrstuvwx'.split(''));
});

// - last
test('Array.last() returns last value', () => {
  expect(alphabet.last()).toBe('z');
});

// - rest
test('Array.rest() returns last n-1 values', () => {
  expect(alphabet.rest()).toEqual('bcdefghijklmnopqrstuvwxyz'.split(''));
});
test('Array.rest(n) returns last n values', () => {
  expect(alphabet.rest(10)).toEqual('klmnopqrstuvwxyz'.split(''));
});

// - compact
test('Array.compact returns an array without falsy values', () => {
  expect(['a', null, 'b', undefined, 'c', false, 'd', 0].compact()).toEqual(['a','b','c','d']);
});

// - flatten
test('Array.flatten returns a flat array', () => {
  expect(['a','b','c'].flatten()).toEqual(['a','b','c']);
});
test('Array.flatten flattens an array', () => {
  expect([['a'],'b','c'].flatten()).toEqual(['a','b','c']);
});
test('Array.flatten(true) shallowly flattens an array', () => {
  expect([[['a']],'b','c'].flatten(true)).toEqual([['a'],'b','c']);
});

// - without
test('Array.without(Array) returns an array without elements in Array', () => {
  expect(['a','b','c','a'].without(['a'])).toEqual(['b','c']);
});
test('Array.without(...args) returns an array without elements in args', () => {
  expect(['a','b','c','a'].without('a', 'b')).toEqual(['c']);
});

// - union
test('Array.union() returns an array with unique elements', () => {
  expect(['a','b','c','a'].union([])).toEqual(['a','b','c']);
});
test('Array.union(Array) returns an array with the union of unique elements', () => {
  expect(['a','a','b','c'].union(['b','c','d','e'])).toEqual(['a','b','c','d','e']);
});

// - intersection
test('Array.intersection(Array) returns an array with only common elements', () => {
  expect(alphabet.intersection(['a','b',3])).toEqual(['a','b']);
});

// - difference
test('Array.difference(Array) returns an array with only elements unique to this', () => {
  expect(alphabet.intersection(['a','b',3])).toEqual(['a','b']);
});

// - uniq
test('Array.uniq() returns an array with unique elements', () => {
  expect(['a','b','c','a'].uniq()).toEqual(['a','b','c']);
});

test('Array.uniq(true) returns an array with unique elements', () => {
  expect(['a','a','b','c'].uniq(true)).toEqual(['a','b','c']);
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
