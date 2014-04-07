'use strict';

var assert = require('assert');
var Jshint = require('../lib/jshint');
var path = require('path');

var fixtures = path.join(__dirname, 'fixtures');

function errorHandler(err){
    process.nextTick(function rethrow() { throw err; });
}

(new Jshint).run(
    [path.join(fixtures, 'nodemodule.js')], // inputs
    {}, // options
    console // logger
).then(function(inputs){

}).catch(errorHandler);

(new Jshint).run(
    [path.join(fixtures, 'missingsemicolon.js')], // inputs
    {}, // options
    console // logger
).then(function(inputs){

}).catch(errorHandler);

(new Jshint).run(
    [path.join(fixtures, 'extract.html')], // inputs
    {
        extract: 'auto'
    }, // options
    console // logger
).then(function(inputs){

}).catch(errorHandler);

(new Jshint).run(
    [path.join(fixtures, 'dontlint.js')], // inputs
    {
        extract: 'auto'
    }, // options
    console // logger
).then(function(inputs){

}).catch(errorHandler);
