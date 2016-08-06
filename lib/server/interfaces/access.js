

module.exports = {

	getName() {
		this.validateName(this.name);
		return this.name;
	},

	setName(name) {
		this.validateName(name);
		this.name = name;
		return this;
	},

	getPort() {
		this.validatePort(this.port);
		return this.port;
	},

	setPort(port) {
		this.validatePort(port);
		this.port = port;
		return this;
	}

};
