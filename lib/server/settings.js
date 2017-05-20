
var
	extend   = req('/utilities/extend'),
	has      = req('/utilities/has'),
	isNumber = req('/utilities/is-number'),
	isString = req('/utilities/is-string');


var
	ISupportParameters       = req('/lib/constants/i-support-parameters'),
	ListExtensions           = req('/lib/constants/list-extensions'),
	ChannelUserModes         = req('/lib/constants/channel-user-modes'),
	ChannelUserPrefixes      = req('/lib/constants/channel-user-prefixes'),
	InvalidISupportParameter = req('/lib/errors/invalid-i-support-parameter'),
	ErrorReasons             = req('/lib/constants/error-reasons');


class ServerSettings {

	constructor() {
		this.attributes = { };

		this.setDefaultValues();
	}

	setDefaultValues() {
		this.set(ISupportParameters.CASE_MAPPING, 'rfc1459');
		this.set(ISupportParameters.CHARACTER_SET, 'ascii');

		this.set(ISupportParameters.SUPPORTED_LIST_EXTENSIONS, [
			ListExtensions.MASK_SEARCH,
			ListExtensions.USER_COUNT_SEARCH
		]);

		this.set(ISupportParameters.SUPPORTED_CHANNEL_TYPES, ['#']);
		this.set(ISupportParameters.SUPPORTED_CHANNEL_PREFIXES, {
			[ChannelUserModes.OPERATOR]:      ChannelUserPrefixes.OPERATOR,
			[ChannelUserModes.HALF_OPERATOR]: ChannelUserPrefixes.HALF_OPERATOR,
			[ChannelUserModes.VOICED]:        ChannelUserPrefixes.VOICED
		});

		this.set(ISupportParameters.STATUS_MESSAGE_PREFIXES, [
			ChannelUserPrefixes.OPERATOR,
			ChannelUserPrefixes.HALF_OPERATOR,
			ChannelUserPrefixes.VOICED
		]);

		this.set(ISupportParameters.ALLOW_FORCED_NICK_CHANGE, true);

		this.set(ISupportParameters.MAX_BANS, 60);
		this.set(ISupportParameters.MAX_CHANNELS, 20);
		this.set(ISupportParameters.MAX_PARAMETERS, 32);

		this.set(ISupportParameters.MAX_AWAY_MESSAGE_LENGTH, 200);
		this.set(ISupportParameters.MAX_KICK_MESSAGE_LENGTH, 255);

		this.set(ISupportParameters.MAX_TARGETS, 20);
		this.set(ISupportParameters.MAX_CHANNEL_MODES, 20);
		this.set(ISupportParameters.MAX_CHANNEL_NAME_LENGTH, 64);

		this.set(ISupportParameters.MAX_NICK_LENGTH, 32);
		this.set(ISupportParameters.MAX_TOPIC_LENGTH, 307);
	}

	validateKey(key) {
		if (has(ISupportParameters, key)) {
			return;
		}

		var reason;

		if (!key) {
			reason = ErrorReasons.OMITTED;
		} else {
			reason = ErrorReasons.WRONG_TYPE;
		}

		throw new InvalidISupportParameter(key, reason);
	}

	get(key) {
		this.validateKey(key);
		return this.attributes[key];
	}

	set(key, value) {
		this.validateKey(key);
		this.attributes[key] = value;
	}

	serializeSupportedChannelPrefixes() {
		var key = ISupportParameters.SUPPORTED_CHANNEL_PREFIXES;

		var
			value    = this.get(key),
			modes    = [ ],
			prefixes = [ ],
			mode;

		for (mode in value) {
			modes.push(mode);
			prefixes.push(value[mode]);
		}

		var
			serialized_modes    = modes.join(''),
			serialized_prefixes = prefixes.join('');

		return `${key}=(${serialized_modes})${serialized_prefixes}`;
	}

