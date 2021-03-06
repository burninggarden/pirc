
var
	extend        = require('../../utility/extend'),
	Message_Reply = require('../../message/reply'),
	Enum_Replies  = require('../../enum/replies');


class Message_Reply_NeedMoreParameters extends Message_Reply {

	setAttemptedCommand(command) {
		this.attempted_command = command;
		return this;
	}

	getAttemptedCommand() {
		return this.attempted_command;
	}

	getValuesForParameters() {
		return {
			command: this.getAttemptedCommand()
		};
	}

	setValuesFromParameters(parameters) {
		this.setAttemptedCommand(parameters.get('command'));
		return this;
	}

}

extend(Message_Reply_NeedMoreParameters.prototype, {

	reply:             Enum_Replies.ERR_NEEDMOREPARAMS,
	abnf:              '<command> " :Not enough parameters"',
	attempted_command: null

});

module.exports = Message_Reply_NeedMoreParameters;
