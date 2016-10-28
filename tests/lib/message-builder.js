var req = require('req');

var
	ClientPrivateMessage = req('/lib/client/messages/private'),
	MessageBuilder       = req('/lib/message-builder'),
	ClientChannel        = req('/lib/client/channel');

function buildMessagesFromLine(test) {
	test.expect(1);

	function getNewMessage() {
		var message = new ClientPrivateMessage();

		message.getCharacterLimit = function getCharacterLimit() {
			return 107;
		};

		var channel = new ClientChannel('#pikachu');

		message.addTarget(channel.getChannelDetails());

		return message;
	}

	var line_parts = [
		'foo bar baz wat xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
		'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
		'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
		'xxxxxxxxxxxxxxx foo bar baz wat foo bar baz wat foo bar baz',
		' wat foo bar baz wat foo bar baz wat foo bar baz wat foo ba',
		'r baz wat xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
		'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
		'xxxxxxxxxxxxxxxxxxxxxx'
	];

	var line = line_parts.join('');

	var messages = MessageBuilder.buildMessagesFromLine(line, getNewMessage);

	var bodies = messages.map(function map(message) {
		return message.getBody();
	});

	test.deepEqual(bodies, [
		'foo bar baz wat xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
		'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
		'xxxxxxxxxxxxxxxxxx foo bar baz wat foo bar baz wat foo bar baz wat foo bar baz wat foo ',
		'bar baz wat foo bar baz wat foo bar baz wat xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
		'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx'
	]);

	test.done();
}

module.exports = {
	buildMessagesFromLine
};
