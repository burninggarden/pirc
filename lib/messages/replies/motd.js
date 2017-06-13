
var
	extend        = req('/lib/utilities/extend'),
	ReplyMessage  = req('/lib/messages/reply'),
	ReplyNumerics = req('/lib/constants/reply-numerics');

class MotdMessage extends ReplyMessage {

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

	serializeParameters() {
		return ' ' + this.serializeTargets() + ' :' + this.getBody();
	}

	applyParsedParameters(middle_parameters, trailing_parameter) {
		this.setTargetStrings(middle_parameters);
		this.setBody(trailing_parameter);
	}

}

extend(MotdMessage.prototype, {

	reply_numeric: ReplyNumerics.RPL_MOTD,
	text:          null

});

module.exports = MotdMessage;