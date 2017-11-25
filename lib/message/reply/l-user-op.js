
var
	extend       = req('/lib/utility/extend'),
	ReplyMessage = req('/lib/message/reply'),
	Enum_Replies = req('/lib/enum/replies');

class LUserOpMessage extends ReplyMessage {

	getOperatorCount() {
		return this.operator_count;
	}

	setOperatorCount(operator_count) {
		this.operator_count = operator_count;
		return this;
	}

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

	reply:          Enum_Replies.RPL_LUSEROP,
	abnf:           '<operator-count> " :operator(s) online"',
	operator_count: null

});

module.exports = LUserOpMessage;
