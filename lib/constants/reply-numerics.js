
var Replies = req('/lib/constants/replies');

module.exports = {

	[Replies.RPL_WELCOME]:          '001',
	[Replies.RPL_YOURHOST]:         '002',
	[Replies.RPL_CREATED]:          '003',
	[Replies.RPL_MYINFO]:           '004',

	// Unfortunately, different IRCD's treat this numeric as different types
	// of messages]:
	[Replies.RPL_BOUNCE]:           '005',
	[Replies.RPL_ISUPPORT]:         '005',

	[Replies.RPL_STATSDLINE]:       '250',

	[Replies.RPL_LUSERCLIENT]:      '251',
	[Replies.RPL_LUSEROP]:          '252',

	[Replies.RPL_LUSERUNKNOWN]:     '253',

	[Replies.RPL_LUSERCHANNELS]:    '254',
	[Replies.RPL_LUSERME]:          '255',

	[Replies.RPL_LOCALUSERS]:       '265',
	[Replies.RPL_GLOBALUSERS]:      '266',

	[Replies.RPL_AWAY]:             '301',
	[Replies.RPL_USERHOST]:         '302',

	[Replies.RPL_WHOISUSER]:        '311',
	[Replies.RPL_WHOISSERVER]:      '312',
	[Replies.RPL_WHOISIDLE]:        '317',
	[Replies.RPL_ENDOFWHOIS]:       '318',
	[Replies.RPL_WHOISCHANNELS]:    '319',

	[Replies.RPL_CHANNEL_URL]:      '328',

	[Replies.RPL_WHOISACCOUNT]:     '330',

	[Replies.RPL_NOTOPIC]:          '331',
	[Replies.RPL_TOPIC]:            '332',
	[Replies.RPL_TOPICWHOTIME]:     '333',

	[Replies.RPL_NAMREPLY]:         '353',

	[Replies.RPL_ENDOFNAMES]:       '366',

	[Replies.RPL_MOTD]:             '372',

	[Replies.RPL_MOTDSTART]:        '375',
	[Replies.RPL_ENDOFMOTD]:        '376',

	[Replies.RPL_WHOISMODES]:       '379',

	[Replies.ERR_NOSUCHNICK]:       '401',
	[Replies.ERR_NOSUCHSERVER]:     '402',
	[Replies.ERR_NOSUCHCHANNEL]:    '403',

	[Replies.ERR_UNKNOWNCOMMAND]:   '421',

	[Replies.ERR_NOMOTD]:           '422',

	[Replies.ERR_NONICKNAMEGIVEN]:  '431',
	[Replies.ERR_ERRONEUSNICKNAME]: '432',
	[Replies.ERR_NICKNAMEINUSE]:    '433',

	[Replies.ERR_NOTONCHANNEL]:     '442',

	[Replies.ERR_NOTIMPLEMENTED]:   '449',

	[Replies.ERR_NOTREGISTERED]:    '451',

	[Replies.ERR_NEEDMOREPARAMS]:   '461',

	[Replies.ERR_ALREADYREGISTRED]: '462',

	[Replies.ERR_PASSWDMISMATCH]:   '464',

	[Replies.ERR_LINKCHANNEL]:      '470',

	[Replies.ERR_CHANNELISFULL]:    '471',

	[Replies.ERR_UNKNOWNMODE]:      '472',

	[Replies.ERR_INVITEONLYCHAN]:   '473',

	// TODO: Cover cases where other IRCD's appropriate this numeric
	// for other purposes:
	[Replies.ERR_NEEDREGGEDNICK]:   '477',

	[Replies.NOCHANMODES]:          '477',

	[Replies.ERR_NOPRIVILEGES]:     '481',

	[Replies.ERR_CHANOPRIVSNEEDED]: '482',

	[Replies.ERR_UMODEUNKNOWNFLAG]: '501',

	[Replies.ERR_USERSDONTMATCH]:   '502',

	[Replies.RPL_WHOISSECURE]:      '671'

};
