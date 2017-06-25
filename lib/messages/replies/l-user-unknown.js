
var
	extend       = req('/lib/utilities/extend'),
	ReplyMessage = req('/lib/messages/reply'),
	Replies      = req('/lib/constants/replies');

class LUserUnknownMessage extends ReplyMessage {

	getUnknownUserCount() {
		return this.user_count;
	}

	setUnknownUserCount(unknown_user_count) {
		this.user_count = unknown_user_count;
		return this;
	}

	getValuesForParameters() {
		return {
			user_count: this.getUnknownUserCount()
		};
	}

	setValuesFromParameters(parameters) {
		this.setUnknownUserCount(parameters.get('user_count'));
	}

}

extend(LUserUnknownMessage.prototype, {

	reply:      Replies.RPL_LUSERUNKNOWN,
	abnf:       '<user-count> " :unknown connection(s)"',
	user_count: null

});

module.exports = LUserUnknownMessage;
