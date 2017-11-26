
var
	Message_Command = require('../../message/command'),
	Enum_Commands   = require('../../enum/commands'),
	MessageBuilder  = require('../../message-builder');

var
	extend        = require('../../utility/extend'),
	isChannelName = require('../../utility/is-channel-name'),
	isNickname    = require('../../utility/is-nickname');


class Message_Command_Private extends Message_Command {

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

extend(Message_Command_Private.prototype, {
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

Message_Command_Private.getMultipleChannelMessages = getMultipleChannelMessages;

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

Message_Command_Private.getMultipleUserMessages = getMultipleUserMessages;



module.exports = Message_Command_Private;
