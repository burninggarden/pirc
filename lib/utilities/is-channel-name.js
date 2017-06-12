var
	ChannelParser = req('/lib/parsers/channel');

function isChannelName(value) {
	return ChannelParser.parse(value) !== null;
}

module.exports = isChannelName;
