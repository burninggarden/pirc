
var getBasePath = require('./get-base-path');

function req(path) {
	return require(getBasePath() + path);
}

module.exports = global.req = req;
