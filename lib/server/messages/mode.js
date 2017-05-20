
var
	extend      = req('/lib/utilities/extend'),
	extendClass = req('/lib/utilities/extend-class');

var
	ServerMessage = req('/lib/server/message'),
	ModeInterface = req('/lib/interfaces/messages/mode');


class ServerModeMessage extends ServerMessage {

	setIsFromServer(is_from_server) {
		this.is_from_server = is_from_server;
	}

	/**
	 * Override the parent class's default isFromServer() method in order to
	 * allow consumers of this class to override the result. This is necessary
	 * in order to allow server mode messages to originate from clients in
	 * certain situations, but from the server in others.
	 *
	 * @returns {boolean}
	 */
	isFromServer() {
		return this.is_from_server;
	}

}

extendClass(ServerModeMessage).withInterface(ModeInterface);

extend(ServerModeMessage.prototype, {
	is_from_server: true
});


module.exports = ServerModeMessage;
