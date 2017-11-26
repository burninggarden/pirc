var
	extend        = require('../../utility/extend'),
	Message_Reply = require('../../message/reply'),
	Enum_Replies  = require('../../enum/replies');


class Message_Reply_UserModeIs extends Message_Reply {

	getUserModes() {
		return this.user_modes;
	}

	setUserModes(user_modes) {
		this.user_modes = user_modes;
		return this;
	}

	getValuesForParameters() {
		return {
			mode_char: this.getUserModes()
		};
	}

	setValuesFromParameters(parameters) {
		this.setUserModes(parameters.getAll('mode_char'));
	}

}


extend(Message_Reply_UserModeIs.prototype, {
	reply:      Enum_Replies.RPL_UMODEIS,
	abnf:       '["+" 1*<mode-char>]',
	user_modes: null
});

module.exports = Message_Reply_UserModeIs;
