
var
	extend        = req('/utilities/extend'),
	ServerMessage = req('/lib/server/message'),
	ReplyNumerics = req('/constants/reply-numerics');



class ServerLUserClientMessage extends ServerMessage {

	/**
	 * Called on the server.
	 */
	getVisibleUserCount() {
		return this.getLocalServerDetails().getGlobalVisibleUserCount();
	}

	/**
	 * Called on the server.
	 */
	getInvisibleUserCount() {
		return this.getLocalServerDetails().getGlobalInvisibleUserCount();
	}

	getServerCount() {
		// TODO: implement
		return 0;
	}

	getBody() {
		var
			visible_user_count   = this.getVisibleUserCount(),
			invisible_user_count = this.getInvisibleUserCount(),
			server_count         = this.getServerCount();

		return `There are ${visible_user_count} users and ${invisible_user_count} invisible on ${server_count} servers`;
	}

	serializeParams() {
		var
			targets = this.serializeTargets(),
			body    = this.getBody();

		return `${targets} :${body}`;
	}

	applyParsedParams(middle_params, trailing_param) {
		this.setTargetStrings(middle_params);
		this.setBody(trailing_param);
	}

}

extend(ServerLUserClientMessage.prototype, {

	reply_numeric:        ReplyNumerics.RPL_LUSERCLIENT,
	visible_user_count:   null,
	invisible_user_count: null,
	server_count:         null

});

module.exports = ServerLUserClientMessage;
