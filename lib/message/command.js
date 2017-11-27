
var
	Message           = require('../message'),
	Enum_Replies      = require('../enum/replies'),
	Validator_Command = require('../validator/command');

var
	has        = require('../utility/has'),
	extend     = require('../utility/extend'),
	deepEquals = require('../utility/deep-equals');


class Message_Command extends Message {

	/**
	 * @returns {Enum_Commands.XXX}
	 */
	getCommand() {
		return this.command;
	}

	/**
	 * @param   {Enum_Commands.XXX} command
	 * @returns {void}
	 */
	validateCommand(command) {
		Validator_Command.validate(command);
	}

	/**
	 * Override this on child classes in order to do more granular checks.
	 *
	 * @param   {Message} message
	 * @returns {void}
	 */
	matchesIncomingMessage(message) {
		if (message.hasReply()) {
			return this.matchesIncomingReplyMessage(message);
		} else {
			return this.matchesIncomingCommandMessage(message);
		}
	}

	matchesIncomingReplyMessage(message) {
		if (!this.hasPossibleReply(message.getReply())) {
			return false;
		}

		var reply = message.getReply();

		switch (reply) {
			case Enum_Replies.ERR_NEEDMOREPARAMS:
				return this.matchesIncomingNeedMoreParamsMessage(message);

			default:
				return this.matchesIncomingReplyMessageParameters(message);
		}
	}

	/**
	 * @param   {Message} message
	 * @returns {boolean}
	 */
	matchesIncomingReplyMessageParameters(message) {
		if (this.getChannelName() !== message.getChannelName()) {
			return false;
		}

		return true;
	}

	matchesIncomingCommandMessage(message) {
		if (message.getCommand() !== this.getCommand()) {
			return false;
		}

		return deepEquals(
			this.getValuesForParameters(),
			message.getValuesForParameters()
		);
	}

	/**
	 * @param   {Message_Reply_NeedMoreParams} message
	 * @returns {boolean}
	 */
	matchesIncomingNeedMoreParamsMessage(message) {
		return message.getAttemptedCommand() === this.getCommand();
	}

	/**
	 * @param   {Enum_Replies.XXX} reply
	 * @returns {boolean}
	 */
	hasPossibleReply(reply) {
		return has(this.getPossibleReplies(), reply);
	}

	/**
	 * @returns {Enum_Replies.XXX[]}
	 */
	getPossibleReplies() {
		return [ ];
	}

}

extend(Message_Command.prototype, {
	command: null
});


module.exports = Message_Command;
