

var
	extend         = req('/lib/utilities/extend'),
	CommandMessage = req('/lib/messages/command'),
	Commands       = req('/lib/constants/commands');


class WhowasMessage extends CommandMessage {

	getValuesForParameters() {
		return {
			server_name: this.getServerName(),
			mask:        this.getMasks()
		};
	}

	setValuesFromParameters(parameters) {
		this.setServerName(parameters.get('server_name'));
		this.setMasks(parameters.getAll('mask'));
	}

}

extend(WhowasMessage.prototype, {
	command: Commands.WHOWAS,
	abnf:    '[ <server-name> ] <mask> *( "," <mask> )'
});

module.exports = WhowasMessage;
