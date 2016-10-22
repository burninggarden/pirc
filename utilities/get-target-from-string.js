
var
	NickTarget         = req('/lib/targets/nick'),
	UserTarget         = req('/lib/targets/user'),
	ChannelTarget      = req('/lib/targets/channel'),
	ServerTarget       = req('/lib/targets/server'),
	InvalidTargetError = req('/lib/errors/invalid-target'),
	Regexes            = req('/constants/regexes'),
	ErrorReasons       = req('/constants/error-reasons');

function getTargetFromString(target_string) {
	if (Regexes.NICK.test(target_string)) {
		return new NickTarget(target_string);
	}

	if (Regexes.CHANNEL.test(target_string)) {
		return new ChannelTarget(target_string);
	}

	if (Regexes.HOST.test(target_string)) {
		return new ServerTarget(target_string);
	}

	if (Regexes.USER.test(target_string)) {
		return new UserTarget(target_string);
	}

	throw new InvalidTargetError(target_string, ErrorReasons.WRONG_FORMAT);
}

module.exports = getTargetFromString;
