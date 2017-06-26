var
	ChannelNameParser = req('/lib/parsers/channel-name');

function isChannelName(value) {
	return ChannelNameParser.parseSafe(value) !== null;
}

module.exports = isChannelName;
