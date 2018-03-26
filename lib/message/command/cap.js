
var
	extend          = require('../../utility/extend'),
	Message_Command = require('../../message/command'),
	Enum_Commands   = require('../../enum/commands');


class Message_Command_Cap extends Message_Command {

	/**
	 * @returns {Enum_CapSubcommands.XXX}
	 */
	getSubcommand() {
		return this.subcommand;
	}

	/**
	 * @param   {Enum_CapSubcommands.XXX} subcommand
	 * @returns {self}
	 */
	setSubcommand(subcommand) {
		this.subcommand = subcommand;
		return this;
	}

	/**
	 * @returns {Enum_Capabilities.XXX[]}
	 */
	getCapabilities() {
		return this.capabilities;
	}

	/**
	 * @param   {Enum_Capabilities.XXX[]}
	 * @returns {self}
	 */
	setCapabilities(capabilities) {
		this.capabilities = capabilities;
		return this;
	}

	/**
	 * @returns {object}
	 */
	getValuesForParameters() {
		return {
			cap_subcommand: this.getSubcommand()
		};
	}

	/**
	 * @param {HeketParameterList} parameters
	 * @returns {void}
	 */
	setValuesFromParameters(parameters) {
		this.setSubcommand(parameters.get('cap_subcommand'));
		this.setCapabilities(parameters.getAll('capability'));
	}

}

extend(Message_Command_Cap.prototype, {
	command: Enum_Commands.CAP,
	abnf:    '<cap-subcommand> [":" 1*(<capability>)]'
});

module.exports = Message_Command_Cap;
