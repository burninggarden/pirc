var Heket = require('heket');

var IrcRules = require('./lib/rule-lists/irc');

var parser = Heket.createParser(`
	parameters = <message-target> *( "," <message-target> ) " :" <message-body>
`, IrcRules);

var match = parser.parse('* :*** Looking up your hostname...');

console.log(match.get('message_target'));
