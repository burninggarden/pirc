
var
	extend         = req('/lib/utility/extend'),
	CommandMessage = req('/lib/message/command'),
	Enum_Commands  = req('/lib/enum/commands');


class RestartMessage extends CommandMessage {

	/**
	 * @returns {boolean}
	 */
	hasParameters() {
		return false;
	}

}

extend(RestartMessage.prototype, {
	command: Enum_Commands.RESTART
});

module.exports = RestartMessage;
