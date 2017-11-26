var
	ChannelNameParser = require('../parser/channel-name');

function isChannelName(value) {
	return ChannelNameParser.parseSafe(value) !== null;
}

module.exports = isChannelName;
