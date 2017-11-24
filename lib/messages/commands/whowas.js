

var
	extend         = req('/lib/utilities/extend'),
	CommandMessage = req('/lib/messages/command'),
	Enum_Commands  = req('/lib/enum/commands');


class WhowasMessage extends CommandMessage {

	getValuesForParameters() {
		return {
			hostname: this.getHostname(),
			mask:     this.getMasks()
		};
	}

	setValuesFromParameters(parameters) {
		this.setHostname(parameters.get('hostname'));
		this.setMasks(parameters.getAll('mask'));
	}

}

extend(WhowasMessage.prototype, {
	command: Enum_Commands.WHOWAS,
	abnf:    '[ <hostname> ] <mask> *( "," <mask> )'
});

module.exports = WhowasMessage;
