
function random(set, log) {
	if (Object.prototype.toString.call(set) === '[object Array]') {
		return set[Math.floor(Math.random() * set.length)];
	}

	var position = Math.floor(Math.random() * set.__total),
		words = Object.keys(set),
		index = words.length,
		word;

	while (index-- && position > 0) {
		word = words[index];

		if (word === '__total') {
			continue;
		}

		position -= set[word];
	}

	return word || words[0];
}

function getRandomPunctuation() {
	var random_value = Math.random();

	if (random_value < 0.25) {
		return '.';
	} else if (random_value < 0.5) {
		return '?';
	} else if (random_value < 0.75) {
		return '!';
	} else {
		return '...';
	}
}

function findRootForStartPhrase(chain, phrase) {
	if (typeof phrase === 'undefined') {
		return random(chain.roots);
	}

	if (typeof phrase === 'string') {
		phrase = phrase.split(' ');
	}

	var token = phrase.slice(-2).join(' ');

	if (chain.roots[token]) {
		return chain.roots[token];
	}

	var last_word = phrase.pop(),
		words_to_pairs = chain.words_to_pairs[last_word];

	if (words_to_pairs) {
		return random(words_to_pairs);
	} else {
		// Couldn't find any matching words -> pairs;
		// just return the input text:
		phrase.push(last_word);
		return phrase.join(' ');
	}
}

function construct(chain, start_phrase, max_length, iterations) {
	if (!max_length) {
		max_length = 12;
	}

	if (!iterations) {
		iterations = 0;
	}

	var pair = findRootForStartPhrase(chain, start_phrase);

	var linkages = chain.linkages,
		terminals = chain.terminals,
		set = chain.linkages[pair],
		word_count = 0;

	var result = pair || '',
		last_word;

	while (set) {
		pair = random(set);
		set = linkages[pair];
		last_word = pair.split(' ')[1];
		result += ' ' + last_word;
		word_count += 2;

		if (terminals[last_word]) {
			if (word_count > max_length) {
				break;
			}
		}
	}

	if (result[result.length - 1] === ',') {
		result = result.slice(0, -1);
	}

	return result + getRandomPunctuation();
}

module.exports = {
	construct
};

