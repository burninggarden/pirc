
var
	extend        = req('/lib/utilities/extend'),
	ServerMessage = req('/lib/server/message'),
	ReplyNumerics = req('/lib/constants/reply-numerics');

class StatsConnMessage extends ServerMessage {

	getMaxConnectionCount() {
		return this.getLocalServerDetails().getMaxLocalConnectionCount();
	}

	getMaxClientCount() {
		return this.getLocalServerDetails().getMaxGlobalUserCount();
	}

	getTotalConnectionCount() {
		return this.getLocalServerDetails().getTotalGlobalConnectionCount();
	}

	getBody() {
		var
			max_connections   = this.getMaxConnectionCount(),
			max_clients       = this.getMaxClientCount(),
			total_connections = this.getTotalConnectionCount();

		return `Highest connection count: ${max_connections} (${max_clients} clients) (${total_connections} connections received)`;
	}

	serializeParams() {
		return ' ' + this.serializeTargets() + ' :' + this.getBody();
	}

	applyParsedParams(middle_params, trailing_param) {
		this.setTargetStrings(middle_params);
		this.setBody(trailing_param);
	}

}

extend(StatsConnMessage.prototype, {

	reply_numeric: ReplyNumerics.RPL_STATSCONN

});

module.exports = StatsConnMessage;
