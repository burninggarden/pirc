
var
	extend   = require('../utility/extend'),
	has      = require('../utility/has'),
	isNumber = require('../utility/is-number'),
	isString = require('../utility/is-string');


var
	Enum_ISupportParameters  = require('../enum/i-support-parameters'),
	Enum_ListExtensions      = require('../enum/list-extensions'),
	Enum_ChannelUserModes    = require('../enum/channel-user-modes'),
	Enum_ChannelUserPrefixes = require('../enum/channel-user-prefixes');


class Server_Settings {

	constructor() {
		this.attributes = { };

		this.setDefaultValues();
	}

	setDefaultValues() {
		this.set(Enum_ISupportParameters.CASE_MAPPING, 'rfc1459');
		this.set(Enum_ISupportParameters.CHARACTER_SET, 'ascii');

		this.set(Enum_ISupportParameters.SUPPORTED_LIST_EXTENSIONS, [
			Enum_ListExtensions.MASK_SEARCH,
			Enum_ListExtensions.USER_COUNT_SEARCH
		]);

		this.set(Enum_ISupportParameters.SUPPORTED_CHANNEL_TYPES, ['#']);
		this.set(Enum_ISupportParameters.SUPPORTED_CHANNEL_PREFIXES, {
			[Enum_ChannelUserModes.OPERATOR]:      Enum_ChannelUserPrefixes.OPERATOR,
			[Enum_ChannelUserModes.HALF_OPERATOR]: Enum_ChannelUserPrefixes.HALF_OPERATOR,
			[Enum_ChannelUserModes.VOICED]:        Enum_ChannelUserPrefixes.VOICED
		});

		this.set(Enum_ISupportParameters.STATUS_MESSAGE_PREFIXES, [
			Enum_ChannelUserPrefixes.OPERATOR,
			Enum_ChannelUserPrefixes.HALF_OPERATOR,
			Enum_ChannelUserPrefixes.VOICED
		]);

		this.set(Enum_ISupportParameters.ALLOW_FORCED_NICK_CHANGE, true);

		this.set(Enum_ISupportParameters.MAX_BANS, 60);
		this.set(Enum_ISupportParameters.MAX_CHANNELS, 20);
		this.set(Enum_ISupportParameters.MAX_PARAMETERS, 32);

		this.set(Enum_ISupportParameters.MAX_AWAY_MESSAGE_LENGTH, 200);
		this.set(Enum_ISupportParameters.MAX_KICK_MESSAGE_LENGTH, 255);

		this.set(Enum_ISupportParameters.MAX_TARGETS, 20);
		this.set(Enum_ISupportParameters.MAX_CHANNEL_MODES, 20);
		this.set(Enum_ISupportParameters.MAX_CHANNEL_NAME_LENGTH, 64);

		this.set(Enum_ISupportParameters.MAX_NICK_LENGTH, 32);
		this.set(Enum_ISupportParameters.MAX_TOPIC_LENGTH, 307);
	}

	validateKey(key) {
		if (!has(Enum_ISupportParameters, key)) {
			throw new Error('Invalid ISUPPORT parameter: ' + key);
		}
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
		var key = Enum_ISupportParameters.SUPPORTED_CHANNEL_PREFIXES;

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
		var key = Enum_ISupportParameters.SUPPORTED_CHANNEL_TYPES;

		var value = this.get(key);

		return key + '=' + value.join('');
	}

	serializeSupportedEnum_ListExtensions() {
		var key = Enum_ISupportParameters.SUPPORTED_LIST_EXTENSIONS;

		var value = this.get(key);

		return key + '=' + value.join('');
	}

	serializeStatusMessagePrefixes() {
		var key = Enum_ISupportParameters.STATUS_MESSAGE_PREFIXES;

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
			case Enum_ISupportParameters.SUPPORTED_LIST_EXTENSIONS:
				return this.serializeSupportedEnum_ListExtensions();

			case Enum_ISupportParameters.SUPPORTED_CHANNEL_TYPES:
				return this.serializeSupportedChannelTypes();

			case Enum_ISupportParameters.SUPPORTED_CHANNEL_PREFIXES:
				return this.serializeSupportedChannelPrefixes();

			case Enum_ISupportParameters.STATUS_MESSAGE_PREFIXES:
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

		return results;
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

			if (!has(Enum_ISupportParameters, key)) {
				// TODO: Issue a suitable warning
				return;
			}

			switch (key) {
				// If we expect a numeric value, cast to an int before setting:
				case Enum_ISupportParameters.MAX_BANS:
				case Enum_ISupportParameters.MAX_CHANNELS:
				case Enum_ISupportParameters.MAX_PARAMETERS:
				case Enum_ISupportParameters.MAX_AWAY_MESSAGE_LENGTH:
				case Enum_ISupportParameters.MAX_KICK_MESSAGE_LENGTH:
				case Enum_ISupportParameters.MAX_TARGETS:
				case Enum_ISupportParameters.MAX_CHANNEL_MODES:
				case Enum_ISupportParameters.MAX_CHANNEL_NAME_LENGTH:
				case Enum_ISupportParameters.MAX_NICK_LENGTH:
				case Enum_ISupportParameters.MAX_TOPIC_LENGTH:
					value = parseInt(value);

					return this.set(key, value);

				// For string and boolean values, we can set the value directly:
				case Enum_ISupportParameters.CASE_MAPPING:
				case Enum_ISupportParameters.CHARACTER_SET:
				case Enum_ISupportParameters.ALLOW_FORCED_NICK_CHANGE:
					return this.set(key, value);

				case Enum_ISupportParameters.SUPPORTED_LIST_EXTENSIONS:
					return this.deserializeSupportedEnum_ListExtensions(value);

				case Enum_ISupportParameters.SUPPORTED_CHANNEL_TYPES:
					return this.deserializeSupportedChannelTypes(value);

				case Enum_ISupportParameters.SUPPORTED_CHANNEL_PREFIXES:
					return this.deserializeSupportedChannelPrefixes(value);

				case Enum_ISupportParameters.STATUS_MESSAGE_PREFIXES:
					return this.deserializeStatusMessagePrefixes(value);

				default:
					throw new Error(
						`Unable to deserialize ISUPPORT parameter: ${key}`
					);
			}
		}, this);
	}

}

extend(Server_Settings.prototype, {
	attributes: null
});

module.exports = Server_Settings;
