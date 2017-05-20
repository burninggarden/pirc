
var
	extend = req('/lib/utilities/extend'),
	add    = req('/lib/utilities/add');

var
	CommandValidator      = req('/lib/validators/command'),
	ReplyNumericValidator = req('/lib/validators/reply-numeric'),
	BodyValidator         = req('/lib/validators/body'),
	Delimiters            = req('/lib/constants/delimiters'),
	SourceTypes           = req('/lib/constants/source-types'),
	ErrorReasons          = req('/lib/constants/error-reasons'),
	Regexes               = req('/lib/constants/regexes'),
	getTargetFromString   = req('/lib/utilities/get-target-from-string'),
	UserDetails           = req('/lib/user-details'),
	ServerDetails         = req('/lib/server-details'),
	ChannelDetails        = req('/lib/channel-details'),
	ServiceDetails        = req('/lib/service-details');

var
	InvalidTargetError = req('/lib/errors/invalid-target'),
	InvalidSourceError = req('/lib/errors/invalid-source');


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

	validateSource(source) {
		if (!source) {
			throw new InvalidSourceError(
				source,
				ErrorReasons.OMITTED
			);
		}

		var source_type = source.getSourceType();

		switch (source_type) {
			case SourceTypes.CLIENT:
			case SourceTypes.SERVER:
				return;

			default:
				throw new InvalidSourceError(
					source_type,
					ErrorReasons.UNKNOWN_TYPE
				);
		}
	}

	setRawMessage(raw_message) {
		this.raw_message = raw_message;
		return this;
	}

	getRawMessage() {
		return this.raw_message;
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

	getUserIdentifier() {
		return this.getUserDetails().getIdentifier();
	}

	setUserDetails(user_details) {
		this.user_details = user_details;
		return this;
	}

	getUserDetails() {
		if (this.user_details) {
			return this.user_details;
		}

		if (!this.hasUserTarget()) {
			return null;
		}

		this.user_details = this.getFirstUserTarget();

		return this.user_details;
	}

	getNick() {
		return this.getUserDetails().getNick();
	}

	setLocalServerDetails(server_details) {
		this.local_server_details = server_details;
		return this;
	}

	getLocalServerDetails() {
		return this.local_server_details;
	}

	getLocalServerIdentifier() {
		return this.getLocalServerDetails().getIdentifier();
	}

	setRemoteServerDetails(server_details) {
		this.remote_server_details = server_details;
		return this;
	}

	getRemoteServerDetails() {
		return this.remote_server_details;
	}

	createRemoteServerDetails() {
		this.remote_server_details = new ServerDetails();

		return this.getRemoteServerDetails();
	}

	getOrCreateRemoteServerDetails() {
		return this.getRemoteServerDetails() || this.createRemoteServerDetails();
	}

	getRemoteServerIdentifier() {
		return this.getRemoteServerDetails().getIdentifier();
	}

	setChannelDetails(channel_details) {
		this.channel_details = channel_details;
		return this;
	}

	getChannelDetails() {
		if (!this.channel_details) {
			if (this.hasChannelTarget()) {
				return this.getFirstChannelTarget();
			}

			this.channel_details = new ChannelDetails();
		}

		return this.channel_details;
	}

	getTargets() {
		if (!this.targets) {
			this.targets = [ ];
		}

		return this.targets;
	}

	getTargetStrings() {
		return this.getTargets().map(function map(target) {
			return target.getTargetString();
		});
	}

	setTargets(targets) {
		targets.forEach(function each(target) {
			this.addTargetFromString(target.getTargetString());
		}, this);
	}

	getChannelTargets() {
		return this.getTargets().filter(function filter(target) {
			return target instanceof ChannelDetails;
		});
	}

	getChannelTargetStrings() {
		return this.getChannelTargets().map(function map(target) {
			return target.getTargetString();
		});
	}

	getUserTargets() {
		return this.getTargets().filter(function filter(target) {
			return target instanceof UserDetails;
		});
	}

	getUserTargetStrings() {
		return this.getUserTargets().map(function map(target) {
			return target.getTargetString();
		});
	}

	getServerTargets() {
		return this.getTargets().filter(function filter(target) {
			return target instanceof ServerDetails;
		});
	}

	getServerTargetStrings() {
		return this.getServerTargets().map(function map(target) {
			return target.getTargetString();
		});
	}

	hasChannelTarget() {
		return this.getChannelTargets().length !== 0;
	}

	getFirstTarget() {
		return this.getTargets()[0];
	}

	getFirstChannelTarget() {
		return this.getChannelTargets()[0];
	}

	getFirstUserTarget() {
		return this.getUserTargets()[0];
	}

	hasUserTarget() {
		return this.getUserTargets().length !== 0;
	}

	hasServerTarget() {
		return this.getServerTargets().length !== 0;
	}

	hasAnyTarget() {
		return this.getTargets().length !== 0;
	}

	validateTarget(target) {
		if (
			   !(target instanceof UserDetails)
			&& !(target instanceof ChannelDetails)
			&& !(target instanceof ServerDetails)
			&& !(target instanceof ServiceDetails)
		) {
			throw new InvalidTargetError(target, ErrorReasons.WRONG_TYPE);
		}
	}

	addTarget(target) {
		if (this.hasTarget(target)) {
			return;
		}

		add(target).to(this.getTargets());
	}

	hasTarget(target) {
		this.validateTarget(target);

		if (!this.targets) {
			return false;
		}

		var index = 0;

		while (index < this.targets.length) {
			let target_to_check = this.targets[index];

			if (target_to_check.getTargetString() === target.getTargetString()) {
				return true;
			}

			index++;
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
		return false;
	}

	shouldOmitPrefix() {
		return false;
	}

	isFromServer() {
		return false;
	}

	serializePrefix() {
		if (this.shouldOmitPrefix()) {
			return '';
		}

		if (this.isFromServer()) {
			return Delimiters.COLON + this.getLocalServerIdentifier() + ' ';
		} else {
			return Delimiters.COLON + this.getUserIdentifier() + ' ';
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
		return this.getTargetStrings().join(', ');
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

		let space_index = raw_message.indexOf(' ');

		if (space_index === -1) {
			space_index = raw_message.length;
		}

		let command = raw_message.slice(0, space_index);

		this.deserializeCommand(command);

		var raw_params = raw_message.slice(space_index);

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
		} else if (Regexes.HOST.test(prefix)) {
			return this.deserializeServerIdentifier(prefix);
		} else if (Regexes.NICK.test(prefix)) {
			return this.deserializeNick(prefix);
		} else if (Regexes.USERNAME.test(prefix)) {
			return this.deserializeUsername(prefix);
		} else {
			throw new Error(`
				Invalid prefix: ${prefix}
			`);
		}
	}

	deserializeUserIdentifier(user_identifier) {
		var user_details = UserDetails.fromIdentifier(user_identifier);

		this.setUserDetails(user_details);
	}

	deserializeServerIdentifier(server_identifier) {
		var server_details = ServerDetails.fromIdentifier(server_identifier);

		this.setRemoteServerDetails(server_details);
	}

	deserializeNick(nick) {
		var user_details = UserDetails.fromNick(nick);

		this.setUserDetails(user_details);
	}

	deserializeUsername(username) {
		var user_details = new UserDetails();

		user_details.setUsername(username);

		this.setUserDetails(user_details);
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
			colon_index    = raw_params.indexOf(' ' + Delimiters.COLON),
			middle_params  = [ ],
			trailing_param = null;

		if (colon_index !== -1) {
			// Add +2 to the offset in order to trim off the space + colon:
			trailing_param = raw_params.slice(colon_index + 2);
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
	raw_message:           null,

	reply_numeric:         null,

	command:               null,

	body:                  '',

	targets:               null,

	user_details:          null,

	remote_server_details: null,

	channel_details:       null

});

module.exports = Message;
