
var
	extend         = req('/lib/utilities/extend'),
	CommandMessage = req('/lib/messages/command'),
	Enum_Commands  = req('/lib/enum/commands'),
	MessageBuilder = req('/lib/message-builder'),
	isChannelName  = req('/lib/utilities/is-channel-name'),
	isNickname     = req('/lib/utilities/is-nickname');


class PrivateMessage extends CommandMessage {

	hasChannelMessageTargets() {
		return this.getChannelMessageTargets().length > 0;
	}

	getChannelMessageTargets() {
		return this.getTargets().filter(
			this.isChannelMessageTarget,
			this
		);
	}

	isChannelMessageTarget(target) {
		return isChannelName(target);
	}

	hasUserMessageTargets() {
		return this.getUserMessageTargets().length > 0;
	}

	getUserMessageTargets() {
		return this.getTargets().filter(
			this.isUserMessageTarget,
			this
		);
	}

	isUserMessageTarget(target) {
		// TODO: handle user ids as well
		return isNickname(target);
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
	command:      Enum_Commands.PRIVMSG,
	abnf:         '<message-target> *( "," <message-target> ) " :" <message-body>',
	message_body: null
});

function getMultipleChannelMessages(parameters) {
	var constructor = this;

	function createMessage() {
		return (new constructor())
			.setTarget(parameters.channel_name);
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
			.setTarget(parameters.nick);
	}

	return MessageBuilder.buildMultipleMessages(
		parameters.body,
		createMessage
	);
}

PrivateMessage.getMultipleUserMessages = getMultipleUserMessages;



module.exports = PrivateMessage;
