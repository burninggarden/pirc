var
	escapeCharacters = req('/utilities/escape-characters'),
	CharacterClasses = req('/constants/character-classes');

var
	special_characters = escapeCharacters(CharacterClasses.SPECIAL),
	prefix             = 'A-z' + special_characters,
	suffix             = 'A-z0-9' + special_characters;


var
	NICK_SOURCE            = '[' + prefix + '][' + suffix + ']+',
	USER_IDENTIFIER_SOURCE = '(' + NICK_SOURCE + ')!([^@]+)@(.+)',
	CHANNEL_SOURCE         = '[&#!\\+][^\\s,]+';

const

	NICK_REGEX            = new RegExp('^' + NICK_SOURCE + '$'),
	USER_IDENTIFIER_REGEX = new RegExp('^' + USER_IDENTIFIER_SOURCE + '$'),
	CHANNEL_REGEX         = new RegExp('^' + CHANNEL_SOURCE + '$');


module.exports = {
	NICK:            NICK_REGEX,
	USER_IDENTIFIER: USER_IDENTIFIER_REGEX,
	CHANNEL:         CHANNEL_REGEX
};
