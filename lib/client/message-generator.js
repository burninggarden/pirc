
var
	random = req('/utilities/random'),
	chance = req('/utilities/chance');

var
	Commands     = req('/constants/commands'),
	ModeActions  = req('/constants/mode-actions'),
	UserModes    = req('/constants/user-modes'),
	ChannelModes = req('/constants/channel-modes');

var
	JoinMessage    = req('/lib/client/messages/join'),
	ModeMessage    = req('/lib/client/messages/mode'),
	NickMessage    = req('/lib/client/messages/nick'),
	NoticeMessage  = req('/lib/client/messages/notice'),
	PartMessage    = req('/lib/client/messages/part'),
	PrivateMessage = req('/lib/client/messages/private'),
	TopicMessage   = req('/lib/client/messages/topic'),
	WhoisMessage   = req('/lib/client/messages/whois');

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
		return UserDetails.fromNick(this.generateRandomNick());
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
		var
			channel = client.getRandomChannel(),
			user    = null;

		if (!channel) {
			return this.generateRandomUser();
		}

		var nick = channel.getRandomNick();

		if (!nick) {
			return this.generateRandomUser();
		}

		return UserDetails.fromNick(nick);
	}

	generateRandomCommand() {
		var commands = [
			Commands.JOIN,
			Commands.PART,
			Commands.NICK,
			Commands.MODE,
			Commands.NOTICE,
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

	generateRandomPMMessageForClient(client) {
		var
			message = new PrivateMessage(),
			user    = this.generateRandomUserForClient(client);


		message.addTarget(user);
		message.setBody(this.generateRandomBodyText());

		return message;
	}

	generateRandomChannelMessageForClient(client) {
		var
			message = new PrivateMessage(),
			channel = client.getRandomChannel();

		if (!channel || chance(0.1)) {
			channel = this.generateRandomChannel();
		}

		message.addTarget(channel);
		message.setBody(this.generateRandomBodyText());

		return message;
	}

	generateRandomTopicMessageForClient(client) {
		var
			message = new TopicMessage(),
			channel = client.getRandomChannel(),
			topic   = this.generateRandomBodyText();

		if (!channel || chance(0.1)) {
			channel = this.generateRandomChannel();
		}

		message.addTarget(channel);
		message.setTopic(topic);

		return message;
	}

	generateRandomNickMessageForClient(client) {
		var
			message = new NickMessage(),
			nick;

		if (chance(0.9)) {
			nick = this.generateRandomNick();
		} else {
			let length = random(100);

			nick = this.generateRandomCharacters(length);
		}

		message.setDesiredNick(nick);

		return message;
	}

	generateRandomJoinMessageForClient(client) {
		var
			message = new JoinMessage(),
			channel = client.getRandomChannel();

		if (!channel || chance(0.9)) {
			channel = ChannelDetails.fromName(this.generateRandomChannelName());
		}

		message.addChannelName(channel.getName());

		return message;
	}

	generateRandomPartMessageForClient(client) {
		var
			message = new PartMessage(),
			channel = client.getRandomChannel();

		if (!channel || chance(0.1)) {
			channel = ChannelDetails.fromName(this.generateRandomChannelName());
		}

		message.addChannelName(channel.getName());

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

		var
			index        = 0,
			change_count = random(4);

		while (index < change_count) {
			let change = this.generateRandomModeChangeForUser(user);

			message.addModeChange(change);
			index++;
		}

		return message;
	}

	generateRandomModeChangeForUser(user) {
		var mode_change = new ModeChange();

		mode_change.setTarget(user);
		mode_change.setAction(random(ModeActions));

		var mode = random(UserModes);

		mode_change.setMode(mode);

		return mode_change;
	}

	generateRandomChannelModeMessageForClient(client) {
		var channel = client.getRandomChannel();

		if (!channel || chance(0.1)) {
			channel = this.generateRandomChannel();
		}

		var message = new ModeMessage();

		var
			index        = 0,
			change_count = random(4);

		while (index < change_count) {
			let change = this.generateRandomModeChangeForChannel(channel);

			message.addModeChange(change);
			index++;
		}

		return message;
	}

	generateRandomModeChangeForChannel(channel) {
		var mode_change = new ModeChange();

		mode_change.setTarget(channel);
		mode_change.setAction(random(ModeActions));

		var mode = random(ChannelModes);

		mode_change.setMode(mode);

		return mode_change;
	}

	generateRandomModeMessageForClient(client) {
		if (chance(0.5)) {
			return this.generateRandomUserModeMessageForClient(client);
		} else {
			return this.generateRandomChannelModeMessageForClient(client);
		}
	}

	generateRandomNoticeMessageForClient(client) {
	}

	generateRandomWhoisMessageForClient(client) {
		var
			message = new WhoisMessage(),
			user    = this.generateRandomUserForClient(client);

		message.addTarget(user);

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
