
var
	extend        = req('/lib/utility/extend'),
	Message_Reply = req('/lib/message/reply'),
	Enum_Replies  = req('/lib/enum/replies');

class Message_Reply_LUserMe extends Message_Reply {

	getClientCount() {
		return this.client_count;
	}

	setClientCount(client_count) {
		this.client_count = client_count;
		return this;
	}

	getServerCount() {
		return this.server_count;
	}

	setServerCount(server_count) {
		this.server_count = server_count;
		return this;
	}

	getValuesForParameters() {
		return {
			client_count: this.getClientCount(),
			server_count: this.getServerCount()
		};
	}

	setValuesFromParameters(parameters) {
		this.setClientCount(parameters.get('client_count'));
		this.setServerCount(parameters.get('server_count'));
	}

}

extend(Message_Reply_LUserMe.prototype, {

	reply:        Enum_Replies.RPL_LUSERME,
	abnf:         '":I have " <client-count> " clients and " <server-count> " servers"',
	client_count: null,
	server_count: null

});

module.exports = Message_Reply_LUserMe;