	serializeSupportedChannelTypes() {
		var key = ISupportParameters.SUPPORTED_CHANNEL_TYPES;

		var value = this.get(key);

		return key + '=' + value.join('');
	}

	serializeSupportedListExtensions() {
		var key = ISupportParameters.SUPPORTED_LIST_EXTENSIONS;

		var value = this.get(key);

		return key + '=' + value.join('');
	}

	serializeStatusMessagePrefixes() {
		var key = ISupportParameters.STATUS_MESSAGE_PREFIXES;

		var value = this.get(key);

		return key + '=' + value.join('');
	}

	serializeKey(key) {
		var value = this.get(key);

		if (value === true) {
			return key;
		}

		if (isNumber(value) || isString(value)) {
			return key + '=' + value;
		}

		switch (key) {
			case ISupportParameters.SUPPORTED_LIST_EXTENSIONS:
				return this.serializeSupportedListExtensions();

			case ISupportParameters.SUPPORTED_CHANNEL_TYPES:
				return this.serializeSupportedChannelTypes();

			case ISupportParameters.SUPPORTED_CHANNEL_PREFIXES:
				return this.serializeSupportedChannelPrefixes();

			case ISupportParameters.STATUS_MESSAGE_PREFIXES:
				return this.serializeStatusMessagePrefixes();

			default:
				throw new Error(
					`Unable to serialize ISUPPORT parameter: ${key}`
				);
		}
	}

	serialize() {
		var
			keys    = Object.keys(this.attributes).sort(),
			results = [ ];

		keys.forEach(function each(key) {
			results.push(this.serializeKey(key));
		}, this);

		return results.join(' ');
	}

	deserialize(string) {
		var pairs = string.split(' ');

		pairs.forEach(function each(pair) {
			var
				key,
				value;

			if (pair.indexOf('=') !== -1) {
				let parts = pair.split('=');

				key = parts[0];
				value = parts[1];
			} else {
				// If the value for a particular setting is true,
				// indicating that it is simply enabled, then the setting
				// will be serialized simply as the setting key name.
				key = pair;
				value = true;
			}

			if (!has(ISupportParameters, key)) {
				// TODO: Issue a suitable warning
				return;
			}

			switch (key) {
				// If we expect a numeric value, cast to an int before setting:
				case ISupportParameters.MAX_BANS:
				case ISupportParameters.MAX_CHANNELS:
				case ISupportParameters.MAX_PARAMETERS:
				case ISupportParameters.MAX_AWAY_MESSAGE_LENGTH:
				case ISupportParameters.MAX_KICK_MESSAGE_LENGTH:
				case ISupportParameters.MAX_TARGETS:
				case ISupportParameters.MAX_CHANNEL_MODES:
				case ISupportParameters.MAX_CHANNEL_NAME_LENGTH:
				case ISupportParameters.MAX_NICK_LENGTH:
				case ISupportParameters.MAX_TOPIC_LENGTH:
					value = parseInt(value);

					return this.set(key, value);

				// For string and boolean values, we can set the value directly:
				case ISupportParameters.CASE_MAPPING:
				case ISupportParameters.CHARACTER_SET:
				case ISupportParameters.ALLOW_FORCED_NICK_CHANGE:
					return this.set(key, value);

				case ISupportParameters.SUPPORTED_LIST_EXTENSIONS:
					return this.deserializeSupportedListExtensions(value);

				case ISupportParameters.SUPPORTED_CHANNEL_TYPES:
					return this.deserializeSupportedChannelTypes(value);

				case ISupportParameters.SUPPORTED_CHANNEL_PREFIXES:
					return this.deserializeSupportedChannelPrefixes(value);

				case ISupportParameters.STATUS_MESSAGE_PREFIXES:
					return this.deserializeStatusMessagePrefixes(value);

				default:
					throw new Error(
						`Unable to deserialize ISUPPORT parameter: ${key}`
					);
			}
		}, this);
	}

}

extend(ServerSettings.prototype, {
	attributes: null
});

module.exports = ServerSettings;
