
var
	Heket = require('heket');

var
	extend   = req('/lib/utility/extend'),
	isString = req('/lib/utility/is-string');

var
	Unparser_Message = req('/lib/unparser/message'),
	Unparser_Prefix  = req('/lib/unparser/prefix'),
	Parser_Prefix    = req('/lib/parser/prefix'),
	RuleList_IRC     = req('/lib/rule-list/irc');

var
	Enum_ReplyNumerics = req('/lib/enum/reply-numerics');


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

		this.validateABNF();
		this.ensureAbstractMethodsAreImplemented();
	}

	getLeader() {
		if (this.hasReply()) {
			return this.getReply();
		} else if (this.hasCommand()) {
			return this.getCommand();
		}
	}

	ensureAbstractMethodsAreImplemented() {
		// First, check to make sure this message actually has parameters.
		// If not, there's no point in requiring that the child class have
		// implemented the abstract methods for getting / setting parameters.
		if (!this.hasParameters()) {
			return;
		}

		var proto = Message.prototype;

		if (this.getValuesForParameters === proto.getValuesForParameters) {
			throw new Error('Implement method: getValuesForParameters()');
		}

		if (this.setValuesFromParameters === proto.setValuesFromParameters) {
			throw new Error('Implement method: setValuesFromParameters()');
		}
	}

	validateReply() {
		throw new Error('Implement method: validateReply()');
	}

	validateCommand() {
		throw new Error('Implement method: validateCommand()');
	}

	validateABNF() {
		if (!this.hasABNF() && this.hasParameters()) {
			let leader = this.getLeader();

			throw new Error(`Must specify an ABNF for message: ${leader}`);
		}
	}

	getParameterParser() {
		if (!this.constructor.parser) {
			this.buildParameterParser();
		}

		return this.constructor.parser;
	}

	/**
	 * @returns {void}
	 */
	buildParameterParser() {
		var abnf = 'parameters = ';

		if (this.hasReply()) {
			abnf += '<target> " " ';
		}

		abnf += this.getABNF();

		this.constructor.parser = Heket.createParser(abnf, RuleList_IRC);
	}

	getParameterUnparser() {
		if (!this.constructor.unparser) {
			this.constructor.unparser = this.getParameterParser().getUnparser();
		}

		return this.constructor.unparser;
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
			parsed_prefix = Parser_Prefix.parse(prefix);
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

		if (!this.hasParameters()) {
			return this;
		}

		var
			parser            = this.getParameterParser(),
			parameter_string  = this.getParameterString(),
			parsed_parameters = null;

		try {
			parsed_parameters = parser.parse(parameter_string);
		} catch (error) {
			this.handleParameterParsingError(error);

			// Turns out it's pretty easy to forget to re-throw the error
			// from within child classes' handleParameterParsingError() method
			// when the error isn't recognized by any defined logic. If we
			// reach this point, it means that the error was not re-thrown.
			// In that case, we should check to make sure that the overridden
			// method correctly set an immediate response to account for the
			// error. If not, rethrow it.
			if (!this.hasImmediateResponse()) {
				throw error;
			}

			return;
		}

		this.setParsedParameters(parsed_parameters);

		if (this.hasReply()) {
			let target = parsed_parameters.get('target');

			if (target) {
				this.setTarget(target);
			}
		}

		this.setValuesFromParameters(parsed_parameters);

		return this;
	}

	handleParameterParsingError(error) {
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
		return Enum_ReplyNumerics[this.getReply()] || null;
	}

	serialize() {
		var handler = this.getValueForMessageRule.bind(this);

		try {
			return Unparser_Message.unparse(handler);
		} catch (error) {
			throw error;
		}
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

	/**
	 * @returns {string}
	 */
	serializeParameters() {
		// Self-explanatory. Note that we return an explicit null here instead
		// of an empty string. This is because Heket will dutifully try to
		// interpolate a string result, empty or no, while the null primitive
		// acts as a short-circuit signal for it to bypass interpolation for
		// the "parameters" rule.
		if (!this.hasParameters()) {
			return null;
		}

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

		// This is important. Heket requires us to return a null value in order
		// to signal that we don't want the result of this method to be
		// interpolated into the larger message. If we return an empty string,
		// it will try to interpolate it, and an error will be thrown, because
		// empty strings are not valid for the <params> ABNF rule.
		if (result.length === 0) {
			return null;
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

		return Unparser_Prefix.unparse(this.getValuesForPrefix());
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

	/**
	 * @returns {boolean}
	 */
	hasABNF() {
		if (this.getABNF() === null) {
			return false;
		}

		if (!isString(this.abnf)) {
			return false;
		}

		if (this.abnf.length === 0) {
			return false;
		}

		return true;
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
		throw new Error('Implement method: setWords()');
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

	/**
	 * @returns {boolean}
	 */
	hasTarget() {
		return this.getTargets().length > 0;
	}

	hasImmediateResponse() {
		return this.getImmediateResponse() !== null;
	}

	setImmediateResponse(immediate_response) {
		this.immediate_response = immediate_response;
		return this;
	}

	getImmediateResponse() {
		return this.immediate_response;
	}

	/**
	 * @param   {boolean} is_lethal
	 * @returns {self}
	 */
	setIsLethal(is_lethal = true) {
		this.is_lethal = is_lethal;
		return this;
	}

	/**
	 * @returns {boolean}
	 */
	isLethal() {
		return this.is_lethal;
	}

	/**
	 * @returns {boolean}
	 */
	hasParameters() {
		return true;
	}

}


extend(Message.prototype, {
	omit_prefix:        false,
	abnf:               null,

	raw_message:        null,
	reply:              null,
	command:            null,
	parameter_string:   null,
	parameter_parser:   null,
	parsed_parameters:  null,

	origin_hostname:    null,
	origin_user_id:     null,

	target:             null,

	immediate_response: null,

	is_lethal:          false

});

module.exports = Message;
