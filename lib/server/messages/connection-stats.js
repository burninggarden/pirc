var req = require('req');

var
	extend        = req('/utilities/extend'),
	ServerMessage = req('/lib/server/message'),
	ReplyNumerics = req('/constants/reply-numerics');

class ConnectionStatsMessage extends ServerMessage {

}

extend(ConnectionStatsMessage.prototype, {

	reply_numeric: ReplyNumerics.RPL_STATSCONN

});

module.exports = ConnectionStatsMessage;
