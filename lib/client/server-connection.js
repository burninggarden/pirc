var
	req = require('req');

var
	Net          = require('net'),
	EventEmitter = require('events').EventEmitter;

var
	defer      = req('/utilities/defer'),
	extend     = req('/utilities/extend'),
	isFunction = req('/utilities/is-function');

var
	AlreadyConnectedError = req('/lib/errors/already-connected'),
	InvalidCallbackError  = req('/lib/errors/invalid-callback');

var
	ServerConnectionEvents = req('/lib/client/server-connection/constants/events');

var
	SetterInterface           = req('/lib/client/server-connection/interfaces/setters'),
	ValidationInterface       = req('/lib/client/server-connection/interfaces/validation'),
	SocketEventInterface      = req('/lib/client/server-connection/interfaces/socket-events'),
	OutgoingMessagesInterface = req('/lib/client/server-connection/interfaces/outgoing-messages'),
	IncomingMessagesInterface = req('/lib/client/server-connection/interfaces/incoming-messages'),
	ChannelsInterface         = req('/lib/client/server-connection/interfaces/channels');

const
	DEFAULT_PORT     = 6667,
	DEFAULT_SSL      = false,
	DEFAULT_USERNAME = 'pirc',
	DEFAULT_REALNAME = 'pirc';


class ServerConnection extends EventEmitter {

	constructor(parameters) {
		super();

		this.queries  = [ ];
		this.modes    = [ ];

		this.setAddress(parameters.address);
		this.setNick(parameters.nick, null);

		if (parameters.port !== undefined) {
			this.setPort(parameters.port);
		}

		if (parameters.ssl !== undefined) {
			this.setSSL(parameters.ssl);
		}

		if (parameters.name !== undefined) {
			this.setName(parameters.name);
		} else {
			this.setName(parameters.address);
		}

		if (parameters.username !== undefined) {
			this.setUsername(parameters.username, null);
		}

		if (parameters.realname !== undefined) {
			this.setRealname(parameters.realname, null);
		}

		if (parameters.password !== undefined) {
			this.setPassword(parameters.password);
		}

		SetterInterface.init             .call(this, parameters);
		ValidationInterface.init         .call(this, parameters);
		SocketEventInterface.init        .call(this, parameters);
		OutgoingMessagesInterface.init   .call(this, parameters);
		IncomingMessagesInterface.init   .call(this, parameters);
		ChannelsInterface.init           .call(this, parameters);
	}

	isRegistered() {
		return this.registered === true;
	}

	isConnected() {
		return this.connected === true;
	}

	connect(callback) {
		if (!isFunction(callback)) {
			throw new InvalidCallbackError();
		}

		if (this.isConnected()) {
			return void defer(callback, new AlreadyConnectedError());
		}

		this.socket = Net.createConnection({
			host: this.address,
			port: this.port
		});

		this.bindSocketEvents();

		function handleSuccess() {
			this.removeListener(
				ServerConnectionEvents.CONNECTION_FAILURE,
				handleFailure
			);

			return void callback(null);
		}

		function handleFailure(error) {
			this.removeListener(
				ServerConnectionEvents.CONNECTION_SUCCESS,
				handleSuccess
			);

			return void callback(error);
		}

		this.once(ServerConnectionEvents.CONNECTION_SUCCESS, handleSuccess);
		this.once(ServerConnectionEvents.CONNECTION_FAILURE, handleFailure);
	}

}

extend(ServerConnection.prototype, {
	address    : null,
	port       : DEFAULT_PORT,
	ssl        : DEFAULT_SSL,
	name       : null,
	password   : null,

	nick       : null,
	username   : DEFAULT_USERNAME,
	realname   : DEFAULT_REALNAME,
	modes      : null,

	queries    : null,

	registered : false,
	connected  : false,
	socket     : null
});

function applyInterface(connection_interface) {
	// Don't copy over the "init" methods from these interfaces.
	// We want to keep the version defined above intact, which is responsible
	// for calling each of the uncopied init methods on these interfaces in turn.
	var keys_to_exclude = ['init'];

	var throw_error_on_collision = true;

	extend(
		ServerConnection.prototype,
		SetterInterface,
		keys_to_exclude,
		throw_error_on_collision
	);
}

applyInterface(SetterInterface);
applyInterface(ValidationInterface);
applyInterface(SocketEventInterface);
applyInterface(OutgoingMessagesInterface);
applyInterface(IncomingMessagesInterface);
applyInterface(ChannelsInterface);




module.exports = ServerConnection;

