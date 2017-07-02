
var
	random = req('/lib/utilities/random'),
	chance = req('/lib/utilities/chance');

var
	Commands           = req('/lib/constants/commands'),
	ModeActions        = req('/lib/constants/mode-actions'),
	UserModes          = req('/lib/constants/user-modes'),
	ChannelModes       = req('/lib/constants/channel-modes'),
	TargetTypes        = req('/lib/constants/target-types'),
	ModeParameterTypes = req('/lib/constants/mode-parameter-types');

var
	JoinMessage    = req('/lib/messages/commands/join'),
	ModeMessage    = req('/lib/messages/commands/mode'),
	NickMessage    = req('/lib/messages/commands/nick'),
	NoticeMessage  = req('/lib/messages/commands/notice'),
	PartMessage    = req('/lib/messages/commands/part'),
	PrivateMessage = req('/lib/messages/commands/private'),
	TopicMessage   = req('/lib/messages/commands/topic'),
	WhoisMessage   = req('/lib/messages/commands/whois');

var
	MarkovConstructor = req('/lib/markov-constructor'),
	UserDetails       = req('/lib/user-details'),
	ChannelDetails    = req('/lib/channel-details'),
	ModeChange        = req('/lib/mode-change');


class MessageGenerator {

	generateRandomTitleText() {
		return MarkovConstructor.construct(req('/data/title-text.json'));
	}

	generateRandomBodyText() {
		return MarkovConstructor.construct(req('/data/body-text.json'));
	}

	generateRandomChannelName() {
		return '#' + this.generateRandomToken();
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

		var nick = channel.getRandomNickname();

		if (!nick) {
			return this.generateRandomUser();
		}

		return UserDetails.fromNick(nick);
	}

	generateRandomCommand() {
		return Commands.MODE;
		var commands = [
			Commands.JOIN,
			Commands.PART,
			Commands.NICK,
			Commands.MODE,
			Commands.NOTICE,
			Commands.PRIVMSG,
			Commands.TOPIC
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

		message.setMessageTarget(user.getNickname());
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

		message.setMessageTarget(channel.getName());
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

		message.setTargetType(TargetTypes.USER);

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
		mode_change.setAction(random(ModeActions));

		var mode = random(UserModes);

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

		message.setTargetType(TargetTypes.CHANNEL);

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
		mode_change.setAction(random(ModeActions));

		var mode = random(ChannelModes);

		mode_change.setMode(mode);

		this.applyRandomParametersToModeChange(mode_change);

		return mode_change;
	}

	applyRandomParametersToModeChange(mode_change) {
		var parameter_type = mode_change.getParameterType();

		if (parameter_type === ModeParameterTypes.NONE) {
			return;
		}

		var count;

		if (parameter_type === ModeParameterTypes.PLURAL) {
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
			case Commands.JOIN:
				return this.generateRandomJoinMessageForClient(client);

			case Commands.MODE:
				return this.generateRandomModeMessageForClient(client);

			case Commands.NICK:
				return this.generateRandomNickMessageForClient(client);

			case Commands.NOTICE:
				return this.generateRandomNoticeMessageForClient(client);

			case Commands.PART:
				return this.generateRandomPartMessageForClient(client);

			case Commands.PRIVMSG:
				return this.generateRandomPrivateMessageForClient(client);

			case Commands.TOPIC:
				return this.generateRandomTopicMessageForClient(client);

			case Commands.WHOIS:
				return this.generateRandomWhoisMessageForClient(client);

			default:
				throw new Error(`
					Unsupported command: ${command}
				`);
		}
	}

}

module.exports = new MessageGenerator();
