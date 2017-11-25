

var
	extend         = req('/lib/utility/extend'),
	CommandMessage = req('/lib/message/command'),
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
