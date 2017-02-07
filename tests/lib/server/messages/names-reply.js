var
	NamesReplyMessage = req('/lib/server/messages/names-reply'),
	UserDetails       = req('/lib/user-details'),
	Delimiters        = req('/constants/delimiters');

function serialize(test) {
	test.expect(1);

	var message = new NamesReplyMessage();

	message.setChannelName('#ops');

	var target = UserDetails.fromNick('pachet');

	message.addTarget(target);

	message.setServerName('irc.burninggarden.com');
	message.addName('victoire');
	message.addName('cloudbreaker');
	message.addName('petalblood');

	var
		serialized_message = message.serialize(),
		crlf               = Delimiters.CRLF;

	test.equals(
		serialized_message,
		':irc.burninggarden.com 353 pachet = #ops :victoire cloudbreaker petalblood' + crlf
	);
	test.done();
}

function deserialize(test) {
	test.expect(2);

	var message = new NamesReplyMessage();

	message.setRawMessage(':irc.burninggarden.com 353 pachet = #ops :victoire cloudbreaker petalblood');
	message.deserialize();

	test.deepEqual(message.getNames(), [
		'victoire',
		'cloudbreaker',
		'petalblood'
	]);
	test.equals(message.getChannelName(), '#ops');
	test.done();
}

module.exports = {
	serialize,
	deserialize
};
