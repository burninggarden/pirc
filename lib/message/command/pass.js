
/**
 * From RFC2812:
 *
 * ##########################################################################
 *
 * 3.1.1 Password message
 *
 *       Command: PASS
 *    Parameters: <password>
 *
 *    The PASS command is used to set a 'connection password'.  The
 *    optional password can and MUST be set before any attempt to register
 *    the connection is made.  Currently this requires that user send a
 *    PASS command before sending the NICK/USER combination.
 *
 *    Numeric Replies:
 *
 *            ERR_NEEDMOREPARAMS              ERR_ALREADYREGISTRED
 *
 *    Example:
 *
 *            PASS secretpasswordhere
 *
 * ##########################################################################
 *
 *
 *
 *
 * From RFC2813:
 *
 * ##########################################################################
 *
 * 4.1.1 Password message
 *
 *       Command: PASS
 *    Parameters: <password> <version> <flags> [<options>]
 *
 *    The PASS command is used to set a 'connection password'.  The
 *    password MUST be set before any attempt to register the connection is
 *    made.  Currently this means that servers MUST send a PASS command
 *    before any SERVER command.  Only one (1) PASS command SHALL be
 *    accepted from a connection.
 *
 *    The last three (3) parameters MUST be ignored if received from a
 *    client (e.g. a user or a service).  They are only relevant when
 *    received from a server.
 *
 *    The <version> parameter is a string of at least four (4) characters,
 *    and up to fourteen (14) characters.  The first four (4) characters
 *    MUST be digits and indicate the protocol version known by the server
 *    issuing the message.  The protocol described by this document is
 *    version 2.10 which is encoded as "0210".  The remaining OPTIONAL
 *    characters are implementation dependent and should describe the
 *    software version number.
 *
 *    The <flags> parameter is a string of up to one hundred (100)
 *    characters.  It is composed of two substrings separated by the
 *    character "|" (%x7C).  If present, the first substring MUST be the
 *    name of the implementation.  The reference implementation (See
 *    Section 8, "Current support and availability") uses the string "IRC".
 *    If a different implementation is written, which needs an identifier,
 *    then that identifier should be registered through publication of an
 *    RFC. The second substring is implementation dependent.  Both
 *    substrings are OPTIONAL, but the character "|" is REQUIRED.  The
 *    character "|" MUST NOT appear in either substring.
 *
 *    Finally, the last parameter, <options>, is used for link options.
 *    The only options defined by the protocol are link compression (using
 *    the character "Z"), and an abuse protection flag (using the character
 *
 *    "P").  See sections 5.3.1.1 (Compressed server to server links) and
 *    5.3.1.2 (Anti abuse protections) respectively for more information on
 *    these options.
 *
 *    Numeric Replies:
 *
 *            ERR_NEEDMOREPARAMS              ERR_ALREADYREGISTRED
 *
 *    Example:
 *
 *         PASS moresecretpassword 0210010000 IRC|aBgH$ Z
 *
 * ##########################################################################
 */


var
	Heket = require('heket');

var
	extend          = require('../../utility/extend'),
	Message_Command = require('../command'),
	Enum_Commands   = require('../../enum/commands'),
	Enum_Replies    = require('../../enum/replies');

var
	Message_Reply_NeedMoreParameters = require('../../message/reply/need-more-parameters');


class Message_Command_Pass extends Message_Command {

	setPassword(password) {
		this.password = password;
		return this;
	}

	getPassword() {
		return this.password;
	}

	setProtocolVersion(protocol_version) {
		this.protocol_version = protocol_version;
		return this;
	}

	getProtocolVersion() {
		return this.protocol_version;
	}

	setProtocolFlags(protocol_flags) {
		this.protocol_flags = protocol_flags;
		return this;
	}

	getProtocolFlags() {
		return this.protocol_flags;
	}

	setProtocolOptions(protocol_options) {
		this.protocol_options = protocol_options;
		return this;
	}

	getProtocolOptions() {
		return this.protocol_options;
	}

	getValuesForParameters() {
		return {
			password:         this.getPassword(),
			protocol_version: this.getProtocolVersion(),
			protocol_flags:   this.getProtocolFlags(),
			protocol_options: this.getProtocolOptions()
		};
	}

	setValuesFromParameters(parameters) {
		this.setPassword(parameters.get('password'));
		this.setProtocolVersion(parameters.get('protocol_version'));
		this.setProtocolFlags(parameters.get('protocol_flags'));
		this.setProtocolOptions(parameters.getAll('protocol_option'));
	}

	handleParameterParsingError(error) {
		if (!(error instanceof Heket.MissingRuleValueError)) {
			return super.handleParameterParsingError(error);
		}

		var message = new Message_Reply_NeedMoreParameters();

		message.setAttemptedCommand(Enum_Commands.PASS);
		message.setIsLethal();

		this.setImmediateResponse(message);
	}

	getPossibleReplies() {
		return [
			Enum_Replies.ERR_NEEDMOREPARAMS,
			Enum_Replies.ERR_ALREADYREGISTRED
		];
	}

}

extend(Message_Command_Pass.prototype, {
	command:          Enum_Commands.PASS,
	abnf:             '<password> [" " <protocol-version> [" " <protocol-flags> [" " <protocol-options>]]]',
	protocol_version: null,
	protocol_flags:   null,
	protocol_options: null
});

module.exports = Message_Command_Pass;
