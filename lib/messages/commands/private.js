
var
	extend         = req('/lib/utilities/extend'),
	CommandMessage = req('/lib/messages/command'),
	Commands       = req('/lib/constants/commands'),
	MessageBuilder = req('/lib/message-builder'),
	ChannelDetails = req('/lib/channel-details'),
	UserDetails    = req('/lib/user-details');


class PrivateMessage extends CommandMessage {

	getMessageBody() {
		return this.message_body;
	}

	setMessageBody(message_body) {
		this.message_body = message_body;
		return this;
	}

	getValuesForParameters() {
		return {
			message_target: this.getTargets(),
			message_body:   this.getMessageBody()
		};
	}

	setValuesFromParameters(parameters) {
		this.setTargets(parameters.getAll('message_target'));
		this.setMessageBody(parameters.getAll('message_body'));
	}

}

extend(PrivateMessage.prototype, {
	command:      Commands.PRIVMSG,
	abnf:         '<message-target> *( "," <message-target> ) " :" <message-body>',
	message_body: null
});

function getMultipleChannelMessages(parameters) {
	var constructor = this;

	function createMessage() {
		var
			message = new constructor(),
			target  = ChannelDetails.fromName(parameters.channel_name);

		message.addTarget(target);

		return message;
	}

	return MessageBuilder.buildMultipleMessages(
		parameters.body,
		createMessage
	);
}

PrivateMessage.getMultipleChannelMessages = getMultipleChannelMessages;

function getMultipleUserMessages(parameters) {
	var constructor = this;

	function createMessage() {
		var
			message = new constructor(),
			target  = UserDetails.fromNick(parameters.nick);

		message.addTarget(target);

		return message;
	}

	return MessageBuilder.buildMultipleMessages(
		parameters.body,
		createMessage
	);
}

PrivateMessage.getMultipleUserMessages = getMultipleUserMessages;



module.exports = PrivateMessage;
