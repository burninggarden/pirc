var Heket = require('heket');

var parser = Heket.createParser(`
	message = "A" [ "B" ] "C"
`);

var input = 'A';

console.log(parser.rule.node);

var match = parser.parse(input);

console.log(match.getRawResult());
