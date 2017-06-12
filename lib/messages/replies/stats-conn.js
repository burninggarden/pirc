
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

	serializeParameters() {
		return ' ' + this.serializeTargets() + ' :' + this.getBody();
	}

	applyParsedParameters(middle_parameters, trailing_parameter) {
		this.setTargetStrings(middle_parameters);
		this.setBody(trailing_parameter);
	}

}

extend(StatsConnMessage.prototype, {

	reply_numeric: ReplyNumerics.RPL_STATSCONN

});

module.exports = StatsConnMessage;
