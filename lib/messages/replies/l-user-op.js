
var
	extend       = req('/lib/utilities/extend'),
	ReplyMessage = req('/lib/messages/reply'),
	Replies      = req('/lib/constants/replies');

class LUserOpMessage extends ReplyMessage {

	getValuesForParameters() {
		return {
			operator_count: this.getOperatorCount()
		};
	}

	setValuesFromParameters(parameters) {
		this.setOperatorCount(parameters.get('operator_count'));
	}

}

extend(LUserOpMessage.prototype, {

	reply: Replies.RPL_LUSEROP

});

module.exports = LUserOpMessage;
