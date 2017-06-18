
var
	extend       = req('/lib/utilities/extend'),
	ReplyMessage = req('/lib/messages/reply'),
	Replies      = req('/lib/constants/replies');

class ISupportMessage extends ReplyMessage {

	setSettingsString(settings_string) {
		this.settings_string = settings_string;
		return this;
	}

	getSettingsString() {
		return this.settings_string;
	}

	getValuesForParameters() {
		return {
			settings_string: this.getSettingsString()
		};
	}

	setValuesFromParameters(parameters) {
		this.setSettingsString(parameters.get('settings_string'));
	}

}

extend(ISupportMessage.prototype, {

	reply:           Replies.RPL_ISUPPORT,
	body:            'are supported by this server',
	settings_string: null

});

module.exports = ISupportMessage;
