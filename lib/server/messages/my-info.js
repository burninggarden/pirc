var req = require('req');

var
	extend        = req('/utilities/extend'),
	ServerMessage = req('/lib/server/message'),
	ReplyNumerics = req('/constants/reply-numerics');

class ServerMyInfoMessage extends ServerMessage {

	applyParsedParams(middle_params) {
		var server_details = this.getServerDetails();

		server_details.setName(middle_params[0]);
		server_details.setVersion(middle_params[1]);
		server_details.setUserModesFromString(middle_params[2]);
		server_details.setChannelModesFromString(middle_params[3]);
	}

}

extend(ServerMyInfoMessage.prototype, {

	reply_numeric: ReplyNumerics.RPL_MYINFO

});

module.exports = ServerMyInfoMessage;
