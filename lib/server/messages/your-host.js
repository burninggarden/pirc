var req = require('req');

var
	extend        = req('/utilities/extend'),
	ServerMessage = req('/lib/server/message'),
	ReplyNumerics = req('/constants/reply-numerics');

class ServerYourHostMessage extends ServerMessage {

}

extend(ServerYourHostMessage.prototype, {

	reply_numeric: ReplyNumerics.RPL_YOURHOST

});

module.exports = ServerYourHostMessage;
