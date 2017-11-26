
var
	extend        = require('../../utility/extend'),
	Message_Reply = require('../../message/reply'),
	Enum_Replies  = require('../../enum/replies');

class Message_Reply_LUserUnknown extends Message_Reply {

	getUnknownConnectionCount() {
		return this.connection_count;
	}

	setUnknownConnectionCount(connection_count) {
		this.connection_count = connection_count;
		return this;
	}

	getValuesForParameters() {
		return {
			connection_count: this.getUnknownConnectionCount()
		};
	}

	setValuesFromParameters(parameters) {
		this.setUnknownConnectionCount(parameters.get('connection_count'));
	}

}

extend(Message_Reply_LUserUnknown.prototype, {

	reply:            Enum_Replies.RPL_LUSERUNKNOWN,
	abnf:             '<connection-count> " :unknown connection(s)"',
	connection_count: null

});

module.exports = Message_Reply_LUserUnknown;
