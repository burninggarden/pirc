
/**
 * From RFC2812:
 *
 * ##########################################################################
 *
 * 3.1.7 Quit
 *
 *       Command: QUIT
 *    Parameters: [ <Quit Message> ]
 *
 *    A client session is terminated with a quit message.  The server
 *    acknowledges this by sending an ERROR message to the client.
 *
 *    Numeric Replies:
 *
 *            None.
 *
 *    Example:
 *
 *    QUIT :Gone to have lunch        ; Preferred message format.
 *
 *    :syrk!kalt@millennium.stealth.net QUIT :Gone to have lunch ; User
 *                                    syrk has quit IRC to have lunch.
 *
 *
 * ##########################################################################
 */


var
	extend          = require('../../utility/extend'),
	Message_Command = require('../../message/command'),
	Enum_Commands   = require('../../enum/commands');


class Message_Command_Quit extends Message_Command {

	setText(quit_message) {
		this.text = quit_message;
		return this;
	}

	getText() {
		return this.text;
	}

	getValuesForParameters() {
		return {
			quit_message: this.getText()
		};
	}

	setValuesFromParameters(parameters) {
		this.setText(parameters.get('quit_message'));
	}

	getPossibleReplies() {
		return [ ];
	}

}

extend(Message_Command_Quit.prototype, {
	command: Enum_Commands.QUIT,
	abnf:    '[ ":" <quit-message> ]',
	text:    null
});

module.exports = Message_Command_Quit;
