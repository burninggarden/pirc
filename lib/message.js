
var
	Heket = require('heket');

var
	extend = req('/lib/utilities/extend'),
	add    = req('/lib/utilities/add'),
	has    = req('/lib/utilities/has');

var
	isChannelName = req('/lib/utilities/is-channel-name'),
	isNickname    = req('/lib/utilities/is-nickname');

var
	MessageUnparser = req('/lib/unparsers/message'),
	PrefixUnparser  = req('/lib/unparsers/prefix'),
	IrcRules        = req('/lib/rule-lists/irc'),
	ErrorReasons    = req('/lib/constants/error-reasons'),
	ReplyNumerics   = req('/lib/constants/reply-numerics'),
	UserDetails     = req('/lib/user-details'),
	ChannelDetails  = req('/lib/channel-details'),
	ServerDetails   = req('/lib/server-details');


var
	AbstractMethodNotImplementedError = req('/lib/errors/abstract-method-not-implemented'),
	InvalidCommandError               = req('/lib/errors/invalid-command');


class Message {

	constructor() {
		this.unique_id = Math.random().toString(16).slice(3);

		if (!this.constructor.has_done_sanity_checks) {
			this.doSanityChecks();
			this.constructor.has_done_sanity_checks = true;
		}
	}

	doSanityChecks() {
		if (this.hasReply()) {
			this.validateReply(this.getReply());
		} else if (this.hasCommand()) {
			this.validateCommand(this.getCommand());
		} else {
			throw new Error(`
				Message had neither reply numeric nor command
			`);
		}

		this.ensureAbstractMethodsAreImplemented();

		if (!this.hasABNF()) {
			let leader = this.getLeader();

			throw new Error(`Must specify an ABNF for message: ${leader}`);
		}
	}

	getLeader() {
		if (this.hasReply()) {
			return this.getReply();
		} else if (this.hasCommand()) {
			return this.getCommand();
		}
	}

