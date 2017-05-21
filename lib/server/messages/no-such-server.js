
var
	extend        = req('/lib/utilities/extend'),
	ServerMessage = req('/lib/server/message'),
	ReplyNumerics = req('/lib/constants/reply-numerics');


class ServerNoSuchServerMessage extends ServerMessage {

	serializeParams() {
		throw new Error('implement');
	}

	applyParsedParams(middle_params, trailing_param) {
		throw new Error('implement');
	}

}

extend(ServerNoSuchServerMessage.prototype, {
	bnf:           '<server name> :No such server',
	reply_numeric: ReplyNumerics.ERR_NOSUCHSERVER
});

module.exports = ServerNoSuchServerMessage;
