
var
	extend        = req('/lib/utilities/extend'),
	ServerMessage = req('/lib/server/message'),
	ReplyNumerics = req('/lib/constants/reply-numerics');


class ServerNoSuchServerMessage extends ServerMessage {

	serializeParameters() {
		throw new Error('implement');
	}

	applyParsedParameters(middle_parameters, trailing_parameter) {
		throw new Error('implement');
	}

}

extend(ServerNoSuchServerMessage.prototype, {
	bnf:           '<server name> :No such server',
	reply_numeric: ReplyNumerics.ERR_NOSUCHSERVER
});

module.exports = ServerNoSuchServerMessage;
