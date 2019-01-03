#!/bin/env nodejs

var test = ".*";
if(process.argv.length > 2){
  test = process.argv[2];
}

var Benchmark = require('benchmark');
require('../index.js');

const alphabet = 'abcdefghijklmnopqrstuvwxyz'.split('');
const vowels = 'aeiou'.split('');

var tests = {};

tests.first = function(){
  var suite = new Benchmark.Suite;
  suite
    .add('Array.first', function() {
      alphabet.first();
    })
    .add('Array[0]', function() {
      alphabet[0];
    })
    .on('cycle', function(event) {
      console.log(String(event.target));
    })
    .on('complete', function() {
      console.log('Fastest is ' + this.filter('fastest').map('name'));
    })
    .run();
};

Object.keys(tests).forEach(t => {
  if(RegExp(test).test(t)){
    console.log('Testing ' + t + ':');
    tests[t]();
  }
});
