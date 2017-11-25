var
	extend       = req('/lib/utility/extend'),
	ReplyMessage = req('/lib/message/reply'),
	Enum_Replies = req('/lib/enum/replies');


class UserModeIsMessage extends ReplyMessage {

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


extend(UserModeIsMessage.prototype, {
	reply:      Enum_Replies.RPL_UMODEIS,
	abnf:       '["+" 1*<mode-char>]',
	user_modes: null
});

module.exports = UserModeIsMessage;
