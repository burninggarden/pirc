var Heket = require('heket');

var IrcRules = require('./lib/rule-lists/irc');

var parser = Heket.createParser(`
	parameters = <message-target> *( "," <message-target> ) " :" <message-body>
`, IrcRules);

var input = '* :*** Looking up your hostname...';

var match = parser.parse(input);

console.log(match.getRawResult());
