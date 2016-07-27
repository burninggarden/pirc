var req = require('req');

var
	extend           = req('/utilities/extend'),
	Message          = req('/lib/message'),
	getValues        = req('/utilities/get-values'),
	has              = req('/utilities/has'),
	NumericReplies   = req('/constants/numeric-replies'),
	CharacterClasses = req('/constants/character-classes');


const NUMERIC_REPLY_VALUES = getValues(NumericReplies);


class ServerMessage extends Message {

	partIsPrefixed(part) {
		return part[0] === CharacterClasses.MESSAGE_PREFIX;
	}

	partIsCommand(part) {
		return this.command && part === this.command;
	}

	partIsNumericReply(part) {
		return has(NUMERIC_REPLY_VALUES, part);
	}

	setTargetNick(target_nick) {
		this.target_nick = target_nick;
	}

}

extend(ServerMessage.prototype, {
	prefix:      null,
	target_nick: null
});

module.exports = ServerMessage;
