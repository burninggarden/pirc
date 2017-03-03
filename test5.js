
global.req = require('req');

var Regexes = req('/constants/regexes');

console.log(Regexes.NICK.test(undefined));
