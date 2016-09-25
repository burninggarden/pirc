var
	flatten = req('/utilities/flatten');

class MessageBuilder {

	buildMessagesFromLine(line, getNewMessage) {
		if (line.length === 0) {
			return [];
		}

		var
			message    = getNewMessage(),
			messages   = [message],
			max_length = message.getRemainingCharacterCount();

		if (message.canAddTextToBody(line)) {
			message.addTextToBody(line);

			return messages;
		}

		var
			parts = line.split(' '),
			index = 0;

		while (index < parts.length) {
			let part = parts[index];

			// If this part occurred in the middle of the stream of words,
			// make sure to add the space delimiter back to the end of it:
			if (index < parts.length - 1) {
				part += ' ';
			}

			// Now that we're done checking the index, we can safely increment:
			index++;

			while (part.length >= max_length) {
				if (message.hasRemainingCharacterCount()) {
					let
						remaining_length = message.getRemainingCharacterCount(),
						prefix           = part.slice(0, remaining_length);

					message.addTextToBody(prefix);
					part = part.slice(remaining_length);
				}

				message = getNewMessage();
				messages.push(message);
			}

			if (!message.canAddTextToBody(part)) {
				message = getNewMessage();
				messages.push(message);
			}

			message.addTextToBody(part);
		}

		return messages.filter(function filter(message) {
			return message.hasBodyText();
		});
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
