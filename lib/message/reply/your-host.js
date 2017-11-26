
var
	extend        = require('../../utility/extend'),
	Message_Reply = require('../../message/reply'),
	Enum_Replies  = require('../../enum/replies');

class Message_Reply_YourHost extends Message_Reply {

	getHostname() {
		return this.hostname;
	}

	setHostname(hostname) {
		this.hostname = hostname;
		return this;
	}

	getServerVersion() {
		return this.server_version;
	}

	setServerVersion(server_version) {
		this.server_version = server_version;
		return this;
	}

	getValuesForParameters() {
		return {
			hostname:       this.getHostname(),
			server_version: this.getServerVersion()
		};
	}

	setValuesFromParameters(parameters) {
		this.setHostname(parameters.get('hostname'));
		this.setServerVersion(parameters.get('server_version'));
	}

}

extend(Message_Reply_YourHost.prototype, {

	reply:          Enum_Replies.RPL_YOURHOST,
	abnf:           '"Your host is " <hostname> ", running version " <server-version>',
	hostname:       null,
	server_version: null

});

module.exports = Message_Reply_YourHost;
