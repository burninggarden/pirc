var req = require('req');

var
	ResponseTypes = req('/constants/response-types');

module.exports = {
	'001': ResponseTypes.WELCOME,
	'002': ResponseTypes.YOURHOST,
	'003': ResponseTypes.CREATED,
	'004': ResponseTypes.MYINFO,
	'005': ResponseTypes.BOUNCE,

	'042': ResponseTypes.YOURID,

	'251': ResponseTypes.LUSERCLIENT,
	'252': ResponseTypes.LUSEROP,

	'254': ResponseTypes.LUSERCHANNELS,
	'255': ResponseTypes.LUSERME,

	'265': ResponseTypes.LOCALUSERS,

	'302': ResponseTypes.USERHOST,

	'372': ResponseTypes.MOTD,

	'375': ResponseTypes.MOTDSTART,
	'376': ResponseTypes.ENDOFMOTD
};