	ensureAbstractMethodsAreImplemented() {
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

	getParameterParser() {
		if (!this.constructor.parser) {
			this.buildParameterParser();
		}

		return this.constructor.parser;
	}

	buildParameterParser() {
		var abnf = 'parameters = ';

		if (this.hasReply()) {
			abnf += '<target> " " ';
		}

		abnf += this.getABNF();

		this.constructor.parser = Heket.createParser(abnf, IrcRules);
	}

	getParameterUnparser() {
		if (!this.constructor.unparser) {
			this.constructor.unparser = this.getParameterParser().getUnparser();
		}

		return this.constructor.unparser;
	}

	buildParameterUnparser() {
		if (this.constructor.unparser) {
			return;
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
		if (parameter_string === null) {
			parameter_string = '';
		} else {
			parameter_string = parameter_string.slice(1);
		}

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
			parsed_parameters = null;

		try {
			parsed_parameters = parser.parse(parameter_string);
		} catch (error) {
			return this.handleParameterParsingError(error);
		}

		this.setParsedParameters(parsed_parameters);
		this.setValuesFromParameters(parsed_parameters);
	}

	handleParameterParsingError(error) {
		if (error instanceof Heket.MissingRuleValueError) {
			throw new InvalidCommandError(
				this.getCommand(),
				ErrorReasons.NOT_ENOUGH_PARAMETERS
			);
		}

		console.log(error);
		throw new Error('implement');
	}

	setParsedParameters(parsed_parameters) {
		this.parsed_parameters = parsed_parameters;
		return this;
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

	getReply() {
		return this.reply;
	}

	getReplyNumeric() {
		return ReplyNumerics[this.getReply()] || null;
	}

	serialize() {
		return MessageUnparser.unparse(this.getValueForMessageRule.bind(this));
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
				return undefined;
		}
	}

	serializeParameters() {
		var
			values = this.getValuesForParameters(),
			result = null;

		if (this.getCommand() === 'TOPIC') {
			console.log(values);
			console.log('&&&&&&&&&&&&&&&&&&&&&&&&&&&&&');
		}

		if (this.hasReply()) {
			// TODO: Ensure that there's only a single target.
			values.target = this.getSerializedTargets();
		}

		try {
			result = this.getParameterUnparser().unparse(values);
		} catch (error) {
			throw error;
		}

		// According to the spec, the parameter ABNF value should begin with
		// a single space character:
		if (result[0] !== ' ') {
			result = ' ' + result;
		}

		return result;
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

	serializePrefix() {
		if (this.shouldOmitPrefix()) {
			return null;
		}

		return PrefixUnparser.unparse(this.getValuesForPrefix());
	}

	getValuesForPrefix() {
		if (this.hasOriginServer()) {
			return this.getValuesForServerPrefix();
		}

		if (this.hasOriginClient()) {
			return this.getValuesForClientPrefix();
		}

		throw new Error('wat');
	}

	getValuesForServerPrefix() {
		return {
			server_name: this.getOriginServerHostname()
		};
	}

	getValuesForClientPrefix() {
		return {
			user_id: this.getOriginClientUserId()
		};
	}

	serializeCommand() {
		if (this.hasCommand()) {
			return this.getCommand();
		} else {
			return this.getReplyNumeric();
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

	hasABNF() {
		return this.getABNF() !== null;
	}

	getABNF() {
		return this.abnf;
	}

	hasOriginServer() {
		return this.getOriginServerDetails() !== null;
	}

	getOriginServerDetails() {
		return this.origin_server_details;
	}

	setOriginServerDetails(server_details) {
		this.origin_server_details = server_details;
		return this;
	}

	getOriginServerHostname() {
		return this.getOriginServerDetails().getHostname();
	}

	hasOriginClient() {
		return this.getOriginClientUserDetails() !== null;
	}

	getOriginClientUserDetails() {
		return this.origin_client_user_details;
	}

	addTarget(target) {
		add(target).to(this.getTargets());
		return this;
	}

	addTargetFromString(target_string) {
		this.addTarget(this.getTargetFromString(target_string));
	}

	getTargetFromString(target_string) {
		if (isChannelName(target_string)) {
			return ChannelDetails.fromName(target_string);
		}

		if (isNickname(target_string)) {
			return UserDetails.fromNickname(target_string);
		}

		if (target_string === '*') {
			return (new UserDetails()).setIsRegistering(true);
		}

		throw new Error('wat');
	}

	hasTarget(target) {
		return has(this.getTargets(), target);
	}

	getTargets() {
		if (!this.targets) {
			this.targets = [ ];
		}

		return this.targets;
	}

	getSerializedTargets() {
		return this.getTargets().map(this.serializeTarget, this);
	}

	serializeTarget(target) {
		return target.getTargetString();
	}

	setSerializedTargets(serialized_targets) {
		serialized_targets.forEach(this.addTargetFromString, this);
	}

	getFirstUserTarget() {
		return this.getUserTargets()[0];
	}

	getUserTargets() {
		return this.getTargets().filter(this.isUserTarget, this);
	}

	hasUserTarget() {
		return this.getUserTargets().length > 0;
	}

	getChannelTargets() {
		return this.getTargets().filter(this.isChannelTarget, this);
	}

	getChannelNames() {
		return this.getChannelTargets().map(this.getNameForChannelTarget, this);
	}

	getFirstChannelName() {
		return this.getChannelNames()[0];
	}

	getNameForChannelTarget(channel_target) {
		return channel_target.getName();
	}

	setChannelNames(channel_names) {
		channel_names.forEach(this.addChannelTargetByName, this);
	}

	hasChannelTarget() {
		return this.getChannelTargets().length > 0;
	}

	getChannelTargetByName(channel_name) {
		var
			channel_targets = this.getChannelTargets(),
			index           = 0;

		while (index < channel_targets.length) {
			let channel_target = channel_targets[index];

			// TODO: Name standardization!
			if (channel_target.getName() === channel_name) {
				return channel_target;
			}

			index++;
		}

		return null;
	}

	addChannelTargetByName(channel_name) {
		var channel_details = ChannelDetails.fromName(channel_name);

		this.addTarget(channel_details);
	}

	getServerTargets() {
		return this.getTargets().filter(this.isServerTarget, this);
	}

	isUserTarget(target) {
		return target instanceof UserDetails;
	}

	isChannelTarget(target) {
		return target instanceof ChannelDetails;
	}

	isServerTarget(target) {
		return target instanceof ServerDetails;
	}

	setWords() {
		throw new AbstractMethodNotImplementedError('setWords()');
	}

}


extend(Message.prototype, {
	omit_prefix:                false,
	abnf:                       null,

	raw_message:                null,
	reply:                      null,
	command:                    null,
	parameter_string:           null,
	parameter_parser:           null,

	origin_server_details:      null,
	origin_client_user_details: null,

	targets:                    null
});

module.exports = Message;
