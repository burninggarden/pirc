

var
	extend          = req('/lib/utility/extend'),
	Message_Command = req('/lib/message/command'),
	Enum_Commands   = req('/lib/enum/commands');


class Message_Command_Whowas extends Message_Command {

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

extend(Message_Command_Whowas.prototype, {
	command: Enum_Commands.WHOWAS,
	abnf:    '[ <hostname> ] <mask> *( "," <mask> )'
});

module.exports = Message_Command_Whowas;
