
var
	extend        = require('../../utility/extend'),
	Message_Reply = require('../../message/reply'),
	Enum_Replies  = require('../../enum/replies');

class Message_Reply_Motd extends Message_Reply {

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

extend(Message_Reply_Motd.prototype, {

	reply: Enum_Replies.RPL_MOTD,
	abnf:  '":- " [ <motd-text> ]',
	text:  null

});

module.exports = Message_Reply_Motd;
