var req = require('req');

var
	extend        = req('/utilities/extend'),
	ServerMessage = req('/lib/server/message'),
	ResponseTypes = req('/constants/response-types');

class NicknameInUseMessage extends ServerMessage {

}

extend(NicknameInUseMessage.prototype, {

	response_type: ResponseTypes.NICKNAMEINUSE

});

module.exports = NicknameInUseMessage;
