
var
	extend        = req('/lib/utility/extend'),
	Message_Reply = req('/lib/message/reply'),
	Enum_Replies  = req('/lib/enum/replies');


class Message_Reply_NotImplemented extends Message_Reply {

	getValuesForParameters() {
		return {
			text: this.getText()
		};
	}

	setValuesFromParameters(parameters) {
		this.setText(parameters.get('text'));
	}

}

extend(Message_Reply_NotImplemented.prototype, {
	reply: Enum_Replies.ERR_NOTIMPLEMENTED,
	abnf:  '":Not yet implemented: " <text>'
});

module.exports = Message_Reply_NotImplemented;
