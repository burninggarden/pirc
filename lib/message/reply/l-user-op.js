
var
	extend        = require('../../utility/extend'),
	Message_Reply = require('../../message/reply'),
	Enum_Replies  = require('../../enum/replies');

class Message_Reply_LUserOp extends Message_Reply {

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

extend(Message_Reply_LUserOp.prototype, {

	reply:          Enum_Replies.RPL_LUSEROP,
	abnf:           '<operator-count> " :operator(s) online"',
	operator_count: null

});

module.exports = Message_Reply_LUserOp;
