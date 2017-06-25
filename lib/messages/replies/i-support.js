
var
	extend       = req('/lib/utilities/extend'),
	ReplyMessage = req('/lib/messages/reply'),
	Replies      = req('/lib/constants/replies');

class ISupportMessage extends ReplyMessage {

	setSettings(settings) {
		this.settings = settings;
		return this;
	}

	setWords(words) {
		return this.setSettings(words);
	}

	getSettings() {
		return this.settings;
	}

	getValuesForParameters() {
		return {
			i_support_setting: this.getSettings()
		};
	}

	setValuesFromParameters(parameters) {
		this.setSettings(parameters.get('i_support_setting'));
	}

}

extend(ISupportMessage.prototype, {

	reply:    Replies.RPL_ISUPPORT,
	abnf:     '1*(<i-support-setting> " ") ":are supported by this server"',
	settings: null

});

module.exports = ISupportMessage;
