
var
	extend        = require('../../utility/extend'),
	Message_Reply = require('../../message/reply'),
	Enum_Replies  = require('../../enum/replies');

class Message_Reply_UserHost extends Message_Reply {

	getValuesForParameters() {
		return {
			userhost_reply: this.getUserHostInfoList()
		};
	}

	setValuesFromParameters(parameters) {
		this.setUserHostInfoList(parameters.getAll('userhost_reply'));
	}

}

extend(Message_Reply_UserHost.prototype, {

	reply: Enum_Replies.RPL_USERHOST,
	abnf:  '":" [ <userhost-reply> ] *( " " <userhost-reply> )'

});

module.exports = Message_Reply_UserHost;
