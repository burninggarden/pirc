
var
	UserDetails    = req('/lib/user-details'),
	ChannelDetails = req('/lib/channel-details'),
	ServerDetails  = req('/lib/server-details'),
	Regexes        = req('/constants/regexes');

function getTargetFromString(target_string) {
	if (target_string === '*') {
		return UserDetails.createPreregistrationStub();
	}

	if (Regexes.NICK.test(target_string)) {
		return UserDetails.fromNick(target_string);
	}

	if (Regexes.CHANNEL.test(target_string)) {
		return ChannelDetails.fromName(target_string);
	}

	if (Regexes.HOST.test(target_string)) {
		return ServerDetails.fromIdentifier(target_string);
	}

	if (Regexes.USER_IDENTIFIER.test(target_string)) {
		return UserDetails.fromIdentifier(target_string);
	}

	throw new Error('Could not parse target string: ' + target_string);
}

module.exports = getTargetFromString;
