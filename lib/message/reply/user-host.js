
var
	extend       = req('/lib/utility/extend'),
	ReplyMessage = req('/lib/message/reply'),
	Enum_Replies = req('/lib/enum/replies');

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

	reply: Enum_Replies.RPL_USERHOST,
	abnf:  '":" [ <userhost-reply> ] *( " " <userhost-reply> )'

});

module.exports = UserHostMessage;
