var req = require('req');

var
	extend        = req('/utilities/extend'),
	ServerMessage = req('/lib/server/message'),
	ReplyNumerics = req('/constants/reply-numerics'),
	Regexes       = req('/constants/regexes');


class ServerWhoisHostMessage extends ServerMessage {

	serializeParams() {
		var
			targets      = this.serializeTargets(),
			user_details = this.getTargetUserDetails(),
			nick         = user_details.getNick(),
			hostname     = user_details.getHostname();

		return `${targets} ${nick} :is connecting from *@${hostname}`;
	}

	applyParsedParams(middle_params, trailing_param) {
		this.addTargetFromString(middle_params[0]);

		var user_details = this.getTargetUserDetails();

		user_details.setNick(middle_params[1]);

		// This isn't the most documented numeric in the world,
		// so I'm really unsure the extent to which various IRCDs
		// actually adhere to the following structure. It's how Unreal
		// does it, and that's primarily what I'm testing against,
		// but for everything else out there, who knows...

		// If there's not a trailing parameter specified, then
		// we're shit out of luck. Bail out.
		if (!trailing_param) {
			return;
		}

		// Try and suss out the last token in the trailing param,
		// since various IRCDs could ostensibly tweak the leading text.
		var
			parts     = trailing_param.split(' '),
			last_part = parts.pop();

		// Unreal, at least, prefixes the specified hostname with "*@",
		// so we should trim that off before trying to store it on the user.
		if (last_part.indexOf('*@') === 0) {
			last_part = last_part.slice(2);
		}

		// Final check: Only set the hostname if it passes the associated regex:
		if (Regexes.HOST.test(last_part)) {
			user_details.setHostname(last_part);
		}
	}

}

extend(ServerWhoisHostMessage.prototype, {

	reply_numeric: ReplyNumerics.RPL_WHOISHOST

});

module.exports = ServerWhoisHostMessage;
