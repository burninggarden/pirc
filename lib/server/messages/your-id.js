var req = require('req');

var
	extend        = req('/utilities/extend'),
	ServerMessage = req('/lib/server/message'),
	ReplyNumerics = req('/constants/reply-numerics');

class ServerYourIdMessage extends ServerMessage {

	serializeParams() {
		console.log(this.raw_message);
		console.log('%%%%%%%%%%%%%%%%%%%%%');
		throw new Error('implement');
	}

	applyParsedParams() {
		console.log(this.raw_message);
		console.log('%%%%%%%%%%%%%%%%%%%%%');
		throw new Error('implement');
	}

}

extend(ServerYourIdMessage.prototype, {

	reply_numeric: ReplyNumerics.RPL_YOURID

});

module.exports = ServerYourIdMessage;
