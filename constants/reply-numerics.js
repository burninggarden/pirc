
module.exports = {

	RPL_WELCOME:          '001',
	RPL_YOURHOST:         '002',
	RPL_CREATED:          '003',
	RPL_MYINFO:           '004',

	// Unfortunately, different IRCD's treat this numeric as different types
	// of messages:
	RPL_BOUNCE:           '005',
	RPL_ISUPPORT:         '005',

	RPL_YOURID:           '042',

	// Note that the assignment of this particular numeric is contested;
	// some IRCD's have it labeled as "RPL_STATSDLINE", whatever that means.
	RPL_STATSCONN:        '250',

	RPL_LUSERCLIENT:      '251',
	RPL_LUSEROP:          '252',

	RPL_LUSERUNKNOWN:     '253',

	RPL_LUSERCHANNELS:    '254',
	RPL_LUSERME:          '255',

	RPL_LOCALUSERS:       '265',
	RPL_GLOBALUSERS:      '266',

	RPL_AWAY:             '301',
	RPL_USERHOST:         '302',

	RPL_WHOISUSER:        '311',
	RPL_WHOISSERVER:      '312',
	RPL_WHOISIDLE:        '317',
	RPL_ENDOFWHOIS:       '318',
	RPL_WHOISCHANNELS:    '319',

	RPL_CHANNEL_URL:      '328',

	RPL_WHOISACCOUNT:     '330',

	RPL_NOTOPIC:          '331',
	RPL_TOPIC:            '332',
	RPL_TOPICWHOTIME:     '333',

	RPL_NAMREPLY:         '353',

	RPL_ENDOFNAMES:       '366',

	RPL_MOTD:             '372',

	RPL_MOTDSTART:        '375',
	RPL_ENDOFMOTD:        '376',

	RPL_WHOISHOST:        '378',
	RPL_WHOISMODES:       '379',

	ERR_NOSUCHNICK:       '401',

	ERR_NOSUCHCHANNEL:    '403',

	ERR_NOMOTD:           '422',

	ERR_NONICKNAMEGIVEN:  '431',
	ERR_ERRONEUSNICKNAME: '432',
	ERR_NICKNAMEINUSE:    '433',

	ERR_NOTONCHANNEL:     '442',

	ERR_NOTREGISTERED:    '451',

	ERR_LINKCHANNEL:      '470',

	ERR_CHANNELISFULL:    '471',

	ERR_UNKNOWNMODE:      '472',

	// TODO: Cover cases where other IRCD's appropriate this numeric
	// for other purposes:
	ERR_NEEDREGGEDNICK:   '477',

	RPL_WHOISSECURE:      '671'

};
