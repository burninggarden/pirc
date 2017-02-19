global.req = require('req');

var Regexes = require('./constants/regexes');

// var user_id = 'crilbith!~pirc@toroon0246w-lp140-02-70-27-164-136.dsl.bell.ca';
var user_id = 'Ridgetopr!~pirc@127.0.0.1';

// var host = 'toroon0246w-lp140-02-70-27-164-136.dsl.bell.ca';

// console.log(Regexes.USER_IDENTIFIER);

var match = user_id.match(Regexes.USER_IDENTIFIER);

console.log(Regexes.USER_IDENTIFIER);

console.log(match[1]);
console.log(match[2]);
console.log(match[3]);

