
var
	extend        = req('/lib/utilities/extend'),
	ReplyMessage  = req('/lib/messages/reply'),
	ReplyNumerics = req('/lib/constants/reply-numerics'),
	isHostname    = req('/lib/utilities/is-hostname'),
	isUsername    = req('/lib/utilities/is-username');


class WhoisHostMessage extends ReplyMessage {

	serializeParameters() {
		var
			targets      = this.serializeTargets(),
			user_details = this.getTargetUserDetails(),
			username     = user_details.getUsername(),
			nick         = user_details.getNick(),
			hostname     = user_details.getHostname();

		return `${targets} ${nick} :is connecting from ${username}@${hostname} ${hostname}`;
	}

	applyParsedParameters(middle_parameters, trailing_parameter) {
		this.addTargetFromString(middle_parameters[0]);

		var user_details = this.getTargetUserDetails();

		user_details.setNick(middle_parameters[1]);

		// This isn't the most documented numeric in the world,
		// so I'm really unsure the extent to which various IRCDs
		// actually adhere to the following structure. It's how Unreal
		// does it, and that's primarily what I'm testing against,
		// but for everything else out there, who knows...

		// If there's not a trailing parameter specified, then
		// we're shit out of luck. Bail out.
		if (!trailing_parameter) {
			return;
		}

		var parts = trailing_parameter.split(' ');

		// What is this terrible mess here?
		// Well, various IRCDs format the trailing param for this reply
		// in different ways (surprise).
		//
		// For example, Unreal formats it as follows:
		// ":is connecting from *@foo.bar.com"
		//
		// Whereas InspIRCd formats it as follows:
		// ":is connecting from user@foo.bar.com foo.bar.com"
		//
		// So this iterative construct is an attempt to try and
		// parse both formats in one go. Kind of cludgy, but then again,
		// this is IRC we're talking about...
		while (parts.length) {
			let part = parts.pop();

			if (isHostname(part)) {
				user_details.setHostname(part);
				continue;
			}

			if (part.indexOf('@') !== -1) {
				let subparts = part.split('@');

				if (isUsername(subparts[0])) {
					user_details.setUsername(subparts[0]);
				}

				if (isHostname(subparts[1])) {
					user_details.setHostname(subparts[1]);
				}
			}
		}
	}

}

extend(WhoisHostMessage.prototype, {

	reply_numeric: ReplyNumerics.RPL_WHOISHOST

});

module.exports = WhoisHostMessage;
