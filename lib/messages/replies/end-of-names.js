
var
	extend       = req('/lib/utilities/extend'),
	ReplyMessage = req('/lib/messages/reply'),
	Replies      = req('/lib/constants/replies');


class EndOfNamesMessage extends ReplyMessage {

	getValuesForParameters() {
		return {
			channel_name: this.getChannelName()
		};
	}

	setValuesFromParameters(parameters) {
		this.setChannelName(parameters.getChannelName());
	}

}

extend(EndOfNamesMessage.prototype, {

	reply: Replies.RPL_ENDOFNAMES,
	abnf:  '<channel-name> " :End of NAMES list"'

});

module.exports = EndOfNamesMessage;
