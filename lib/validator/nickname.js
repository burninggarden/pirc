var
	isString   = req('/lib/utility/is-string'),
	isNickname = req('/lib/utility/is-nickname');

const
	MINIMUM_NICK_LENGTH = 1,
	MAXIMUM_NICK_LENGTH = 16;


function validate(nickname) {

	if (!nickname) {
		throw new Error('Invalid nickname: ' + nickname);
	}

	if (!isString(nickname)) {
		throw new Error('Invalid nickname: ' + nickname);
	}

	if (nickname.length < MINIMUM_NICK_LENGTH) {
		throw new Error('Invalid nickname: ' + nickname);
	}

	if (nickname.length > MAXIMUM_NICK_LENGTH) {
		throw new Error('Invalid nickname: ' + nickname);
	}

	if (!isNickname(nickname)) {
		throw new Error('Invalid nickname: ' + nickname);
	}

}

module.exports = {
	validate
};
