
var
	extend       = req('/lib/utilities/extend'),
	ReplyMessage = req('/lib/messages/reply'),
	Replies      = req('/lib/constants/replies');

class LocalUsersMessage extends ReplyMessage {

	getLocalCurrentUserCount() {
		return this.getLocalServerDetails().getCurrentLocalUserCount();
	}

	getLocalMaxUserCount() {
		return this.getLocalServerDetails().getMaxLocalUserCount();
	}

	setRemoteCurrentUserCount(user_count) {
		this.getRemoteServerDetails().setCurrentLocalUserCount(user_count);
	}

	getRemoteCurrentUserCount() {
		this.getRemoteServerDetails().getCurrentLocalUserCount();
	}

	setRemoteMaxUserCount(user_count) {
		this.getRemoteServerDetails().setMaxLocalUserCount(user_count);
	}

	getRemoteMaxUserCount() {
		return this.getRemoteServerDetails().getMaxLocalUserCount();
	}

	applyParsedParameters(middle_parameters, trailing_parameter) {
		this.setRemoteCurrentUserCount(parseInt(middle_parameters[0]));
		this.setRemoteMaxUserCount(parseInt(middle_parameters[1]));
		this.setBody(trailing_parameter);
	}

	serializeParameters() {
		var
			current_users = this.getLocalCurrentUserCount(),
			max_users     = this.getLocalMaxUserCount(),
			body          = `Current local users ${current_users}, max ${max_users}`;

		return `${current_users} ${max_users} :${body}`;
	}

}

extend(LocalUsersMessage.prototype, {

	reply: Replies.RPL_LOCALUSERS

});

module.exports = LocalUsersMessage;
