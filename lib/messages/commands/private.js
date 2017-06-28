
var
	extend         = req('/lib/utilities/extend'),
	CommandMessage = req('/lib/messages/command'),
	Commands       = req('/lib/constants/commands'),
	MessageBuilder = req('/lib/message-builder');


class PrivateMessage extends CommandMessage {

	getMessageTargets() {
		if (!this.message_targets) {
			this.message_targets = [ ];
		}

		return this.message_targets;
	}

	setMessageTargets(message_targets) {
		this.message_targets = message_targets;
		return this;
	}

	setMessageTarget(message_target) {
		return this.setMessageTargets([message_target]);
	}

	getMessageBody() {
		return this.message_body;
	}

	setMessageBody(message_body) {
		this.message_body = message_body;
		return this;
	}

	getValuesForParameters() {
		return {
			message_target: this.getMessageTargets(),
			message_body:   this.getMessageBody()
		};
	}

	setValuesFromParameters(parameters) {
		this.setMessageTargets(parameters.getAll('message_target'));
		this.setMessageBody(parameters.getAll('message_body'));
	}

}

extend(PrivateMessage.prototype, {
	command:         Commands.PRIVMSG,
	abnf:            '<message-target> *( "," <message-target> ) " :" <message-body>',
	message_body:    null,
	message_targets: null
});

function getMultipleChannelMessages(parameters) {
	var constructor = this;

	function createMessage() {
		return (new constructor())
			.setMessageTarget(parameters.channel_name);
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
		return (new constructor())
			.setMessageTarget(parameters.nick);
	}

	return MessageBuilder.buildMultipleMessages(
		parameters.body,
		createMessage
	);
}

PrivateMessage.getMultipleUserMessages = getMultipleUserMessages;



module.exports = PrivateMessage;
