var
	ChannelNameParser = req('/lib/parsers/channel-name');

function isChannelName(value) {
	return ChannelNameParser.parse(value) !== null;
}

module.exports = isChannelName;
