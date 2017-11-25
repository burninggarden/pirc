
var
	extend          = req('/lib/utility/extend'),
	Message_Command = req('/lib/message/command'),
	Enum_Commands   = req('/lib/enum/commands');


class Message_Command_Restart extends Message_Command {

	/**
	 * @returns {boolean}
	 */
	hasParameters() {
		return false;
	}

}

extend(Message_Command_Restart.prototype, {
	command: Enum_Commands.RESTART
});

module.exports = Message_Command_Restart;
