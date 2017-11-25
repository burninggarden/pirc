
var
	extend        = req('/lib/utility/extend'),
	Message_Reply = req('/lib/message/reply'),
	Enum_Replies  = req('/lib/enum/replies');


class Message_Reply_UnknownCommand extends Message_Reply {

	getAttemptedCommand() {
		return this.attempted_command;
	}

	setAttemptedCommand(attempted_command) {
		this.attempted_command = attempted_command;
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
