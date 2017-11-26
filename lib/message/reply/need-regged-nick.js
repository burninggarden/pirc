
var
	extend        = require('../../utility/extend'),
	Message_Reply = require('../../message/reply'),
	Enum_Replies  = require('../../enum/replies');

class Message_Reply_NeedReggedNick extends Message_Reply {

	getValuesForParameters() {
		return {
			channel_name: this.getChannelName()
		};
	}

	setValuesFromParameters(parameters) {
		this.setChannelName(parameters.get('channel_name'));
	}

}

extend(Message_Reply_NeedReggedNick.prototype, {

	reply: Enum_Replies.ERR_NEEDREGGEDNICK,
	abnf:  '<channel-name> " :Cannot join channel (+r)"'

});

module.exports = Message_Reply_NeedReggedNick;
