
var req = require('req');

var extend = req('/utilities/extend');

var
	NickValidator         = req('/validators/nick'),
	ChannelNameValidator  = req('/validators/channel-name'),
	CommandValidator      = req('/validators/command'),
	ReplyNumericValidator = req('/validators/reply-numeric'),
	BodyValidator         = req('/validators/body'),
	ServerNameValidator   = req('/validators/server-name'),
	UsernameValidator     = req('/validators/username'),
	Delimiters            = req('/constants/delimiters'),
	Target                = req('/lib/target'),
	ErrorReasons          = req('/constants/error-reasons'),
	Regexes               = req('/constants/regexes'),
	getTargetFromString   = req('/utilities/get-target-from-string');

var
	InvalidTargetError = req('/lib/errors/invalid-target');


// IRC messages are restricted to a maximum of 512 characters, including CRLF:
const CHARACTER_LIMIT = 512;

class Message {

	constructor() {
		this.doSanityChecks();
	}

	doSanityChecks() {
		if (this.hasReplyNumeric()) {
			this.validateReplyNumeric(this.reply_numeric);
		} else if (this.hasCommand()) {
			this.validateCommand(this.command);
		} else {
			throw new Error(`
				Message had neither reply numeric nor command
			`);
		}

		this.ensureAbstractMethodsAreImplemented();
	}

	ensureAbstractMethodsAreImplemented() {
		if (this.serializeParams === Message.prototype.serializeParams) {
			throw new Error(`
				Must implement serializeParams() in message subclass
			`);
		}

		if (this.applyParsedParams === Message.prototype.applyParsedParams) {
			throw new Error(`
				Must implement applyParsedParams() in message subclass
			`);
		}
	}

	validateCommand(command) {
		CommandValidator.validate(command);
	}

	validateReplyNumeric(reply_numeric) {
		ReplyNumericValidator.validate(reply_numeric);
	}

	validateBody(body) {
		BodyValidator.validate(body);
	}

	validateNick(nick) {
		NickValidator.validate(nick);
	}

	validateChannelName(channel_name) {
		ChannelNameValidator.validate(channel_name);
	}

	validateServerName(server_name) {
		ServerNameValidator.validate(server_name);
	}

	validateUsername(username) {
		UsernameValidator.validate(username);
	}

	setRawMessage(raw_message) {
		this.raw_message = raw_message;
		return this;
	}

	setReplyNumericResponse(reply_numeric_response) {
		this.validateReplyNumeric(reply_numeric_response);
		this.reply_numeric_response = reply_numeric_response;
		return this;
	}

	setBody(body) {
		this.validateBody(body);
		this.body = body;
		return this;
	}

	getBody() {
		this.validateBody(this.body);
		return this.body;
	}

	getCommand() {
		return this.command;
	}

	getParams() {
	}

	hasReplyNumeric() {
		return this.reply_numeric !== null;
	}

	setReplyNumeric(reply_numeric) {
		this.validateReplyNumeric(reply_numeric);
		this.reply_numeric = reply_numeric;
		return this;
	}

	hasCommand() {
		return this.command !== null;
	}

	getReplyNumeric() {
		return this.reply_numeric;
	}

	setSourceNick(nick) {
		this.validateNick(nick);
		this.source_nick = nick;
		return this;
	}

	getSourceNick() {
		this.validateNick(this.source_nick);
		return this.source_nick;
	}

	getServerName() {
		this.validateServerName(this.server_name);
		return this.server_name;
	}

	setServerName(server_name) {
		this.validateServerName(server_name);
		this.server_name = server_name;
		return this;
	}

	hasChannelName() {
		return this.channel_name !== null;
	}

	getChannelName() {
		return this.channel_name;
	}

	setChannelName(channel_name) {
		this.validateChannelName(channel_name);
		this.channel_name = channel_name;
		return this;
	}

	hasUsername() {
		return this.username !== null;
	}

	getUsername() {
		this.validateUsername(this.username);
		return this.username;
	}

	setUsername(username) {
		this.validateUsername(username);
		this.username = username;
		return this;
	}

	hasHostname() {
		return this.hostname !== null;
	}

	getHostname() {
		this.validateHostname(this.hostname);
		return this.hostname;
	}

	getTargets() {
		if (!this.targets) {
			throw new Error(`
				No targets set
			`);
		}

		return this.targets;
	}

	addTarget(target) {
		if (!(target instanceof Target)) {
			throw new InvalidTargetError(target, ErrorReasons.WRONG_TYPE);
		}

		if (!this.targets) {
			this.targets = [ ];
		}

		this.targets.push(target);
	}

	hasTarget(target) {
		if (!this.targets) {
			return false;
		}

		var index = 0;

		while (index < this.targets.length) {
			let target_to_check = this.targets[index];

			if (target_to_check.matches(target)) {
				return true;
			}
		}

		return false;
	}

	/**
	 * @param   {string[]} target_strings
	 * @returns {self}
	 */
	setTargetStrings(target_strings) {
		target_strings.forEach(this.addTargetFromString, this);
		return this;
	}

	addTargetFromString(target_string) {
		var target = getTargetFromString(target_string);

		this.addTarget(target);

		return this;
	}

	setHostname(hostname) {
		this.validateHostname(hostname);
		this.hostname = hostname;
		return this;
	}

	getAddress() {
		return this.getUsername() + '@' + this.getHostname();
	}

