# betterarrays

*Make your arrays better, wisely.*

## How?

The library provides a `BetterArrays` object which contains all the utility functions.

**In Node:**

Assuming the module is registered as `betterarrays` (you might need to adjust the path if you're requiring a local file directly, e.g., `require('./index.js')` and ensure `index.js` sets up `module.exports`):
```javascript
const BetterArrays = require('betterarrays');

// Example usage:
const numbers = [1, 2, 3, null, 4, undefined, 5];
const compacted = BetterArrays.compact.call(numbers);
//> [1, 2, 3, 4, 5]
```

**In Browser:**

Include the script:
```html
<script src="betterarrays.js"></script>
```
This makes `window.BetterArrays` available globally.
```javascript
const letters = ['a', 'b', 'c', 'd'];
const firstLetter = window.BetterArrays.first.call(letters);
//> 'a'
```

## What?

`BetterArrays` provides a collection of utility functions to work with arrays in a more direct way, without modifying `Array.prototype` by default.

```javascript
const alphabet = 'abcdefghijklmnopqrstuvwxyz'.split('');
const vowels = 'aeiou'.split('');

// Using BetterArrays directly:
const consonants = BetterArrays.without.call(alphabet, vowels);
//> ["b", "c", "d", "f", "g", "h", "j", "k", "l", "m", "n", "p", "q", "r", "s", "t", "v", "w", "x", "y", "z"]

const firstConsonant = BetterArrays.first.call(consonants);
//> "b"
```

## Attaching to Prototype (Optional)

If you prefer the chained syntax and understand the implications (see "Why not?" below), you can attach all `BetterArrays` methods to `Array.prototype`:

```javascript
// Make sure BetterArrays is loaded first (e.g., via <script> or require)
// In a browser, if loaded via <script>:
// window.BetterArrays.attachToPrototype();
// or, if you have a reference:
// BetterArrays.attachToPrototype();


// Now you can use the methods directly on arrays:
BetterArrays.attachToPrototype(); // Call this once

const alphabet = 'abcdefghijklmnopqrstuvwxyz'.split('');
const vowels = 'aeiou'.split('');

const consonants = alphabet.without(vowels);
//> ["b", "c", "d", "f", "g", "h", "j", "k", "l", "m", "n", "p", "q", "r", "s", "t", "v", "w", "x", "y", "z"]
```

## Why? (The Chaining Option)

Chaining array operations can be very expressive. This is now an **optional** feature, enabled by calling `BetterArrays.attachToPrototype()`.

```javascript
BetterArrays.attachToPrototype(); // Enable prototype methods first!

const alphabet = 'abcdefghijklmnopqrstuvwxyz'.split('');
const vowels = 'aeiou'.split('');

const firstConsonant = alphabet
  .without(vowels)
  .first();
//> "b"
```
Without `attachToPrototype()`, you achieve a similar result by using the `BetterArrays` object directly, often with intermediate variables or nested calls:
```javascript
const alphabet = 'abcdefghijklmnopqrstuvwxyz'.split('');
const vowels = 'aeiou'.split('');

const consonants = BetterArrays.without.call(alphabet, vowels);
const firstConsonant = BetterArrays.first.call(consonants);
//> "b"
```

## Why not? (The Default Behavior and Its Advantages)

Modifying `Array.prototype` directly (as done by `BetterArrays.attachToPrototype()`) can lead to unexpected behavior, primarily because it adds enumerable properties to all arrays. This means these properties can show up in `for...in` loops.

**The Problem with Modifying `Array.prototype`:**

```javascript
// If BetterArrays.attachToPrototype() has been called:
BetterArrays.attachToPrototype();

for(const key in ['a']){ // Using an array with one element
  console.log(key);
}

// What you might expect:
//> "0" (the index of the element 'a')

// What you might get (output can vary):
//> "0"
//> "first"
//> "last"
//> "compact"
//> ... and all other methods attached by BetterArrays to Array.prototype
```
This happens because properties added to `Array.prototype` this way become enumerable by default.

**The `BetterArrays` Solution (Default Behavior):**

By default, `BetterArrays` does **not** modify `Array.prototype`. You use its methods via the `BetterArrays` object itself (e.g., `BetterArrays.first.call(myArray)`). This approach:
*   **Avoids polluting `Array.prototype`:** No new properties are added to all arrays.
*   **Prevents `for...in` loop issues:** `BetterArrays` methods won't appear in such loops.
*   **Offers more explicit control:** It's clear where the methods are coming from.

If you choose to use `BetterArrays.attachToPrototype()`, you gain the convenience of the chained syntax but re-introduce the enumerable properties issue. Be mindful of this trade-off and choose the approach that best suits your project's needs.
```
