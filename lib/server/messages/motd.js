var req = require('req');

var
	extend        = req('/utilities/extend'),
	ServerMessage = req('/lib/server/message'),
	ReplyNumerics = req('/constants/reply-numerics');

class ServerMotdMessage extends ServerMessage {

	getBody() {
		return '- ' + this.getText();
	}

	setBody(body) {
		if (body.indexOf('- ') === 0) {
			body = body.slice(2);
		}

		this.setText(body);
	}

	getText() {
		return this.text;
	}

	setText(text) {
		this.text = text;
	}

	serializeParams() {
		return ' ' + this.serializeTargets() + ' :' + this.getBody();
	}

	applyParsedParams(middle_params, trailing_param) {
		this.setTargetStrings(middle_params);
		this.setBody(trailing_param);
	}

}

extend(ServerMotdMessage.prototype, {

	reply_numeric: ReplyNumerics.RPL_MOTD,
	text:          null

});

module.exports = ServerMotdMessage;
