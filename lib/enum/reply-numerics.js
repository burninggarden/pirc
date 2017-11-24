
var Enum_Replies = req('/lib/enum/replies');

module.exports = {

	[Enum_Replies.RPL_WELCOME]:          '001',
	[Enum_Replies.RPL_YOURHOST]:         '002',
	[Enum_Replies.RPL_CREATED]:          '003',
	[Enum_Replies.RPL_MYINFO]:           '004',

	// Unfortunately, different IRCD's treat this numeric as different types
	// of messages]:
	[Enum_Replies.RPL_BOUNCE]:           '005',
	[Enum_Replies.RPL_ISUPPORT]:         '005',

	[Enum_Replies.RPL_UMODEIS]:          '221',

	[Enum_Replies.RPL_STATSDLINE]:       '250',

	[Enum_Replies.RPL_LUSERCLIENT]:      '251',
	[Enum_Replies.RPL_LUSEROP]:          '252',

	[Enum_Replies.RPL_LUSERUNKNOWN]:     '253',

	[Enum_Replies.RPL_LUSERCHANNELS]:    '254',
	[Enum_Replies.RPL_LUSERME]:          '255',

	[Enum_Replies.RPL_LOCALUSERS]:       '265',
	[Enum_Replies.RPL_GLOBALUSERS]:      '266',

	[Enum_Replies.RPL_AWAY]:             '301',
	[Enum_Replies.RPL_USERHOST]:         '302',

	[Enum_Replies.RPL_UNAWAY]:           '305',
	[Enum_Replies.RPL_NOWAWAY]:          '306',

	[Enum_Replies.RPL_WHOISUSER]:        '311',
	[Enum_Replies.RPL_WHOISSERVER]:      '312',
	[Enum_Replies.RPL_WHOISIDLE]:        '317',
	[Enum_Replies.RPL_ENDOFWHOIS]:       '318',
	[Enum_Replies.RPL_WHOISCHANNELS]:    '319',

	[Enum_Replies.RPL_CHANNEL_URL]:      '328',

	[Enum_Replies.RPL_WHOISACCOUNT]:     '330',

	[Enum_Replies.RPL_NOTOPIC]:          '331',
	[Enum_Replies.RPL_TOPIC]:            '332',
	[Enum_Replies.RPL_TOPICWHOTIME]:     '333',

	[Enum_Replies.RPL_NAMREPLY]:         '353',

	[Enum_Replies.RPL_ENDOFNAMES]:       '366',

	[Enum_Replies.RPL_MOTD]:             '372',

	[Enum_Replies.RPL_MOTDSTART]:        '375',
	[Enum_Replies.RPL_ENDOFMOTD]:        '376',

	[Enum_Replies.RPL_YOUREOPER]:        '381',

	[Enum_Replies.RPL_WHOISMODES]:       '379',

	[Enum_Replies.ERR_NOSUCHNICK]:       '401',
	[Enum_Replies.ERR_NOSUCHSERVER]:     '402',
	[Enum_Replies.ERR_NOSUCHCHANNEL]:    '403',

	[Enum_Replies.ERR_UNKNOWNCOMMAND]:   '421',

	[Enum_Replies.ERR_NOMOTD]:           '422',

	[Enum_Replies.ERR_NONICKNAMEGIVEN]:  '431',
	[Enum_Replies.ERR_ERRONEUSNICKNAME]: '432',
	[Enum_Replies.ERR_NICKNAMEINUSE]:    '433',

	[Enum_Replies.ERR_NOTONCHANNEL]:     '442',

	[Enum_Replies.ERR_NOTIMPLEMENTED]:   '449',

	[Enum_Replies.ERR_NOTREGISTERED]:    '451',

	[Enum_Replies.ERR_NEEDMOREPARAMS]:   '461',

	[Enum_Replies.ERR_ALREADYREGISTRED]: '462',

	[Enum_Replies.ERR_PASSWDMISMATCH]:   '464',

	[Enum_Replies.ERR_LINKCHANNEL]:      '470',

	[Enum_Replies.ERR_CHANNELISFULL]:    '471',

	[Enum_Replies.ERR_UNKNOWNMODE]:      '472',

	[Enum_Replies.ERR_INVITEONLYCHAN]:   '473',

	// TODO: Cover cases where other IRCD's appropriate this numeric
	// for other purposes:
	[Enum_Replies.ERR_NEEDREGGEDNICK]:   '477',

	[Enum_Replies.NOCHANMODES]:          '477',

	[Enum_Replies.ERR_NOPRIVILEGES]:     '481',

	[Enum_Replies.ERR_CHANOPRIVSNEEDED]: '482',

	[Enum_Replies.ERR_RESTRICTED]:       '484',

	[Enum_Replies.ERR_UMODEUNKNOWNFLAG]: '501',

	[Enum_Replies.ERR_USERSDONTMATCH]:   '502',

	[Enum_Replies.RPL_WHOISSECURE]:      '671'

};
