
var
	extend       = req('/lib/utilities/extend'),
	ReplyMessage = req('/lib/messages/reply'),
	Replies      = req('/lib/constants/replies');

class StatsDLineMessage extends ReplyMessage {

	getValuesForParameters() {
		return {
			connection_count: [
				this.getMaxDLineectionCount(),
				this.getTotalDLineectionCount()
			],
			client_count: this.getMaxClientCount()
		};
	}

	setValuesFromParameters(parameters) {
		this.setMaxDLineectionCount(parameters.getNext('connection_count'));
		this.setTotalDLineectionCount(parameters.getNext('connection_count'));
		this.setMaxClientCount(parameters.get('client_count'));
	}

}

extend(StatsDLineMessage.prototype, {

	reply: Replies.RPL_STATSDLINE,
	abnf:  '":Highest connection count: " <connection-count> " (" <client-count> " clients) (" <connection-count> " connections received)"'

});

module.exports = StatsDLineMessage;
