var req = require('req');

var
	extend        = req('/utilities/extend'),
	ServerMessage = req('/lib/server/message'),
	ReplyNumerics = req('/constants/reply-numerics');

class NicknameInUseMessage extends ServerMessage {

}

extend(NicknameInUseMessage.prototype, {

	reply_numeric: ReplyNumerics.ERR_NICKNAMEINUSE

});

module.exports = NicknameInUseMessage;
