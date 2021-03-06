
var
	extend        = require('../../utility/extend'),
	Message_Reply = require('../../message/reply'),
	Enum_Replies  = require('../../enum/replies');

class Message_Reply_StatsDLine extends Message_Reply {

	getMaxConnectionCount() {
		return this.max_connection_count;
	}

	setMaxConnectionCount(max_connection_count) {
		this.max_connection_count = max_connection_count;
		return this;
	}

	getTotalConnectionCount() {
		return this.total_connection_count;
	}

	setTotalConnectionCount(total_connection_count) {
		this.total_connection_count = total_connection_count;
		return this;
	}

	getMaxClientCount() {
		return this.max_client_count;
	}

	setMaxClientCount(max_client_count) {
		this.max_client_count = max_client_count;
		return this;
	}

	getValuesForParameters() {
		return {
			connection_count: [
				this.getMaxConnectionCount(),
				this.getTotalConnectionCount()
			],
			client_count: this.getMaxClientCount()
		};
	}

	setValuesFromParameters(parameters) {
		this.setMaxConnectionCount(parameters.getNext('connection_count'));
		this.setTotalConnectionCount(parameters.getNext('connection_count'));
		this.setMaxClientCount(parameters.get('client_count'));
	}

}

extend(Message_Reply_StatsDLine.prototype, {

	reply:                  Enum_Replies.RPL_STATSDLINE,
	abnf:                   '":Highest connection count: " <connection-count> " (" <client-count> " clients) (" <connection-count> " connections received)"',
	max_connection_count:   null,
	total_connection_count: null,
	max_client_count:       null

});

module.exports = Message_Reply_StatsDLine;
