
var
	extend       = req('/lib/utilities/extend'),
	ReplyMessage = req('/lib/messages/reply'),
	Replies      = req('/lib/constants/replies');

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

	reply: Replies.RPL_MOTD,
	abnf:  '":- " [ <motd-text> ]',
	text:  null

});

module.exports = MotdMessage;
