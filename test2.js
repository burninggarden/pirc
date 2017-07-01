var Heket = require('heket');

var IrcRules = require('./lib/rule-lists/irc');

var parser = Heket.createParser(`
	parameters = ( <channel-name> / <nickname> ) ( *<mode-change> / <mode-query> )
`, IrcRules);

var input = '#foobar +si';

var match = parser.parse(input);

console.log(match.getRawResult());
