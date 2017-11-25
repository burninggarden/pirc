
var isChannelName = req('/lib/utility/is-channel-name');


function validate(channel_name) {
	if (!channel_name) {
		throw new Error('Invalid channel name: ' + channel_name);
	}

	if (!isChannelName(channel_name)) {
		throw new Error('Invalid channel name: ' + channel_name);
	}
}


module.exports = {
	validate
};
