var req = require('req');

var
	extend        = req('/utilities/extend'),
	ServerMessage = req('/lib/server/message'),
	ReplyNumerics = req('/constants/reply-numerics');

class ServerCreatedMessage extends ServerMessage {

}

extend(ServerCreatedMessage.prototype, {

	reply_numeric: ReplyNumerics.RPL_CREATED

});

module.exports = ServerCreatedMessage;
