global.req = require('req');

var Regexes = require('./constants/regexes');

var user_id = 'crilbith!~pirc@toroon0246w-lp140-02-70-27-164-136.dsl.bell.ca';

// var host = 'toroon0246w-lp140-02-70-27-164-136.dsl.bell.ca';

console.log(Regexes.USER_IDENTIFIER);

console.log(Regexes.USER_IDENTIFIER.test(user_id));

