
var
	extend = req('/lib/utilities/extend'),
	add    = req('/lib/utilities/add');

var
	BodyValidator         = req('/lib/validators/body'),
	ReplyNumericValidator = req('/lib/validators/reply-numeric'),
	Delimiters            = req('/lib/constants/delimiters'),
	SourceTypes           = req('/lib/constants/source-types'),
	ErrorReasons          = req('/lib/constants/error-reasons'),
	UserDetails           = req('/lib/user-details'),
	ServerDetails         = req('/lib/server-details'),
	ChannelDetails        = req('/lib/channel-details'),
	ServiceDetails        = req('/lib/service-details'),
	Commands              = req('/lib/constants/commands');

var
	InvalidTargetError                   = req('/lib/errors/invalid-target'),
	InvalidSourceError                   = req('/lib/errors/invalid-source'),
	InvalidCommandError                  = req('/lib/errors/invalid-command'),
	InvalidCapParametersError            = req('/lib/errors/invalid-cap-parameters'),
	InvalidJoinParametersError           = req('/lib/errors/invalid-join-parameters'),
	InvalidModeParametersError           = req('/lib/errors/invalid-mode-parameters'),
	InvalidNickParametersError           = req('/lib/errors/invalid-nick-parameters'),
	InvalidNoticeParametersError         = req('/lib/errors/invalid-notice-parameters'),
	InvalidPartParametersError           = req('/lib/errors/invalid-part-parameters'),
	InvalidPassParametersError           = req('/lib/errors/invalid-pass-parameters'),
	InvalidPingParametersError           = req('/lib/errors/invalid-ping-parameters'),
	InvalidPongParametersError           = req('/lib/errors/invalid-pong-parameters'),
	InvalidPrivateMessageParametersError = req('/lib/errors/invalid-private-message-parameters'),
	InvalidQuitParametersError           = req('/lib/errors/invalid-quit-parameters'),
	InvalidTopicParametersError          = req('/lib/errors/invalid-topic-parameters'),
	InvalidUserParametersError           = req('/lib/errors/invalid-topic-parameters'),
	InvalidWhoParametersError            = req('/lib/errors/invalid-who-parameters'),
	InvalidWhoisParametersError          = req('/lib/errors/invalid-whois-parameters'),
	InvalidWhowasParametersError         = req('/lib/errors/invalid-whowas-parameters'),
	AbstractMethodNotImplementedError    = req('/lib/errors/abstract-method-not-implemented');


// IRC messages are restricted to a maximum of 512 characters, including CRLF:
const CHARACTER_LIMIT = 512;


class Message {

	constructor() {
		this.doSanityChecks();
	}

