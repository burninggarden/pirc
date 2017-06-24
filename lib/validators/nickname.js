var
	isString             = req('/lib/utilities/is-string'),
	InvalidNicknameError = req('/lib/errors/invalid-nickname'),
	ErrorReasons         = req('/lib/constants/error-reasons'),
	isNickname           = req('/lib/utilities/is-nickname');

const
	MINIMUM_NICK_LENGTH = 1,
	MAXIMUM_NICK_LENGTH = 16;


function validate(nickname) {

	if (!nickname) {
		throw new InvalidNicknameError(nickname, ErrorReasons.OMITTED);
	}

	if (!isString(nickname)) {
		throw new InvalidNicknameError(nickname, ErrorReasons.WRONG_TYPE);
	}

	if (nickname.length < MINIMUM_NICK_LENGTH) {
		throw new InvalidNicknameError(nickname, ErrorReasons.UNDER_MINIMUM_LENGTH);
	}

	if (nickname.length > MAXIMUM_NICK_LENGTH) {
		throw new InvalidNicknameError(nickname, ErrorReasons.OVER_MAXIMUM_LENGTH);
	}

	if (!isNickname(nickname)) {
		throw new InvalidNicknameError(nickname, ErrorReasons.INVALID_CHARACTERS);
	}

}

module.exports = {
	validate
};
