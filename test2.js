var Heket = require('heket');

var IrcRules = require('./lib/rule-lists/irc');

var parser = Heket.createParser(`
	parameters = <target> " " <hostname> " " <server-version> " " 1*<user-mode> " " 1*<channel-mode>
`, IrcRules);

var input = 'harshsust irc.burninggarden.com pirc-0.0.5 iosw biklmnpst';

var match = parser.parse(input);

console.log(match.getRawResult());
