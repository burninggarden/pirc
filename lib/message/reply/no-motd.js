
var
	extend        = require('../../utility/extend'),
	Message_Reply = require('../../message/reply'),
	Enum_Replies  = require('../../enum/replies');


class Message_Reply_NoMotd extends Message_Reply {

	getValuesForParameters() {
		return { };
	}

	setValuesFromParameters() {
		// Deliberately a noop.
	}

}

extend(Message_Reply_NoMotd.prototype, {
	reply: Enum_Replies.ERR_NOMOTD,
	abnf:  '":MOTD File is missing"'
});

module.exports = Message_Reply_NoMotd;
