var
	flatten = req('/lib/utility/flatten');

class MessageBuilder {

	buildMessagesFromLine(line, getNewMessage) {
		if (line.length === 0) {
			return [];
		}

		return this.buildMessagesFromWords(line.split(' '), getNewMessage);
	}

	buildMessagesFromWords(words, getNewMessage) {
		var
			message       = getNewMessage(),
			messages      = [message],
			index         = 0,
			current_words = [ ];

		while (index < words.length) {
			let word = words[index];

			current_words.push(word);
			message.setWords(current_words);

			let serialized_message = message.serialize();

			if (serialized_message.length > 512) {
				current_words.pop();
				message = getNewMessage();
				messages.push(message);
				continue;
			}

			index++;
		}

		return messages;
	}

	buildMultipleMessages(body, getNewMessage) {
		var lines = body.split('\n');

		var message_sets = lines.map(function each(line) {
			return this.buildMessagesFromLine(line, getNewMessage);
		}, this);

		return flatten(message_sets);
	}

}

module.exports = new MessageBuilder();
