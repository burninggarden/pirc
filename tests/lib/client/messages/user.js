require('req');

var
	ClientUserMessage = req('/lib/client/messages/user'),
	Delimiters        = req('/constants/delimiters');

function serialize(test) {
	test.expect(1);

	var user_message = new ClientUserMessage();

	user_message.setUsername('pachet')
				.setRealname('Pachet')
				.setModes([]);

	var serialized_message = user_message.serialize();

	test.equals(
		serialized_message,
		'USER pachet 0 * :Pachet' + Delimiters.CRLF
	);

	test.done();
}

function deserialize(test) {
	test.expect(3);

	var user_message = new ClientUserMessage();

	user_message.setRawMessage('USER pachet 0 * :Pachet').deserialize();

	test.equals(user_message.getUsername(), 'pachet');
	test.equals(user_message.getRealname(), 'Pachet');
	test.deepEqual(user_message.getModes(), []);

	test.done();
}

module.exports = {
	serialize,
	deserialize
};
