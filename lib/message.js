
var
	Heket = require('heket');

var
	extend = req('/lib/utilities/extend');

var
	MessageUnparser = req('/lib/unparsers/message'),
	IrcRules        = req('/lib/rule-lists/irc'),
	Commands        = req('/lib/constants/commands'),
	ErrorReasons    = req('/lib/constants/error-reasons');


var
	AbstractMethodNotImplementedError = req('/lib/errors/abstract-method-not-implemented'),
	InvalidNickParametersError        = req('/lib/errors/invalid-nick-parameters'),
	InvalidUserParametersError        = req('/lib/errors/invalid-user-parameters');


class Message {

	constructor() {
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
		var abnf = 'parameters = ' + this.getABNF();

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
			parsed_parameters = parser.parse(parameter_string);

		if (parsed_parameters === null) {
			throw this.createErrorForUnparseableParameters();
		}

		this.setParsedParameters(parsed_parameters);
	}

	createErrorForUnparseableParameters() {
		if (
			   this.isMissingMiddleParameters()
			|| this.isMissingTrailingParameter()
		) {
			return this.createNotEnoughParametersError();
		}

		throw new Error('implement');
	}

	isMissingMiddleParameters() {
	}

	isMissingTrailingParameter() {
	}

	createNotEnoughParametersError() {
		return this.createInvalidParametersError(
			this.getParameterString(),
			ErrorReasons.NOT_ENOUGH_PARAMETERS
		);
	}

	createInvalidParametersError(value, reason) {
		if (!this.hasCommand()) {
			throw new Error('implement not enough params for replies');
		}

		var command = this.getCommand();

		switch (command) {
			case Commands.NICK:
				return new InvalidNickParametersError(value, reason);

			case Commands.USER:
				return new InvalidUserParametersError(value, reason);

			default:
				throw new Error(
					`implement: invalid params for command ${command}`
				);
		}
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
			result = this.getParameterUnparser().unparse(values);

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
			return '';
		}

		throw new Error('implement');
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

	hasABNF() {
		return this.getABNF() !== null;
	}

	getABNF() {
		return this.abnf;
	}

}

extend(Message.prototype, {
	omit_prefix:      false,
	abnf:             null,

	raw_message:      null,
	reply:            null,
	command:          null,
	parameter_string: null,
	parameter_parser: null
});

module.exports = Message;
