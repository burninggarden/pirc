
var
	extend       = req('/lib/utilities/extend'),
	ReplyMessage = req('/lib/messages/reply'),
	Enum_Replies = req('/lib/enum/replies');

class NeedReggedNickMessage extends ReplyMessage {

	getValuesForParameters() {
		return {
			channel_name: this.getChannelName()
		};
	}

	setValuesFromParameters(parameters) {
		this.setChannelName(parameters.get('channel_name'));
	}

}

extend(NeedReggedNickMessage.prototype, {

	reply: Enum_Replies.ERR_NEEDREGGEDNICK,
	abnf:  '<channel-name> " :Cannot join channel (+r)"'

});

module.exports = NeedReggedNickMessage;
