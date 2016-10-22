var req = require('req');

var
	extend        = req('/utilities/extend'),
	ServerMessage = req('/lib/server/message'),
	ReplyNumerics = req('/constants/reply-numerics');

class ServerMotdMessage extends ServerMessage {

	getBody() {
		return '- ' + this.getText();
	}

	getText() {
		return this.text;
	}

	setText(text) {
		this.text = text;
	}

}

extend(ServerMotdMessage.prototype, {

	reply_numeric: ReplyNumerics.RPL_MOTD,
	text:          null

});

module.exports = ServerMotdMessage;
