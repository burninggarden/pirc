
var
	extend        = require('../../utility/extend'),
	Message_Reply = require('../../message/reply'),
	Enum_Replies  = require('../../enum/replies'),
	sanitize      = require('../../utility/sanitize');


class Message_Reply_UnknownCommand extends Message_Reply {

	getAttemptedCommand() {
		return this.attempted_command;
	}

	setAttemptedCommand(attempted_command) {
		this.attempted_command = sanitize(attempted_command);
		return this;
	}

	getValuesForParameters() {
		return {
			attempted_command: this.getAttemptedCommand()
		};
	}

	setValuesFromParameters(parameters) {
		this.setAttemptedCommand(parameters.get('attempted_command'));
	}

}

extend(Message_Reply_UnknownCommand.prototype, {
	reply:             Enum_Replies.ERR_UNKNOWNCOMMAND,
	abnf:              '<attempted-command> " :Unknown command"',
	attempted_command: null
});

module.exports = Message_Reply_UnknownCommand;
