var req = require('req');

var
	extend        = req('/utilities/extend'),
	add           = req('/utilities/add'),
	remove        = req('/utilities/remove'),
	ServerMessage = req('/lib/server/message'),
	ReplyNumerics = req('/constants/reply-numerics');


class ServerNamesReplyMessage extends ServerMessage {

	constructor() {
		super();
		this.names = [ ];
	}

	getNames() {
		return this.names;
	}

	addName(name) {
		add(name).to(this.names);
		return this;
	}

	removeName(name) {
		remove(name).from(this.names);
		return this;
	}

	getBody() {
		return this.names.join(' ');
	}

	processMessagePartAtIndex(message_part, index) {
		if (index !== 3) {
			throw new Error('Invalid part index: ' + index);
		}

		// TODO
	}

	getMessagePartAtIndex(index) {
		if (index !== 3) {
			throw new Error('Invalid part index: ' + index);
		}

		// TODO
		return '=';
	}

}

extend(ServerNamesReplyMessage.prototype, {

	reply_numeric: ReplyNumerics.RPL_NAMREPLY,

});

module.exports = ServerNamesReplyMessage;
