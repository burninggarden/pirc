
var
	extend       = req('/lib/utilities/extend'),
	ReplyMessage = req('/lib/messages/reply'),
	Replies      = req('/lib/constants/replies');

class LUserMeMessage extends ReplyMessage {

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

	reply: Replies.RPL_LUSERME,
	abnf:  '":I have " <client-count> " clients and " <server-count> " servers"'

});

module.exports = LUserMeMessage;
