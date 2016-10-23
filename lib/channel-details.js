

var
	ChannelNameValidator = req('/validators/channel-name'),
	extend               = req('/utilities/extend');

class ChannelDetails {

	setName(name) {
		ChannelNameValidator.validate(name);
		this.name = name;
		return this;
	}

	getName() {
		ChannelNameValidator.validate(this.name);
		return this.name;
	}

	getTargetString() {
		return this.getName();
	}

	isPublic() {
		return this.is_public;
	}

	setIsPublic(is_public) {
		this.is_public = is_public;
		return this;
	}

	isSecret() {
		return this.is_secret;
	}

	setIsSecret(is_secret) {
		this.is_secret = is_secret;
		return this;
	}

	/**
	 * I'd love to find the documentation in the RFC for this stuff.
	 * I had to just copy the logic from ircd-seven...
	 *
	 * @returns {string}
	 */
	getPrivacySignifier() {
		if (this.isPublic()) {
			return '=';
		} else if (this.isSecret()) {
			return '@';
		} else {
			return '*';
		}
	}

	applyPrivacySignifier(signifier) {
		switch (signifier) {
			case '=':
				return this.setIsPublic(true);

			case '@':
				return this.setIsSecret(true);

			default:
				// Noop.
				return;
		}
	}

}

ChannelDetails.fromName = function fromName(channel_name) {
	return (new ChannelDetails()).setName(channel_name);
};

extend(ChannelDetails.prototype, {
	name:      null,
	is_public: true,
	is_secret: false
});

module.exports = ChannelDetails;
