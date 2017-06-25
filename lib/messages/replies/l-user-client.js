
var
	extend       = req('/lib/utilities/extend'),
	ReplyMessage = req('/lib/messages/reply'),
	Replies      = req('/lib/constants/replies');



class LUserClientMessage extends ReplyMessage {

	getUserCount() {
		return this.user_count;
	}

	setUserCount(user_count) {
		this.user_count = user_count;
		return this;
	}

	getServiceCount() {
		return this.service_count;
	}

	setServiceCount(service_count) {
		this.service_count = service_count;
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

	reply:         Replies.RPL_LUSERCLIENT,
	abnf:          '":There are " <user-count> " users and " <service-count> " services on " <server-count> " servers"',

	user_count:    null,
	service_count: null,
	server_count:  null

});

module.exports = LUserClientMessage;
