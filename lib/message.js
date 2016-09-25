
var req = require('req');

var
	extend = req('/utilities/extend');

var
	NickValidator         = req('/validators/nick'),
	ChannelNameValidator  = req('/validators/channel-name'),
	CommandValidator      = req('/validators/command'),
	NumericReplyValidator = req('/validators/numeric-reply'),
	BodyValidator         = req('/validators/body'),
	ServerNameValidator   = req('/validators/server-name'),
	UsernameValidator     = req('/validators/username'),
	HostnameValidator     = req('/validators/hostname');


// 512 minus 2 characters for trailing CR-LF:
const CHARACTER_LIMIT = 510;

class Message {

	constructor() {
		this.validate();
	}

	validate() {
		if (this.hasNumericReply()) {
			this.validateNumericReply(this.numeric_reply);
		} else {
			this.validateCommand(this.command);
		}
	}

	validateCommand(command) {
		CommandValidator.validate(command);
	}

	validateNumericReply(numeric_reply) {
		NumericReplyValidator.validate(numeric_reply);
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

	validateHostname(hostname) {
		HostnameValidator.validate(hostname);
	}

	setRawMessage(raw_message) {
		this.raw_message = raw_message;
		return this;
	}

	setNumericReplyResponse(numeric_reply_response) {
		this.validateNumericReply(numeric_reply_response);
		this.numeric_reply_response = numeric_reply_response;
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

	hasNick() {
		return this.nick !== null;
	}

	getNick() {
		return this.nick;
	}

	setNick(nick) {
		this.validateNick(nick);
		this.nick = nick;
		return this;
	}

	hasNumericReply() {
		return this.numeric_reply !== null;
	}

	getNumericReply() {
		return this.numeric_reply;
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

	setHostname(hostname) {
		this.validateHostname(hostname);
		this.hostname = hostname;
		return this;
	}

	getAddress() {
		return this.getUsername() + '@' + this.getHostname();
	}

	getUserIdentifier() {
		return this.getNick() + '!' + this.getAddress();
	}

	serialize() {
		throw new Error(`
			Must implement message.serialize() in message subclass
		`);
	}

	deserialize() {
		throw new Error(`
			Must implement message.deserialize() in message subclass
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
	raw_message:            null,

	numeric_reply:          null,
	numeric_reply_response: null,

	command:                null,

	body:                   '',

	channel_name:           null,

	server_name:            null,

	structure_definition:   null,

	nick:                   null,

	username:               null,

	hostname:               null
});

module.exports = Message;
