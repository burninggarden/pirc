var
	escapeCharacters = req('/utilities/escape-characters'),
	CharacterClasses = req('/constants/character-classes');

var
	special_characters = escapeCharacters(CharacterClasses.SPECIAL),
	prefix             = 'A-z' + special_characters,
	suffix             = 'A-z0-9' + special_characters;


// These are denoted as "sources" in the sense that they constitute the
// source of other composite regexes, which usually just wrap one of these
// with the ^ and $ delimiter tokens.
var
	NICK_SOURCE = '[' + prefix + '][' + suffix + ']+',
	USER_SOURCE = '[^\\s\\0\\r\\n]+',

	// The first group is for IPv4 addresses and hostmasks;
	// the second group is for IPv6 addresses.
	HOST_SOURCE            = '([A-Za-z0-9][A-Za-z0-9\\-]+\\.[A-Za-z0-9\\-\\.]+)|([:0-9f]+\\.)',
	USER_IDENTIFIER_SOURCE = '(' + NICK_SOURCE + ')!(' + USER_SOURCE + ')@(' + HOST_SOURCE +')',
	CHANNEL_SOURCE         = '[&#!\\+][^\\s,]+';

const
	NICK_REGEX            = new RegExp('^' + NICK_SOURCE + '$'),
	USER_REGEX            = new RegExp('^' + USER_SOURCE + '$'),
	HOST_REGEX            = new RegExp('^' + HOST_SOURCE + '$'),
	USER_IDENTIFIER_REGEX = new RegExp('^' + USER_IDENTIFIER_SOURCE + '$'),
	CHANNEL_REGEX         = new RegExp('^' + CHANNEL_SOURCE + '$');


module.exports = {
	NICK:            NICK_REGEX,
	USER:            USER_REGEX,
	HOST:            HOST_REGEX,
	USER_IDENTIFIER: USER_IDENTIFIER_REGEX,
	CHANNEL:         CHANNEL_REGEX
};
