
var
	extend       = req('/lib/utilities/extend'),
	ReplyMessage = req('/lib/messages/reply'),
	Replies      = req('/lib/constants/replies');

class UserHostMessage extends ReplyMessage {

	getValuesForParameters() {
		return {
			userhost_reply: this.getUserHostInfoList()
		};
	}

	setValuesFromParameters(parameters) {
		this.setUserHostInfoList(parameters.getAll('userhost_reply'));
	}

}

extend(UserHostMessage.prototype, {

	reply: Replies.RPL_USERHOST,
	abnf:  '":" [ <userhost-reply> ] *( " " <userhost-reply> )'

});

module.exports = UserHostMessage;
