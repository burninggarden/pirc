
/**
 * Enum values representing the parameter types in the ISUPPORT extension to
 * the IRC specification.
 *
 * More details here:
 * https://tools.ietf.org/html/draft-brocklesby-irc-isupport-03
 */

module.exports = {

	ALLOW_FORCED_NICK_CHANGE:   'FNC',
	CASE_MAPPING:               'CASEMAPPING',
	CHARACTER_SET:              'CHARSET',

	MAX_AWAY_MESSAGE_LENGTH:    'AWAYLEN',
	MAX_BANS:                   'MAXBANS',
	MAX_CHANNEL_MODES:          'MODES',
	MAX_CHANNEL_NAME_LENGTH:    'CHANNELLEN',
	MAX_CHANNELS:               'MAXCHANNELS',
	MAX_KICK_MESSAGE_LENGTH:    'KICKLEN',
	MAX_NICK_LENGTH:            'NICKLEN',
	MAX_PARAMETERS:             'MAXPARA',
	MAX_TARGETS:                'MAXTARGETS',
	MAX_TOPIC_LENGTH:           'TOPICLEN',

	STATUS_MESSAGE_PREFIXES:    'STATUSMSG',

	SUPPORTED_CHANNEL_MODES:    'CHANMODES',
	SUPPORTED_CHANNEL_TYPES:    'CHANTYPES',
	SUPPORTED_CHANNEL_PREFIXES: 'PREFIX',

	SUPPORTED_LIST_EXTENSIONS:  'ELIST'

};
