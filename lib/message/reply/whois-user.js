
var
	extend        = require('../../utility/extend'),
	Message_Reply = require('../../message/reply'),
	Enum_Replies  = require('../../enum/replies');


class Message_Reply_WhoisUser extends Message_Reply {

	getValuesForParameters() {
		return {
			nickname: this.getNickname(),
			username: this.getUsername(),
			hostname: this.getHostname(),
			realname: this.getRealname()
		};
	}

	setValuesFromParameters(parameters) {
		this.setNickname(parameters.get('nickname'));
		this.setUsername(parameters.get('username'));
		this.setHostname(parameters.get('hostname'));
		this.setRealname(parameters.get('realname'));
	}

}

extend(Message_Reply_WhoisUser.prototype, {

	reply: Enum_Replies.RPL_WHOISUSER,
	abnf:  '<nick> " " <user> " " <host> " * :" <realname>'

});

module.exports = Message_Reply_WhoisUser;
