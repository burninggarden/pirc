
var
	Heket = require('heket');

var
	extend = req('/lib/utilities/extend'),
	add    = req('/lib/utilities/add');

var
	BodyValidator         = req('/lib/validators/body'),
	Delimiters            = req('/lib/constants/delimiters'),
	SourceTypes           = req('/lib/constants/source-types'),
	ErrorReasons          = req('/lib/constants/error-reasons'),
	UserDetails           = req('/lib/user-details'),
	ServerDetails         = req('/lib/server-details'),
	ChannelDetails        = req('/lib/channel-details'),
	ServiceDetails        = req('/lib/service-details'),
	Commands              = req('/lib/constants/commands'),
	MessageUnparser       = req('/lib/unparsers/message'),
	CommandParameterRules = req('/lib/rule-lists/command-parameters'),
	ReplyParameterRules   = req('/lib/rule-lists/reply-parameters');


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
		if (!this.constructor.has_done_sanity_checks) {
			this.doSanityChecks();
			this.constructor.has_done_sanity_checks = true;
		}

		this.buildParameterParser();
	}

	doSanityChecks() {
		if (this.hasReply()) {
			this.validateReply(this.reply);
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
		if (this.getValuesForParameters === Message.prototype.getValuesForParameters) {
			throw new AbstractMethodNotImplementedError(
				'getValuesForParameters()'
			);
		}

		if (this.getValuesForParameters === Message.prototype.getValuesForParameters) {
			throw new AbstractMethodNotImplementedError(
				'getValuesForParameters()'
			);
		}

		if (this.setValuesFromParameters === Message.prototype.setValuesFromParameters) {
			throw new AbstractMethodNotImplementedError(
				'setValuesFromParameters()'
			);
		}
	}

	validateReply() {
		throw new AbstractMethodNotImplementedError(
			'validateReply()'
		);
	}

	validateCommand() {
		throw new AbstractMethodNotImplementedError(
			'validateCommand()'
		);
	}

	validateBody(body) {
		BodyValidator.validate(body);
	}

	getParameterParser() {
		return this.constructor.parser;
	}

	buildParameterParser() {
		if (this.constructor.parser) {
			return;
		}

		var rule;

		if (this.hasCommand()) {
			rule = CommandParameterRules.getRule(this.getCommand());
		} else {
			let reply = this.getReply().replace(/_/g, '-');

			rule = ReplyParameterRules.getRule(reply);
		}

		this.constructor.parser = Heket.createParser(rule);
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

	setPrefix(prefix) {
		this.prefix = prefix;
		return this;
	}

	setParameterString(parameter_string) {
		this.parameter_string = parameter_string;
		this.parseParameterString();

		return this;
	}

	getParameterString() {
		return this.parameter_string;
	}

	parseParameterString() {
		var
			parser            = this.getParameterParser(),
			parameter_string  = this.getParameterString(),
			parsed_parameters = parser.parse(parameter_string);

		if (parsed_parameters === null) {
			throw this.determineErrorForUnparseableParameters();
		}

		this.setParsedParameters(parsed_parameters);
	}

	determineErrorForUnparseableParameters() {
		throw new Error('implement!');
	}

	setParsedParameters(parsed_parameters) {
		this.parsed_parameters = parsed_parameters;
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

	getABNF() {
		return this.abnf;
	}

	hasABNF() {
		return this.getABNF() !== null;
	}

	getCommand() {
		return this.command;
	}

	hasCommand() {
		return this.getCommand() !== null;
	}

	hasReply() {
		return this.getReply() !== null;
	}

	setReply(reply) {
		this.validateReply(reply);
		this.reply = reply;
		return this;
	}

	getReply() {
		return this.reply;
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
		throw new Error('die');
	}

	serialize() {
		return MessageUnparser.unparse(this.getValueForMessageRule, this);
	}

	getValueForMessageRule(rule_name) {
		switch (rule_name) {
			case 'prefix':
				return this.serializePrefix();

			case 'command':
				return this.serializeCommand();

			case 'params':
				return this.serializeParameters();

			default:
				return null;
		}
	}

	serializeParameters() {
		var values = this.getValuesForParameters();

		return this.getUnparser().unparse(values);
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
			return this.getReply();
		}
	}

	getValuesForParameters() {
		// TODO: Can we use AbstractMethodNotImplementedError here?
		throw new Error(
			'Must implement getValuesForParameters() in message subclass'
		);
	}

	setValuesFromParameters() {
		// TODO: Can we use AbstractMethodNotImplementedError here?
		throw new Error(
			'Must implement setValuesFromParameters() in message subclass'
		);
	}

	serializeTargets() {
		return this.getTargetStrings().join(', ');
	}

	validateMiddleParameterCount() {
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
		return this.max_middle_parameter_count;
	}

	getMinimumMiddleParameterCount() {
		return this.min_middle_parameter_count;
	}

	expectsTrailingParameter() {
		return this.expects_trailing_parameter;
	}

	allowsTrailingParameter() {
		return this.allows_trailing_parameter;
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
	abnf:                  null,

	omit_prefix:           false,

	raw_message:           null,
	reply:                 null,
	command:               null,
	parameter_string:      null,
	parameter_parser:      null,

	targets:               null,
	user_details:          null,
	remote_server_details: null,
	channel_details:       null
});

module.exports = Message;
