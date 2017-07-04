
var
	Heket = require('heket');

var
	extend = req('/lib/utilities/extend');

var
	MessageUnparser = req('/lib/unparsers/message'),
	PrefixUnparser  = req('/lib/unparsers/prefix'),
	PrefixParser    = req('/lib/parsers/prefix'),
	IrcRules        = req('/lib/rule-lists/irc'),
	ErrorReasons    = req('/lib/constants/error-reasons'),
	ReplyNumerics   = req('/lib/constants/reply-numerics');


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

		if (this.prefix !== null) {
			this.parsePrefix(prefix);
		}

		return this;
	}

	parsePrefix(prefix) {
		var parsed_prefix = null;

		try {
			parsed_prefix = PrefixParser.parse(prefix);
		} catch (error) {
			// TODO: this
			throw error;
		}

		var
			user_id  = parsed_prefix.get('user_id'),
			hostname = parsed_prefix.get('hostname');

		if (user_id) {
			this.setOriginUserId(user_id);
		} else if (hostname) {
			this.setOriginHostname(hostname);
		} else {
			throw new Error('wat');
		}
	}

	setParameterString(parameter_string) {
		if (parameter_string === null) {
			parameter_string = '';
		} else {
			parameter_string = parameter_string.slice(1);
		}

		this.parameter_string = parameter_string;

		return this;
	}

	getParameterString() {
		return this.parameter_string;
	}

	parseParameters() {
		if (this.hasParsedParameters()) {
			return this;
		}

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

		return this;
	}

	handleParameterParsingError(error) {
		if (error instanceof Heket.MissingRuleValueError) {
			throw new InvalidCommandError(
				this.getCommand(),
				ErrorReasons.NOT_ENOUGH_PARAMETERS
			);
		}

		throw error;
	}

	setParsedParameters(parsed_parameters) {
		this.parsed_parameters = parsed_parameters;
		return this;
	}

	getParsedParameters() {
		return this.parsed_parameters;
	}

	hasParsedParameters() {
		return this.getParsedParameters() !== null;
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

		if (this.hasReply()) {
			// TODO: Ensure that there's only a single target.
			values.target = this.getTarget();
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
		if (this.hasOriginUserId()) {
			return this.getValuesForUserPrefix();
		} else if (this.hasOriginHostname()) {
			return this.getValuesForServerPrefix();
		}

		throw new Error('wat');
	}

	getValuesForServerPrefix() {
		return {
			hostname: this.getOriginHostname()
		};
	}

	getValuesForUserPrefix() {
		return {
			user_id: this.getOriginUserId()
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

	hasOriginHostname() {
		return this.getOriginHostname() !== null;
	}

	getOriginHostname() {
		return this.origin_hostname;
	}

	setOriginHostname(hostname) {
		this.origin_hostname = hostname;
		return this;
	}

	hasOriginUserId() {
		return this.getOriginUserId() !== null;
	}

	getOriginUserId() {
		return this.origin_user_id;
	}

	setOriginUserId(user_id) {
		this.origin_user_id = user_id;
		return this;
	}

	setWords() {
		throw new AbstractMethodNotImplementedError('setWords()');
	}

	setTarget(target) {
		return this.setTargets([target]);
	}

	getTarget() {
		return this.getTargets()[0] || null;
	}

	setTargets(targets) {
		this.targets = targets;
		return this;
	}

	getTargets() {
		if (!this.targets) {
			this.targets = [ ];
		}

		return this.targets;
	}

	hasTarget() {
		return this.getTargets().length > 0;
	}

}


extend(Message.prototype, {
	omit_prefix:       false,
	abnf:              null,

	raw_message:       null,
	reply:             null,
	command:           null,
	parameter_string:  null,
	parameter_parser:  null,
	parsed_parameters: null,

	origin_hostname:   null,
	origin_user_id:    null,

	target:            null

});

module.exports = Message;
