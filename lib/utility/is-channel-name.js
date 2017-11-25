var
	ChannelNameParser = req('/lib/parser/channel-name');

function isChannelName(value) {
	return ChannelNameParser.parseSafe(value) !== null;
}

module.exports = isChannelName;
