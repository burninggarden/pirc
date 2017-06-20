var
	isString             = req('/lib/utilities/is-string'),
	InvalidNicknameError = req('/lib/errors/invalid-nickname'),
	ErrorReasons         = req('/lib/constants/error-reasons'),
	isNick               = req('/lib/utilities/is-nick');

const
	MINIMUM_NICK_LENGTH = 1,
	MAXIMUM_NICK_LENGTH = 16;


function validate(nick) {

	if (!nick) {
		throw new InvalidNicknameError(nick, ErrorReasons.OMITTED);
	}

	if (!isString(nick)) {
		throw new InvalidNicknameError(nick, ErrorReasons.WRONG_TYPE);
	}

	if (nick.length < MINIMUM_NICK_LENGTH) {
		throw new InvalidNicknameError(nick, ErrorReasons.UNDER_MINIMUM_LENGTH);
	}

	if (nick.length > MAXIMUM_NICK_LENGTH) {
		throw new InvalidNicknameError(nick, ErrorReasons.OVER_MAXIMUM_LENGTH);
	}

	if (!isNick(nick)) {
		throw new InvalidNicknameError(nick, ErrorReasons.INVALID_CHARACTERS);
	}

}

module.exports = {
	validate
};
