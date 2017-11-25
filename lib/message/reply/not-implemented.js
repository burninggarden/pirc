
var
	extend       = req('/lib/utility/extend'),
	ReplyMessage = req('/lib/message/reply'),
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
