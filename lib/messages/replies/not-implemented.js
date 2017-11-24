
var
	extend       = req('/lib/utilities/extend'),
	ReplyMessage = req('/lib/messages/reply'),
	Enum_Replies = req('/lib/enum/replies');


class NotImplementedMessage extends ReplyMessage {

	getValuesForParameters() {
		return {
			text: this.getText()
		};
	}

	setValuesFromParameters(parameters) {
		this.setText(parameters.get('text'));
	}

}

extend(NotImplementedMessage.prototype, {
	reply: Enum_Replies.ERR_NOTIMPLEMENTED,
	abnf:  '":Not yet implemented: " <text>'
});

module.exports = NotImplementedMessage;
