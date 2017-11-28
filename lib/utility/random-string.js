
var Crypto = require('crypto');

function randomString(length) {
	return Crypto.randomBytes(length).toString('hex').slice(0, length);
}

module.exports = randomString;