	doSanityChecks() {
		if (this.bnf === null) {
			// throw new InvalidBnfError(null, ErrorReasons.OMITTED);
		}

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
		if (this.serializeParameters === Message.prototype.serializeParameters) {
			throw new AbstractMethodNotImplementedError(
				'serializeParameters()'
			);
		}

		if (this.applyParsedParameters === Message.prototype.applyParsedParameters) {
			throw new AbstractMethodNotImplementedError(
				'applyParsedParameters()'
			);
		}
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

	getParameters() {
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
			prefix     = this.serializePrefix(),
			command    = this.serializeCommand(),
			parameters = this.serializeParameters(),
			crlf       = Delimiters.CRLF;

		// Per the RFC, the command segment should begin with a space.
		if (parameters[0] !== ' ') {
			parameters = ' ' + parameters;
		}

		return `${prefix}${command}${parameters}${crlf}`;
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
		return this.omit_prefix;
	}

	setOmitPrefix(omit_prefix = true) {
		this.omit_prefix = omit_prefix;
		return this;
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

	serializeParameters() {
		throw new Error(`
			Must implement serializeParameters() in message subclass
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

		var raw_parameters = raw_message.slice(space_index);

		this.deserializeParameters(raw_parameters);

		return this;
	}

	deserializeCommand(command) {
		if (!isNaN(parseInt(command))) {
			this.setReplyNumeric(command);
		} else if (command !== this.command) {
			throw new Error('die');
		}
	}

	validateParameterCount(middle_parameters, trailing_parameter) {
		if (middle_parameters.length < this.getMinimumMiddleParameterCount()) {
			this.throwInvalidParametersError(
				ErrorReasons.NOT_ENOUGH_PARAMETERS
			);
		}

		if (middle_parameters.length > this.getMaximumMiddleParameterCount()) {
			this.throwInvalidParametersError(
				ErrorReasons.TOO_MANY_PARAMETERS
			);
		}

		if (!trailing_parameter && this.expectsTrailingParameter()) {
			this.throwInvalidParametersError(
				ErrorReasons.NOT_ENOUGH_PARAMETERS
			);
		}

		if (trailing_parameter && !this.allowsTrailingParameter()) {
			this.throwInvalidParametersError(
				ErrorReasons.TOO_MANY_PARAMETERS
			);
		}
	}

	throwInvalidParametersError(error_reason) {
		var invalid_parameters_error = this.getInvalidParametersError();

		console.log(invalid_parameters_error);

		throw new invalid_parameters_error(
			this.getRawMessage(),
			error_reason
		);
	}

	getMaximumMiddleParameterCount() {
		if (this.max_middle_parameter_count === null) {
			this.max_middle_parameter_count = this.getMaximumMiddleParameterCountFromBnf();
		}

		return this.max_middle_parameter_count;
	}

	getMinimumMiddleParameterCount() {
		if (this.min_middle_parameter_count === null) {
			this.min_middle_parameter_count = this.getMinimumMiddleParameterCountFromBnf();
		}

		return this.min_middle_parameter_count;
	}

	getMaximumMiddleParameterCountFromBnf() {
		return -1;
	}

	getMinimumMiddleParameterCountFromBnf() {
		return -1;
	}

	expectsTrailingParameter() {
		if (this.expects_trailing_parameter === null) {
			this.expects_trailing_parameter = this.isTrailingParameterExpectedFromBnf();
		}

		return this.expects_trailing_parameter;
	}

	allowsTrailingParameter() {
		if (this.allows_trailing_parameter === null) {
			this.allows_trailing_parameter = this.isTrailingParameterAllowedFromBnf();
		}
	}

	isTrailingParameterExpectedFromBnf() {
		return false;
	}

	isTrailingParameterAllowedFromBnf() {
		return false;
	}

	getInvalidParametersError() {
		if (!this.hasCommand()) {
			throw new Error('implement');
		}

		var command = this.getCommand();

		switch (command) {
			case Commands.CAP:
				return InvalidCapParametersError;

			case Commands.JOIN:
				return InvalidJoinParametersError;

			case Commands.MODE:
				return InvalidModeParametersError;

			case Commands.NICK:
				return InvalidNickParametersError;

			case Commands.NOTICE:
				return InvalidNoticeParametersError;

			case Commands.PART:
				return InvalidPartParametersError;

			case Commands.PASS:
				return InvalidPassParametersError;

			case Commands.PING:
				return InvalidPingParametersError;

			case Commands.PONG:
				return InvalidPongParametersError;

			case Commands.PRIVMSG:
				return InvalidPrivateMessageParametersError;

			case Commands.QUIT:
				return InvalidQuitParametersError;

			case Commands.TOPIC:
				return InvalidTopicParametersError;

			case Commands.USER:
				return InvalidUserParametersError;

			case Commands.WHO:
				return InvalidWhoParametersError;

			case Commands.WHOIS:
				return InvalidWhoisParametersError;

			case Commands.WHOWAS:
				return InvalidWhowasParametersError;

			default:
				throw new InvalidCommandError(
					command,
					ErrorReasons.UNSUPPORTED
				);
		}
	}

	deserializeParameters(raw_parameters) {
		var [middle_parameters, trailing_parameter] = this.parseRawParameters(
			raw_parameters
		);

		this.validateParameterCount(middle_parameters, trailing_parameter);

		this.applyParsedParameters(middle_parameters, trailing_parameter);
	}

	parseRawParameters(raw_parameters) {
		var
			colon_index        = raw_parameters.indexOf(' ' + Delimiters.COLON),
			middle_parameters  = [ ],
			trailing_parameter = null;

		if (colon_index !== -1) {
			// Add +2 to the offset in order to trim off the space + colon:
			trailing_parameter = raw_parameters.slice(colon_index + 2);
			raw_parameters = raw_parameters.slice(0, colon_index);
		}

		// Trim off any wrapping whitespace:
		raw_parameters = raw_parameters.trim();

		var space_index = raw_parameters.indexOf(Delimiters.SPACE);

		while (space_index !== -1) {
			let middle_param = raw_parameters.slice(0, space_index);

			middle_parameters.push(middle_param);

			raw_parameters = raw_parameters.slice(space_index + 1);
			space_index = raw_parameters.indexOf(Delimiters.SPACE);
		}

		if (raw_parameters.length) {
			middle_parameters.push(raw_parameters);
		}

		return [middle_parameters, trailing_parameter];
	}

	applyParsedParameters(middle_parameters, trailing_parameter) {
		throw new Error(`
			Must implement applyParsedParameters() in message subclass
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

	omit_prefix:                false,

	bnf:                        null,
	raw_message:                null,
	reply_numeric:              null,
	command:                    null,
	body:                       '',
	targets:                    null,
	user_details:               null,
	remote_server_details:      null,
	channel_details:            null,

	middle_parameter_count:     null,
	expects_trailing_parameter: null
});

module.exports = Message;
