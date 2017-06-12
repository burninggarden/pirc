
var
	extend        = req('/lib/utilities/extend'),
	ServerMessage = req('/lib/server/message'),
	ReplyNumerics = req('/lib/constants/reply-numerics');

class ServerUserHostMessage extends ServerMessage {

	applyParsedParameters(middle_parameters, trailing_parameter) {
	}

	serializeParameters() {
	}

}

extend(ServerUserHostMessage.prototype, {

	reply_numeric: ReplyNumerics.RPL_USERHOST,
	bnf:           ':*1<reply> *( " " <reply> )'

});

module.exports = ServerUserHostMessage;
