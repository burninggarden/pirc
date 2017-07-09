var
	extend       = req('/lib/utilities/extend'),
	ReplyMessage = req('/lib/messages/reply'),
	Replies      = req('/lib/constants/replies');


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
	reply:      Replies.RPL_UMODEIS,
	abnf:       '["+" 1*<mode-char>]',
	user_modes: null
});

module.exports = UserModeIsMessage;
