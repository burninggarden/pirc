var req = require('req');

var
	extend      = req('/utilities/extend'),
	Message     = req('/lib/message'),
	UserDetails = req('/lib/user-details');


class ServerMessage extends Message {

	isFromServer() {
		return true;
	}

	setTargetUserDetails(user_details) {
		this.target_user_details = user_details;
	}

	getTargetUserDetails() {
		if (!this.target_user_details) {
			this.target_user_details = new UserDetails();
		}

		return this.target_user_details;
	}

}

extend(ServerMessage.prototype, {
	prefix:              null,
	target_user_details: null
});

module.exports = ServerMessage;
