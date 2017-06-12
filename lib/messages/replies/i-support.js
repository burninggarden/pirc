
var
	extend        = req('/lib/utilities/extend'),
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

	serializeParameters() {
		var
			targets         = this.serializeTargets(),
			settings_string = this.getSettingsString(),
			body            = this.getBody();

		return `${targets} ${settings_string} :${body}`;
	}

	applyParsedParameters(middle_parameters, trailing_parameter) {
		this.addTargetFromString(middle_parameters.shift());
		this.setSettingsString(middle_parameters.join(''));
		this.setBody(trailing_parameter);
	}

}

extend(ServerISupportMessage.prototype, {

	reply_numeric:   ReplyNumerics.RPL_ISUPPORT,
	body:            'are supported by this server',
	settings_string: null

});

module.exports = ServerISupportMessage;