	serialize() {
		var
			prefix  = this.serializePrefix(),
			command = this.serializeCommand(),
			params  = this.serializeParams(),
			crlf    = Delimiters.CRLF;

		// Per the RFC, the command segment should begin with a space.
		if (params[0] !== ' ') {
			params = ' ' + params;
		}

		return `${prefix}${command}${params}${crlf}`;
	}

	/**
	 * Determine whether the extended message prefix should be used.
	 * From RFC1459, section 2.3.1:
	 *
	 *    Use of the extended prefix (['!' <user> ] ['@' <host> ]) must
	 *    not be used in server to server communications and is only
	 *    intended for server to client messages in order to provide
	 *    clients with more useful information about who a message is
	 *    from without the need for additional queries.
	 *
	 * @returns {bool}
	 */
	shouldUseExtendedPrefix() {
		if (this.isToClient() && this.isFromClient()) {
			return true;
		} else {
			return false;
		}
	}

	shouldOmitPrefix() {
		return false;
	}

	isFromServer() {
		return false;
	}

	isToServer() {
		return false;
	}

	isFromClient() {
		return false;
	}

	isToClient() {
		return false;
	}

	serializePrefix() {
		if (this.shouldOmitPrefix()) {
			return '';
		}

		if (this.isFromServer()) {
			return Delimiters.COLON + this.getServerName() + ' ';
		} else if (this.isFromClient()) {
			if (this.shouldUseExtendedPrefix()) {
				return this.serializeExtendedPrefix();
			} else {
				return this.getFromClientNick() + ' ';
			}
		} else {
			throw new Error(`
				Invalid message; was neither from server nor client
			`);
		}
	}

	serializeCommand() {
		if (this.hasCommand()) {
			return this.getCommand();
		} else {
			return this.getReplyNumeric();
		}
	}

	serializeParams() {
		throw new Error(`
			Must implement serializeParams() in message subclass
		`);
	}

	serializeTargets() {
		return this.getTargets().map(function map(target) {
			return target.getTargetString();
		}).join(', ');
	}

	deserialize() {
		var raw_message = this.raw_message;

		if (raw_message[0] === ':') {
			let
				space_index = raw_message.indexOf(' '),
				prefix      = raw_message.slice(0, space_index);

			this.deserializePrefix(prefix);

			raw_message = raw_message.slice(space_index + 1);
		}

		let
			space_index = raw_message.indexOf(' '),
			command     = raw_message.slice(0, space_index);

		this.deserializeCommand(command);

		var raw_params = raw_message.slice(space_index + 1);

		this.deserializeParams(raw_params);

		return this;
	}

	deserializePrefix(prefix) {
		// Ensure that the prefix starts with the colon delimiter,
		// and trim it off before continuing.
		if (prefix[0] !== Delimiters.COLON) {
			throw new Error('Invalid prefix: ' + prefix);
		}

		prefix = prefix.slice(1);

		if (Regexes.USER_IDENTIFIER.test(prefix)) {
			return this.deserializeUserIdentifier(prefix);
		} else if (Regexes.NICK.test(prefix)) {
			return this.setSourceNick(prefix);
		} else {
			return this.setServerName(prefix);
		}
	}

	deserializeCommand(command) {
		if (!isNaN(parseInt(command))) {
			this.setReplyNumeric(command);
		} else if (command !== this.command) {
			throw new Error('die');
		}
	}

	deserializeParams(raw_params) {
		var [middle_params, trailing_param] = this.parseRawParams(raw_params);

		this.applyParsedParams(middle_params, trailing_param);
	}

	parseRawParams(raw_params) {
		var
			colon_index    = raw_params.indexOf(Delimiters.COLON),
			middle_params  = [ ],
			trailing_param = null;

		if (colon_index !== -1) {
			// Add +1 to the offset in order to trim off the colon delimiter:
			trailing_param = raw_params.slice(colon_index + 1);
			raw_params = raw_params.slice(0, colon_index);
		}

		// Trim off any wrapping whitespace:
		raw_params = raw_params.trim();

		var space_index = raw_params.indexOf(Delimiters.SPACE);

		while (space_index !== -1) {
			let middle_param = raw_params.slice(0, space_index);

			middle_params.push(middle_param);

			raw_params = raw_params.slice(space_index + 1);
			space_index = raw_params.indexOf(Delimiters.SPACE);
		}

		if (raw_params.length) {
			middle_params.push(raw_params);
		}

		return [middle_params, trailing_param];
	}

	applyParsedParams(middle_params, trailing_param) {
		throw new Error(`
			Must implement applyParsedParams() in message subclass
		`);
	}

	getCharacterLimit() {
		return CHARACTER_LIMIT;
	}

	isAtCharacterLimit() {
		return this.getCharacterCount() >= this.getCharacterLimit();
	}

	getCharacterCount() {
		return this.serialize().length;
	}

	getRemainingCharacterCount() {
		return this.getCharacterLimit() - this.getCharacterCount();
	}

	hasRemainingCharacterCount() {
		return this.getRemainingCharacterCount() > 0;
	}

	canAccommodateAdditionalCharacters(count) {
		return this.getRemainingCharacterCount() >= count;
	}

	canAddTextToBody(text) {
		return this.canAccommodateAdditionalCharacters(text.length);
	}

	addTextToBody(text) {
		return this.setBody(this.getBody() + text);
	}

	hasBodyText() {
		return this.getBody().length > 0;
	}

}

extend(Message.prototype, {
	raw_message:         null,

	reply_numeric:       null,

	command:             null,

	body:                '',

	targets:             null,

	source_channel_name: null,
	source_server_name:  null,
	source_nick:         null,
	source_username:     null
});

module.exports = Message;
