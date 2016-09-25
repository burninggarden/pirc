var req = require('req');

var
	extend        = req('/utilities/extend'),
	ServerMessage = req('/lib/server/message'),
	ReplyNumerics = req('/constants/reply-numerics');

class ServerEndOfNamesMessage extends ServerMessage {

}

extend(ServerEndOfNamesMessage.prototype, {

	reply_numeric: ReplyNumerics.RPL_ENDOFNAMES,
	body:          'End of /NAMES list.',

});

module.exports = ServerEndOfNamesMessage;
