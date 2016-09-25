var
	Service = req('/lib/server/service');

class MotdService extends Service {

	registerClient(client) {
		this.sendMotdStartToClient(client);
		this.sendMotdToClient(client);
		this.sendMotdEndToClient(client);
	}

}

module.exports = MotdService;
