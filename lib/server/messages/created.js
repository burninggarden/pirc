
var
	extend        = req('/utilities/extend'),
	ServerMessage = req('/lib/server/message'),
	ReplyNumerics = req('/constants/reply-numerics');

class ServerCreatedMessage extends ServerMessage {

	getBody() {
		var
			server_details    = this.getServerDetails(),
			created_timestamp = server_details.getCreatedTimestamp(),
			date              = new Date(created_timestamp * 1000);

		var formatted_date = date.toLocaleTimeString('en-us', {
			weekday: 'long',
			year:    'numeric',
			month:   'short',
			day:     'numeric',
			hour:    '2-digit',
			minute:  '2-digit'
		});

		return `This server was created ${formatted_date}`;
	}

	serializeParams() {
		return ' ' + this.serializeTargets() + ' :' + this.getBody();
	}

	applyParsedParams(middle_params, trailing_param) {
		this.setTargetStrings(middle_params);
		this.setBody(trailing_param);
	}

}

extend(ServerCreatedMessage.prototype, {

	reply_numeric: ReplyNumerics.RPL_CREATED

});

module.exports = ServerCreatedMessage;
