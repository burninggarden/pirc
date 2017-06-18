
var
	extend       = req('/lib/utilities/extend'),
	ReplyMessage = req('/lib/messages/reply'),
	Replies      = req('/lib/constants/replies');



class LUserClientMessage extends ReplyMessage {

	getValuesForParameters() {
		return {
			user_count:    this.getUserCount(),
			service_count: this.getServiceCount(),
			server_count:  this.getServerCount()
		};
	}

	setValuesFromParameters(parameters) {
		this.setUserCount(parameters.get('user_count'));
		this.setServiceCount(parameters.get('service_count'));
		this.setServerCount(parameters.get('server_count'));
	}

}

extend(LUserClientMessage.prototype, {

	reply: Replies.RPL_LUSERCLIENT

});

module.exports = LUserClientMessage;
