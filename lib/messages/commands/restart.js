
var
	extend         = req('/lib/utilities/extend'),
	CommandMessage = req('/lib/messages/command'),
	Commands       = req('/lib/constants/commands');


class RestartMessage extends CommandMessage {

	/**
	 * @returns {boolean}
	 */
	hasParameters() {
		return false;
	}

}

extend(RestartMessage.prototype, {
	command: Commands.RESTART
});

module.exports = RestartMessage;
