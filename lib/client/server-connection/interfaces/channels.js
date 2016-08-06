var req = require('req');

var
	has    = req('/utilities/has'),
	add    = req('/utilities/add'),
	remove = req('/utilities/remove');

var
	Channel        = req('/lib/client/channel'),
	NumericReplies = req('/constants/numeric-replies'),
	Commands       = req('/constants/commands');

var
	ClientJoinMessage = req('/lib/client/messages/join'),
	ClientPartMessage = req('/lib/client/messages/part');
	ClientPrivateMessage = req('/lib/client/messages/private');

var
	AlreadyInChannelError = req('/lib/errors/already-in-channel'),
	NotInChannelError     = req('/lib/errors/not-in-channel');



module.exports = {

	channels:         null,
	channels_by_name: null,

	init() {
		this.channels         = [ ];
		this.channels_by_name = { };
	},

	handleMessage(message) {
		if (message.hasNumericReply()) {
			switch (message.getNumericReply()) {
				case NumericReplies.RPL_TOPIC:
					return this.handleChannelTopicMessage(message);

				case NumericReplies.RPL_TOPICWHOTIME:
					return this.handleChannelTopicDetailsMessage(message);

				case NumericReplies.RPL_NAMREPLY:
					return this.handleChannelNamesReplyMessage(message);

				case NumericReplies.RPL_ENDOFNAMES:
					return this.handleChannelEndOfNamesMessage(message);
			}
		} else {
			switch (message.getCommand()) {
				case Commands.JOIN:
					return this.handleJoinMessage(message);

				case Commands.PART:
					return this.handlePartMessage(message);
			}
		}
	},

	handleJoinMessage(message) {
		var
			channel_name = message.getChannelName(),
			channel      = this.getChannelByName(channel_name);

		if (message.getNick() === this.getNick()) {
			channel.dispatchJoinCallbacks();
		}
	},

	handlePartMessage(message) {
		var
			channel_name = message.getChannelName(),
			channel      = this.getChannelByName(channel_name);

		if (message.getNick() === this.getNick()) {
			channel.dispatchPartCallbacks();
		}
	},

	handleChannelTopicMessage(message) {
		var channel_name = message.getChannelName();

		this.getChannelByName(channel_name).handleTopicMessage(message);
	},

	handleChannelTopicDetailsMessage(message) {
		var channel_name = message.getChannelName();

		this.getChannelByName(channel_name).handleTopicDetailsMessage(message);
	},

	handleChannelNamesReplyMessage(message) {
		var channel_name = message.getChannelName();

		this.getChannelByName(channel_name).handleNamesReplyMessage(message);
	},

	handleChannelEndOfNamesMessage(message) {
		var channel_name = message.getChannelName();

		this.getChannelByName(channel_name).handleEndOfNamesMessage(message);
	},

	getChannelByName(channel_name) {
		return this.channels_by_name[channel_name];
	},

	isWithinChannelName(channel_name) {
		var channel = this.getChannelByName(channel_name);

		if (!channel) {
			return false;
		}

		return has(this.channels, channel);
	},

	joinChannelByName(channel_name, callback) {
		if (this.isWithinChannelName(channel_name)) {
			return void callback(new AlreadyInChannelError(channel_name));
		}

		var channel = new Channel(channel_name);

		channel.addJoinCallback(callback);
		add(channel).to(this.channels);
		this.channels_by_name[channel_name] = channel;

		var message = new ClientJoinMessage();

		message.addChannelName(channel_name);
		this.sendMessage(message);
	},

	leaveChannelByName(channel_name, callback) {
		if (!this.isWithinChannelName(channel_name)) {
			return void callback(new NotInChannelError(channel_name));
		}

		var channel = this.getChannelByName(channel_name);

		channel.addPartCallback(callback);
		remove(channel).from(this.channels);
		delete this.channels_by_name[channel_name];

		var message = new ClientPartMessage();

		message.addChannelName(channel_name);
		this.sendMessage(message);
	},

	createPrivateMessageToChannel(channel) {
		var message = new ClientChannelMessage();

		message.setChannelName(channel.getName());
	},

	sendLineToChannelByName(line, channel_name) {
		var message = new ClientPrivateMessage();

		message.setChannelName(channel_name);

		var initial_count = message.getCharacterCount();

		message.setBody(line);

		if (!message.isAtCharacterLimit()) {
			return void this.sendMessage(message);
		}

		var
			excess_count    = message.getExcessCharacterCount(),
			string_position = excess_count - initial_count,
			index           = string_position;

		while (index--) {
			// Look for the first instance of a space to split on.
			let character = line[string_index];

			if (character === ' ') {
				let
					first_line  = line.slice(0, index),
					second_line = line.slice(index + 1);

				this.sendLineToChannelByName(first_line,  channel_name);

				// The following will be called recursively until all
				// messages are constructed under the character limit:
				this.sendLineToChannelByName(second_line, channel_name);
				return;
			}
		}

		// We didn't find any matching spaces in the part of the specified
		// line that exceeded the message's character limit. Bummer.
		// In this case, we should just slice the text at the limit.
		var
			first_line  = line.slice(0, string_position),
			second_line = line.slice(string_position);

		this.sendLineToChannelByName(first_line, channel_name);
		this.sendLineToChannelByName(second_line, channel_name);
	},

	sendTextToChannelByName(text, channel_name) {
		if (!this.isWithinChannelName(channel_name)) {
			// TODO: I actually am not sure this is a formal requirement,
			// as wacky as that is.
			throw new NotInChannelError(channel_name);
		}

		text.split('\n').forEach(function each(line) {
			this.sendLineToChannelByName(line, channel_name);
		}, this);
	}

};


