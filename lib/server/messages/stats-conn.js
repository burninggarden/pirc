var req = require('req');

var
	extend        = req('/utilities/extend'),
	ServerMessage = req('/lib/server/message'),
	ReplyNumerics = req('/constants/reply-numerics');

class StatsConnMessage extends ServerMessage {

	getBody() {
		throw new Error('implement');
	}

	serializeParams() {
		return ' ' + this.serializeTargets() + ' :' + this.getBody();
	}

	applyParsedParams(middle_params, trailing_param) {
		this.setTargetStrings(middle_params);
		this.setBody(trailing_param);
	}

}

extend(StatsConnMessage.prototype, {

	reply_numeric: ReplyNumerics.RPL_STATSCONN

});

module.exports = StatsConnMessage;
