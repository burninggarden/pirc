
var
	ClientDetails  = req('/lib/client-details'),
	ChannelDetails = req('/lib/channel-details'),
	ServerDetails  = req('/lib/server-details'),
	Regexes        = req('/constants/regexes');

function getTargetFromString(target_string) {
	if (Regexes.NICK.test(target_string)) {
		return ClientDetails.fromNick(target_string);
	}

	if (Regexes.CHANNEL.test(target_string)) {
		return ChannelDetails.fromName(target_string);
	}

	if (Regexes.HOST.test(target_string)) {
		return ServerDetails.fromHostname(target_string);
	}

	if (Regexes.USER.test(target_string)) {
		return ClientDetails.fromUserIdentifier(target_string);
	}

	throw new Error('Could not parse target string: ' + target_string);
}

module.exports = getTargetFromString;
