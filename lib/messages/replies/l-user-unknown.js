
var
	extend       = req('/lib/utilities/extend'),
	ReplyMessage = req('/lib/messages/reply'),
	Replies      = req('/lib/constants/replies');

class LUserUnknownMessage extends ReplyMessage {

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

extend(LUserUnknownMessage.prototype, {

	reply:            Replies.RPL_LUSERUNKNOWN,
	abnf:             '<connection-count> " :unknown connection(s)"',
	connection_count: null

});

module.exports = LUserUnknownMessage;
