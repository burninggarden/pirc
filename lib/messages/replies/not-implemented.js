
var
	extend                 = req('/lib/utilities/extend'),
	ReplyMessage           = req('/lib/messages/reply'),
	Replies                = req('/lib/constants/replies'),
	NotYetImplementedError = req('/lib/errors/not-yet-implemented');


class NotImplementedMessage extends ReplyMessage {

	getValuesForParameters() {
		return {
			text: this.getText()
		};
	}

	setValuesFromParameters(parameters) {
		this.setText(parameters.get('text'));
	}

	toError() {
		return new NotYetImplementedError(this.getText());
	}

}

extend(NotImplementedMessage.prototype, {
	reply: Replies.ERR_NOTIMPLEMENTED
});

module.exports = NotImplementedMessage;
