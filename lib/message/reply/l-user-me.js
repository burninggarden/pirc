
var
	extend       = req('/lib/utility/extend'),
	ReplyMessage = req('/lib/message/reply'),
	Enum_Replies = req('/lib/enum/replies');

class LUserMeMessage extends ReplyMessage {

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

extend(LUserMeMessage.prototype, {

	reply:        Enum_Replies.RPL_LUSERME,
	abnf:         '":I have " <client-count> " clients and " <server-count> " servers"',
	client_count: null,
	server_count: null

});

module.exports = LUserMeMessage;
