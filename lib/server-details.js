
var
	HostnameValidator = req('/validators/hostname'),
	PortValidator     = req('/validators/port'),
	extend            = req('/utilities/extend');

class ServerDetails {

	setHostname(hostname) {
		HostnameValidator.validate(hostname);
		this.hostname = hostname;
		return this;
	}

	getHostname() {
		HostnameValidator.validate(this.hostname);
		return this.hostname;
	}

	getIdentifier() {
		return this.getHostname();
	}

	setPort(port) {
		this.validatePort(port);

		this.port = port;
	}

	getPort() {
		this.validatePort(this.port);

		return this.port;
	}

	validatePort(port) {
		PortValidator.validate(port);
	}

}

ServerDetails.fromIdentifier = function fromIdentifier(identifier) {
	var server_details = new ServerDetails();

	server_details.setHostname(identifier);

	return server_details;
};

extend(ServerDetails.prototype, {
	hostname: null,
	port:     null
});

module.exports = ServerDetails;
