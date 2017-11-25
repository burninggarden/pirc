
var
	random = req('/lib/utility/random'),
	chance = req('/lib/utility/chance');

var
	Enum_Commands           = req('/lib/enum/commands'),
	Enum_ModeActions        = req('/lib/enum/mode-actions'),
	Enum_UserModes          = req('/lib/enum/user-modes'),
	Enum_ChannelModes       = req('/lib/enum/channel-modes'),
	Enum_TargetTypes        = req('/lib/enum/target-types'),
	Enum_ModeParameterTypes = req('/lib/enum/mode-parameter-types');

var
	JoinMessage    = req('/lib/message/command/join'),
	ModeMessage    = req('/lib/message/command/mode'),
	NickMessage    = req('/lib/message/command/nick'),
	NoticeMessage  = req('/lib/message/command/notice'),
	PartMessage    = req('/lib/message/command/part'),
	PrivateMessage = req('/lib/message/command/private'),
	TopicMessage   = req('/lib/message/command/topic'),
	WhoisMessage   = req('/lib/message/command/whois');

var
	MarkovConstructor = req('/lib/markov-constructor'),
	UserDetails       = req('/lib/user-details'),
	ChannelDetails    = req('/lib/channel-details'),
	ModeChange        = req('/lib/mode-change');


var CHANNEL_NAMES = [ ];


class MessageGenerator {

	generateRandomTitleText() {
		return MarkovConstructor.construct(req('/data/title-text.json'));
	}

	generateRandomBodyText() {
		return MarkovConstructor.construct(req('/data/body-text.json'));
	}

	generateRandomChannelName() {
		if (CHANNEL_NAMES.length < 10) {
			CHANNEL_NAMES.push('#' + this.generateRandomToken());
		}

		return random(CHANNEL_NAMES);
	}

	generateRandomChannel() {
		return ChannelDetails.fromName(this.generateRandomChannelName());
	}

	generateRandomUser() {
		return (new UserDetails()).setNickname(this.generateRandomNick());
	}

	generateRandomToken() {
		var token = this.generateRandomTitleText();

		token = token.replace(/[^A-Za-z]/g, '');

		return token.slice(0, 9).toLowerCase();
	}

	generateRandomNick() {
		return this.generateRandomToken();
	}

	generateRandomUserForClient(client) {
		var channel = client.getRandomChannel();

		if (!channel) {
			return this.generateRandomUser();
		}

		var nickname = channel.getRandomNickname();

		if (!nickname) {
			return this.generateRandomUser();
		}

		return UserDetails.fromNickname(nickname);
	}

	generateRandomCommand() {
		var commands = [
			Enum_Commands.JOIN,
			Enum_Commands.PART,
			Enum_Commands.NICK,
			Enum_Commands.MODE,
			Enum_Commands.NOTICE,
			Enum_Commands.PRIVMSG,
			Enum_Commands.TOPIC
		];

		return random(commands);
	}

	generateRandomCharCode() {
		return random(20000);
	}

	generateRandomCharacters(length) {
		var
			index  = 0,
			result = '';

		while (index < length) {
			let char_code = this.generateRandomCharCode();

			result += String.fromCharCode(char_code);
			index++;
		}

		return result;
	}

	generateRandomPrivateMessageForClient(client) {
		if (chance(0.5)) {
			return this.generateRandomPMMessageForClient(client);
		} else {
			return this.generateRandomChannelMessageForClient(client);
		}
	}

	generateRandomPMMessageForClient(client, is_notice = false) {
		var message;

		if (is_notice) {
			message = new NoticeMessage();
		} else {
			message = new PrivateMessage();
		}

		var user = this.generateRandomUserForClient(client);

		message.setTarget(user.getNickname());
		message.setMessageBody(this.generateRandomBodyText());

		return message;
	}

	generateRandomChannelMessageForClient(client, is_notice = false) {
		var message;

		if (is_notice) {
			message = new NoticeMessage();
		} else {
			message = new PrivateMessage();
		}

		var channel = client.getRandomChannelDetails();

		if (!channel || chance(0.1)) {
			channel = this.generateRandomChannel();
		}

		message.setTarget(channel.getName());
		message.setMessageBody(this.generateRandomBodyText());

		return message;
	}

	generateRandomTopicMessageForClient(client) {
		var
			message = new TopicMessage(),
			channel = client.getRandomChannelDetails();

		if (!channel || chance(0.1)) {
			channel = this.generateRandomChannel();
		}

		message.setChannelName(channel.getName());

		if (chance(0.75)) {
			let topic = this.generateRandomBodyText();

			message.setChannelTopic(topic);
		}

		return message;
	}

	generateRandomNickMessageForClient(client) {
		var
			message = new NickMessage(),
			nick    = this.generateRandomNick();

		message.setNickname(nick);

		return message;
	}

