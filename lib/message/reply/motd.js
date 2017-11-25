
var
	extend       = req('/lib/utility/extend'),
	ReplyMessage = req('/lib/message/reply'),
	Enum_Replies = req('/lib/enum/replies');

class MotdMessage extends ReplyMessage {

	getText() {
		return this.text;
	}

	setText(text) {
		this.text = text;
		return this;
	}

	getValuesForParameters() {
		return {
			motd_text: this.getText()
		};
	}

	setValuesFromParameters(parameters) {
		this.setText(parameters.get('motd_text'));
	}

}

extend(MotdMessage.prototype, {

	reply: Enum_Replies.RPL_MOTD,
	abnf:  '":- " [ <motd-text> ]',
	text:  null

});

module.exports = MotdMessage;
