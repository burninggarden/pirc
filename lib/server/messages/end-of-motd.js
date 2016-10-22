var req = require('req');

var
	extend        = req('/utilities/extend'),
	ServerMessage = req('/lib/server/message'),
	ReplyNumerics = req('/constants/reply-numerics');

class ServerEndOfMotdMessage extends ServerMessage {

}

extend(ServerEndOfMotdMessage.prototype, {

	reply_numeric: ReplyNumerics.RPL_ENDOFMOTD,
	body:          'End of /MOTD command'

});

module.exports = ServerEndOfMotdMessage;