	generateRandomJoinMessageForClient(client) {
		var
			message = new JoinMessage(),
			channel = client.getRandomChannelDetails();

		if (!channel || chance(0.9)) {
			channel = ChannelDetails.fromName(this.generateRandomChannelName());
		}

		message.addChannelName(channel.getName());

		return message;
	}

	generateRandomPartMessageForClient(client) {
		var
			message = new PartMessage(),
			channel = client.getRandomChannelDetails();

		if (!channel || chance(0.1)) {
			channel = ChannelDetails.fromName(this.generateRandomChannelName());
		}

		message.setChannelName(channel.getName());

		return message;
	}

	generateRandomUserModeMessageForClient(client) {
		var user;

		if (chance(0.9)) {
			user = client.getUserDetails();
		} else {
			user = this.generateRandomUser();
		}

		var message = new ModeMessage();

		message.setTargetType(Enum_TargetTypes.USER);

		var
			index        = 0,
			change_count = random(4) + 1;

		while (index < change_count) {
			let change = this.generateRandomModeChangeForUser(user);

			message.addModeChange(change);
			index++;
		}

		return message;
	}

	generateRandomModeChangeForUser(user) {
		var mode_change = new ModeChange();

		mode_change.setNickname(user.getNickname());
		mode_change.setAction(random(Enum_ModeActions));

		var mode = random(Enum_UserModes);

		mode_change.setMode(mode);

		this.applyRandomParametersToModeChange(mode_change);

		return mode_change;
	}

	generateRandomChannelModeMessageForClient(client) {
		var channel = client.getRandomChannelDetails();

		if (!channel || chance(0.1)) {
			channel = this.generateRandomChannel();
		}

		var message = new ModeMessage();

		message.setTargetType(Enum_TargetTypes.CHANNEL);

		var
			index        = 0,
			change_count = random(4) + 1;

		while (index < change_count) {
			let change = this.generateRandomModeChangeForChannel(channel);

			message.addModeChange(change);
			index++;
		}

		return message;
	}

	generateRandomModeChangeForChannel(channel) {
		var mode_change = new ModeChange();

		mode_change.setChannelName(channel.getName());
		mode_change.setAction(random(Enum_ModeActions));

		var mode = random(Enum_ChannelModes);

		mode_change.setMode(mode);

		this.applyRandomParametersToModeChange(mode_change);

		return mode_change;
	}

	applyRandomParametersToModeChange(mode_change) {
		var parameter_type = mode_change.getParameterType();

		if (parameter_type === Enum_ModeParameterTypes.NONE) {
			return;
		}

		var count;

		if (parameter_type === Enum_ModeParameterTypes.PLURAL) {
			count = random(4) + 1;
		} else {
			count = 1;
		}

		var parameters = this.generateRandomModeParameters(count);

		mode_change.setParameters(parameters);
	}

	generateRandomModeParameters(count) {
		var result = [ ];

		while (count--) {
			result.push(this.generateRandomModeParameter());
		}

		return result;
	}

	generateRandomModeParameter() {
		return this.generateRandomToken();
	}

	generateRandomModeMessageForClient(client) {
		if (chance(0.5)) {
			return this.generateRandomUserModeMessageForClient(client);
		} else {
			return this.generateRandomChannelModeMessageForClient(client);
		}
	}

	generateRandomNoticeMessageForClient(client) {
		var is_notice = true;

		if (chance(0.5) || true) {
			return this.generateRandomPMMessageForClient(client, is_notice);
		} else {
			return this.generateRandomChannelMessageForClient(client, is_notice);
		}
	}

	generateRandomWhoisMessageForClient(client) {
		var
			message = new WhoisMessage(),
			user    = this.generateRandomUserForClient(client);

		message.setNickname(user.getNickname());

		return message;
	}

	generateRandomMessageForClient(client) {
		var command = this.generateRandomCommand();

		switch (command) {
			case Enum_Commands.JOIN:
				return this.generateRandomJoinMessageForClient(client);

			case Enum_Commands.MODE:
				return this.generateRandomModeMessageForClient(client);

			case Enum_Commands.NICK:
				return this.generateRandomNickMessageForClient(client);

			case Enum_Commands.NOTICE:
				return this.generateRandomNoticeMessageForClient(client);

			case Enum_Commands.PART:
				return this.generateRandomPartMessageForClient(client);

			case Enum_Commands.PRIVMSG:
				return this.generateRandomPrivateMessageForClient(client);

			case Enum_Commands.TOPIC:
				return this.generateRandomTopicMessageForClient(client);

			case Enum_Commands.WHOIS:
				return this.generateRandomWhoisMessageForClient(client);

			default:
				throw new Error(`
					Unsupported command: ${command}
				`);
		}
	}

}

module.exports = new MessageGenerator();
