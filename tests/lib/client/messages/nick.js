
require('req');

var
	ClientNickMessage = req('/lib/client/messages/nick'),
	Delimiters        = req('/lib/constants/delimiters');


function serialize(test) {
	test.expect(1);

	var message = new ClientNickMessage();

	message.setNick('pachet');

	var serialized_message = message.serialize();

	test.equals(serialized_message, 'NICK pachet' + Delimiters.CRLF);
	test.done();
}

function deserialize(test) {
	test.expect(1);

	var message = new ClientNickMessage();

	message.setRawMessage('NICK pachet');
	message.deserialize();

	test.equals(message.getDesiredNick(), 'pachet');
	test.done();
}

module.exports = {
	serialize,
	deserialize
};
