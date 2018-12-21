# betterarrays

*Make your arrays better.*

## How?

In Node:

```javascript
require('betterarrays');
```

In Browser:

```javascript
<script src="betterarrays.js"></script>
```

## What?

```javascript
const alphabet = 'abcdefghijklmnopqrstuvwxyz'.split('');
const vowels = 'aeiou'.split('');

alphabet.without(vowels);
//> ["b", "c", "d", "f", "g", "h", "j", "k", "l", "m", "n", "p", "q", "r", "s", "t", "v", "w", "x", "y", "z"]
```

## Why?

Chaining!

```javascript
const alphabet = 'abcdefghijklmnopqrstuvwxyz'.split('');
const vowels = 'aeiou'.split('');

alphabet
  .without(vowels)
  .first();

//> "b"
```

## Why not?

Enumerable Properties!

```javascript
for(a in ['a']){
  console.log(a);
}

// What we should expect:
//> 'a'

// What we get:
//> 'a'
//> <a bunch of functions>
```
