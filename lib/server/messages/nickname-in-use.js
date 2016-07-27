var req = require('req');

var
	extend         = req('/utilities/extend'),
	ServerMessage  = req('/lib/server/message'),
	NumericReplies = req('/constants/numeric-replies');

class NicknameInUseMessage extends ServerMessage {

}

extend(NicknameInUseMessage.prototype, {

	numeric_reply: NumericReplies.ERR_NICKNAMEINUSE

});

module.exports = NicknameInUseMessage;
