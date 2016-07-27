var req = require('req');

var
	isString         = req('/utilities/is-string'),
	escapeCharacters = req('/utilities/escape-characters'),
	InvalidNickError = req('/lib/errors/invalid-nick'),
	CharacterClasses = req('/constants/character-classes'),
	ErrorReasons     = req('/constants/error-reasons');

var
	special_characters = escapeCharacters(CharacterClasses.SPECIAL),
	prefix             = 'A-z' + special_characters,
	suffix             = 'A-z0-9' + special_characters;


const
	VALID_NICK_REGEX    = new RegExp(`^[${prefix}][${suffix}]+$`),
	MINIMUM_NICK_LENGTH = 2,
	MAXIMUM_NICK_LENGTH = 16;


function validate(nick) {

	if (!nick) {
		throw new InvalidNickError(nick, ErrorReasons.OMITTED);
	}

	if (!isString(nick)) {
		throw new InvalidNickError(nick, ErrorReasons.WRONG_TYPE);
	}

	if (nick.length < MINIMUM_NICK_LENGTH) {
		throw new InvalidNickError(nick, ErrorReasons.UNDER_MINIMUM_LENGTH);
	}

	if (nick.length > MAXIMUM_NICK_LENGTH) {
		throw new InvalidNickError(nick, ErrorReasons.OVER_MAXIMUM_LENGTH);
	}

	if (!VALID_NICK_REGEX.test(nick)) {
		console.log(VALID_NICK_REGEX);
		throw new InvalidNickError(nick, ErrorReasons.INVALID_CHARACTERS);
	}

}

module.exports = {
	validate
};
