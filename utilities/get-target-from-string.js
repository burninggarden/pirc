
var
	UserDetails        = req('/lib/user-details'),
	ChannelDetails     = req('/lib/channel-details'),
	ServerDetails      = req('/lib/server-details'),
	Regexes            = req('/constants/regexes'),
	ErrorReasons       = req('/constants/error-reasons'),
	InvalidTargetError = req('/lib/errors/invalid-target');

function getTargetFromString(target_string) {
	if (!target_string) {
		throw new InvalidTargetError(target_string, ErrorReasons.OMITTED);
	}

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

	// Some IRCDs (eg, inspircd) use incrementing hex numbers
	// as placeholder nicks for clients who have not yet finished registration.
	// To detect this, we try casting the target string to a number from hex,
	// and checking whether the result is numeric.
	var number = parseInt(target_string, 16);

	if (!isNaN(number)) {
		let user_details = UserDetails.createPreregistrationStub();

		user_details.setPreregistrationId(target_string);

		return user_details;
	}

	throw new InvalidTargetError(target_string, ErrorReasons.WRONG_FORMAT);
}

module.exports = getTargetFromString;
