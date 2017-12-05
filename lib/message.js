
var
	Heket = require('heket');

var
	has      = require('./utility/has'),
	extend   = require('./utility/extend'),
	isString = require('./utility/is-string');

var
	Unparser_Message = require('./unparser/message'),
	Unparser_Prefix  = require('./unparser/prefix'),
	Parser_Prefix    = require('./parser/prefix'),
	RuleList_IRC     = require('./rule-list/irc');

var
	Enum_Commands      = require('./enum/commands'),
	Enum_Replies       = require('./enum/replies'),
	Enum_ReplyNumerics = require('./enum/reply-numerics');

var
	Validator_Callback = require('./validator/callback');


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
	isErrorMessage() {
		return false;
	}

	/**
	 * @returns {boolean}
	 */
	hasParameters() {
		return true;
	}

	/**
	 * @param   {function} callback
	 * @returns {self}
	 */
	setCallback(callback) {
		Validator_Callback.validate(callback);

		this.callback = callback;
		return this;
	}

	/**
	 * @returns {function|null}
	 */
	getCallback() {
		return this.callback;
	}

	/**
	 * @returns {boolean}
	 */
	hasCallback() {
		return this.getCallback() !== null;
	}

	/**
	 * @returns {null}
	 */
	getChannelName() {
		return null;
	}

	/**
	 * @returns {boolean}
	 */
	hasChannelName() {
		return this.getChannelName() !== null;
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

	is_lethal:          false,
	callback:           null

});

function getConstructorForCommand(command) {
	switch (command) {
		case Enum_Commands.AWAY:
			return require('./message/command/away');

		case Enum_Commands.CAP:
			return require('./message/command/cap');

		case Enum_Commands.CONNECT:
			return require('./message/command/connect');

		case Enum_Commands.ERROR:
			return require('./message/command/error');

		case Enum_Commands.JOIN:
			return require('./message/command/join');

		case Enum_Commands.MODE:
			return require('./message/command/mode');

		case Enum_Commands.NICK:
			return require('./message/command/nick');

		case Enum_Commands.NJOIN:
			return require('./message/command/njoin');

		case Enum_Commands.NOTICE:
			return require('./message/command/notice');

		case Enum_Commands.OPER:
			return require('./message/command/oper');

		case Enum_Commands.PART:
			return require('./message/command/part');

		case Enum_Commands.PASS:
			return require('./message/command/pass');

		case Enum_Commands.PING:
			return require('./message/command/ping');

		case Enum_Commands.PONG:
			return require('./message/command/pong');

		case Enum_Commands.PRIVMSG:
			return require('./message/command/private');

		case Enum_Commands.QUIT:
			return require('./message/command/quit');

		case Enum_Commands.RESTART:
			return require('./message/command/restart');

		case Enum_Commands.SERVER:
			return require('./message/command/server');

		case Enum_Commands.TOPIC:
			return require('./message/command/topic');

		case Enum_Commands.USER:
			return require('./message/command/user');

		case Enum_Commands.WHO:
			return require('./message/command/who');

		case Enum_Commands.WHOIS:
			return require('./message/command/whois');

		case Enum_Commands.WHOWAS:
			return require('./message/command/whowas');

		default:
			throw new Error('Invalid command: ' + command);
	}
}

