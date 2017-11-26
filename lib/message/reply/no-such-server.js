
var
	extend        = require('../../utility/extend'),
	Message_Reply = require('../../message/reply'),
	Enum_Replies  = require('../../enum/replies');


class Message_Reply_NoSuchServer extends Message_Reply {

	getHostname() {
		return this.hostname;
	}

	setHostname(hostname) {
		this.hostname = hostname;
		return this;
	}

	getValuesForParameters() {
		return {
			hostname: this.getHostname()
		};
	}

	setValuesFromParameters(parameters) {
		this.setHostname(parameters.get('hostname'));
	}

}

extend(Message_Reply_NoSuchServer.prototype, {
	reply:    Enum_Replies.ERR_NOSUCHSERVER,
	abnf:     '<hostname> " :No such server"',
	hostname: null
});

module.exports = Message_Reply_NoSuchServer;
