
var
	extend        = req('/lib/utilities/extend'),
	ReplyMessage  = req('/lib/messages/reply'),
	ReplyNumerics = req('/lib/constants/reply-numerics');



class LUserClientMessage extends ReplyMessage {

	/**
	 * Called on the server.
	 *
	 * @returns {int}
	 */
	getLocalVisibleUserCount() {
		return this.getLocalServerDetails().getGlobalVisibleUserCount();
	}

	/**
	 * Called on the server.
	 *
	 * @returns {int}
	 */
	getLocalInvisibleUserCount() {
		return this.getLocalServerDetails().getGlobalInvisibleUserCount();
	}

	getLocalServerCount() {
		// TODO: implement
		return 0;
	}

	getBody() {
		var
			visible_user_count   = this.getLocalVisibleUserCount(),
			invisible_user_count = this.getLocalInvisibleUserCount(),
			server_count         = this.getLocalServerCount();

		return `There are ${visible_user_count} users and ${invisible_user_count} invisible on ${server_count} servers`;
	}

	serializeParameters() {
		var
			targets = this.serializeTargets(),
			body    = this.getBody();

		return `${targets} :${body}`;
	}

	applyParsedParameters(middle_parameters, trailing_parameter) {
		this.setTargetStrings(middle_parameters);
		this.setBody(trailing_parameter);
	}

}

extend(LUserClientMessage.prototype, {

	reply_numeric:        ReplyNumerics.RPL_LUSERCLIENT,
	visible_user_count:   null,
	invisible_user_count: null,
	server_count:         null

});

module.exports = LUserClientMessage;
