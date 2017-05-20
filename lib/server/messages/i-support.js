
var
	extend        = req('/utilities/extend'),
	ServerMessage = req('/lib/server/message'),
	ReplyNumerics = req('/lib/constants/reply-numerics');

class ServerISupportMessage extends ServerMessage {

	setSettingsString(settings_string) {
		this.settings_string = settings_string;
	}

	getSettingsString() {
		return this.settings_string;
	}

	setBody(body) {
		return this.setSettingsString(body);
	}

	serializeParams() {
		var
			targets         = this.serializeTargets(),
			settings_string = this.getSettingsString(),
			body            = this.getBody();

		return `${targets} ${settings_string} :${body}`;
	}

	applyParsedParams(middle_params, trailing_param) {
		this.addTargetFromString(middle_params.shift());
		this.setSettingsString(middle_params.join(''));
		this.setBody(trailing_param);
	}

}

extend(ServerISupportMessage.prototype, {

	reply_numeric:   ReplyNumerics.RPL_ISUPPORT,
	body:            'are supported by this server',
	settings_string: null

});

module.exports = ServerISupportMessage;