function getConstructorForReply(reply) {
	switch (reply) {
		case Enum_Replies.RPL_WELCOME:
			return require('./message/reply/welcome');

		case Enum_Replies.RPL_YOURHOST:
			return require('./message/reply/your-host');

		case Enum_Replies.RPL_CREATED:
			return require('./message/reply/created');

		case Enum_Replies.RPL_MYINFO:
			return require('./message/reply/my-info');

		case Enum_Replies.RPL_BOUNCE:
			return require('./message/reply/bounce');

		case Enum_Replies.RPL_ISUPPORT:
			return require('./message/reply/i-support');

		case Enum_Replies.RPL_UMODEIS:
			return require('./message/reply/user-mode-is');

		case Enum_Replies.RPL_STATSDLINE:
			return require('./message/reply/stats-dline');

		case Enum_Replies.RPL_LUSERCLIENT:
			return require('./message/reply/l-user-client');

		case Enum_Replies.RPL_LUSEROP:
			return require('./message/reply/l-user-op');

		case Enum_Replies.RPL_LUSERUNKNOWN:
			return require('./message/reply/l-user-unknown');

		case Enum_Replies.RPL_LUSERCHANNELS:
			return require('./message/reply/l-user-channels');

		case Enum_Replies.RPL_LUSERME:
			return require('./message/reply/l-user-me');

		case Enum_Replies.RPL_LOCALUSERS:
			return require('./message/reply/local-users');

		case Enum_Replies.RPL_GLOBALUSERS:
			return require('./message/reply/global-users');

		case Enum_Replies.RPL_AWAY:
			return require('./message/reply/away');

		case Enum_Replies.RPL_USERHOST:
			return require('./message/reply/user-host');

		case Enum_Replies.RPL_UNAWAY:
			return require('./message/reply/unaway');

		case Enum_Replies.RPL_NOWAWAY:
			return require('./message/reply/now-away');

		case Enum_Replies.RPL_WHOISUSER:
			return require('./message/reply/whois-user');

		case Enum_Replies.RPL_WHOISSERVER:
			return require('./message/reply/whois-server');

		case Enum_Replies.RPL_WHOISIDLE:
			return require('./message/reply/whois-idle');

		case Enum_Replies.RPL_ENDOFWHOIS:
			return require('./message/reply/end-of-whois');

		case Enum_Replies.RPL_WHOISCHANNELS:
			return require('./message/reply/whois-channels');

		case Enum_Replies.RPL_CHANNEL_URL:
			return require('./message/reply/channel-url');

		case Enum_Replies.RPL_WHOISACCOUNT:
			return require('./message/reply/whois-account');

		case Enum_Replies.RPL_NOTOPIC:
			return require('./message/reply/no-channel-topic');

		case Enum_Replies.RPL_TOPIC:
			return require('./message/reply/channel-topic');

		case Enum_Replies.RPL_TOPICWHOTIME:
			return require('./message/reply/channel-topic-details');

		case Enum_Replies.RPL_NAMREPLY:
			return require('./message/reply/names-reply');

		case Enum_Replies.RPL_ENDOFNAMES:
			return require('./message/reply/end-of-names');

		case Enum_Replies.RPL_MOTD:
			return require('./message/reply/motd');

		case Enum_Replies.RPL_MOTDSTART:
			return require('./message/reply/motd-start');

		case Enum_Replies.RPL_ENDOFMOTD:
			return require('./message/reply/end-of-motd');

		case Enum_Replies.RPL_YOUREOPER:
			return require('./message/reply/you-are-operator');

		case Enum_Replies.RPL_WHOISHOST:
			return require('./message/reply/whois-host');

		case Enum_Replies.RPL_WHOISMODES:
			return require('./message/reply/whois-modes');

		case Enum_Replies.ERR_NOSUCHNICK:
			return require('./message/reply/no-such-nick');

		case Enum_Replies.ERR_NOSUCHSERVER:
			return require('./message/reply/no-such-server');

		case Enum_Replies.ERR_NOSUCHCHANNEL:
			return require('./message/reply/no-such-channel');

		case Enum_Replies.ERR_UNKNOWNCOMMAND:
			return require('./message/reply/unknown-command');

		case Enum_Replies.ERR_NOMOTD:
			return require('./message/reply/no-motd');

		case Enum_Replies.ERR_NONICKNAMEGIVEN:
			return require('./message/reply/no-nickname-given');

		case Enum_Replies.ERR_ERRONEUSNICKNAME:
			return require('./message/reply/erroneous-nickname');

		case Enum_Replies.ERR_NICKNAMEINUSE:
			return require('./message/reply/nickname-in-use');

		case Enum_Replies.ERR_NOTONCHANNEL:
			return require('./message/reply/not-on-channel');

		case Enum_Replies.ERR_NOTIMPLEMENTED:
			return require('./message/reply/not-implemented');

		case Enum_Replies.ERR_NOTREGISTERED:
			return require('./message/reply/not-registered');

		case Enum_Replies.ERR_NEEDMOREPARAMS:
			return require('./message/reply/need-more-parameters');

		case Enum_Replies.ERR_ALREADYREGISTRED:
			return require('./message/reply/already-registered');

		case Enum_Replies.ERR_PASSWDMISMATCH:
			return require('./message/reply/password-mismatch');

		case Enum_Replies.ERR_LINKCHANNEL:
			return require('./message/reply/link-channel');

		case Enum_Replies.ERR_CHANNELISFULL:
			return require('./message/reply/channel-is-full');

		case Enum_Replies.ERR_UNKNOWNMODE:
			return require('./message/reply/unknown-mode');

		case Enum_Replies.ERR_INVITEONLYCHAN:
			return require('./message/reply/invite-only-channel');

		case Enum_Replies.ERR_NEEDREGGEDNICK:
			return require('./message/reply/need-regged-nick');

		case Enum_Replies.ERR_NOCHANMODES:
			return require('./message/reply/no-channel-modes');

		case Enum_Replies.ERR_NOPRIVILEGES:
			return require('./message/reply/no-privileges');

		case Enum_Replies.ERR_CHANOPRIVSNEEDED:
			return require('./message/reply/channel-operator-privileges-needed');

		case Enum_Replies.ERR_RESTRICTED:
			return require('./message/reply/restricted');

		case Enum_Replies.ERR_UMODEUNKNOWNFLAG:
			return require('./message/reply/user-mode-unknown-flag');

		case Enum_Replies.ERR_USERSDONTMATCH:
			return require('./message/reply/users-dont-match');

		case Enum_Replies.RPL_WHOISSECURE:
			return require('./message/reply/whois-secure');

		default:
			throw new Error('Invalid reply: ' + reply);
	}
}

function getConstructorForReplyNumeric(reply_numeric) {
	var reply = getReplyForReplyNumeric(reply_numeric);

	return getConstructorForReply(reply);
}

function getReplyForReplyNumeric(reply_numeric) {
	var reply;

	for (reply in Enum_ReplyNumerics) {
		let current_numeric = Enum_ReplyNumerics[reply];

		if (current_numeric === reply_numeric) {
			return reply;
		}
	}

	return null;
}

extend(Message, {

	fromCommand(command) {
		var constructor = getConstructorForCommand(command);

		return new constructor();
	},

	fromReply(reply) {
		var constructor = getConstructorForReply(reply);

		return new constructor();
	},

	fromReplyNumeric(reply_numeric) {
		var constructor = getConstructorForReplyNumeric(reply_numeric);

		return new constructor();
	},

	fromLeader(leader) {
		if (has(Enum_Commands, leader)) {
			return this.fromCommand(leader);
		}

		if (has(Enum_ReplyNumerics, leader)) {
			return this.fromReplyNumeric(leader);
		}

		if (has(Enum_Replies, leader)) {
			return this.fromReply(leader);
		}

		throw new Error('implement');
	}

});

module.exports = Message;
