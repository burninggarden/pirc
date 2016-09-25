
var
	extend        = req('/utilities/extend'),
	ServerMessage = req('/lib/server/message'),
	ReplyNumerics = req('/constants/reply-numerics');



class ChannelTopicMessage extends ServerMessage {

}

extend(ChannelTopicMessage.prototype, {
	reply_numeric: ReplyNumerics.RPL_TOPIC,
	channel_name:  null,
	body:          null
});

module.exports = ChannelTopicMessage;
