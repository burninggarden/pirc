
var
	extend       = req('/lib/utilities/extend'),
	ReplyMessage = req('/lib/messages/reply'),
	Replies      = req('/lib/constants/replies');

class LUserUnknownMessage extends ReplyMessage {

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

	reply: Replies.RPL_LUSERUNKNOWN

});

module.exports = LUserUnknownMessage;
