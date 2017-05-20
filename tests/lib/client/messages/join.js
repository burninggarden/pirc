
require('req');

var
	ClientJoinMessage = req('/lib/client/messages/join'),
	Delimiters        = req('/lib/constants/delimiters');


function serialize(test) {
	test.expect(1);

	var message = new ClientJoinMessage();

	message.addChannelName('#ganondorf');
	message.addChannelName('#bowser');
	message.addChannelName('#samus');

	message.setChannelKey('#ganondorf', 'triforce');
	message.setChannelKey('#samus',     'chozo_statue');

	var
		serialized_message = message.serialize(),
		crlf               = Delimiters.CRLF;

	test.equals(
		serialized_message,
		'JOIN #ganondorf,#samus,#bowser triforce,chozo_statue' + crlf
	);

	test.done();
}

function deserialize(test) {
	test.expect(4);

	var message = new ClientJoinMessage();

	message.setRawMessage('JOIN #ganondorf,#samus,#bowser triforce,chozo_statue');
	message.deserialize();

	test.deepEqual(message.getChannelNames(), [
		'#ganondorf',
		'#samus',
		'#bowser'
	]);

	test.equals(message.getKeyForChannelName('#ganondorf'), 'triforce');
	test.equals(message.getKeyForChannelName('#samus'),     'chozo_statue');
	test.equals(message.getKeyForChannelName('#bowser'),    undefined);

	test.done();
}

module.exports = {
	serialize,
	deserialize
};
