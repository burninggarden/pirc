var req = require('req');
var
	extend        = req('/utilities/extend'),
	add           = req('/utilities/add'),
	remove        = req('/utilities/remove'),
	Service       = req('/lib/server/service'),
	TimeIntervals = req('/constants/time-intervals');

const
	PING_INTERVAL = TimeIntervals.ONE_SECOND * 5,
	PONG_TIMEOUT  = TimeIntervals.ONE_SECOND * 2.5;

class PingService extends Service {

	constructor() {
		super();

		this.clients = [ ];
		this.client_ping_times = { };
		this.client_pong_times = { };

		setInterval(this.checkAllClientTimes.bind(this), 1000);
	}

	registerClient(client) {
		add(client).to(this.clients);

		var id = client.getId();

		this.client_ping_times[id] = 0;
		this.client_pong_times[id] = 0;
	}

	unregisterClient(client) {
		remove(client).from(this.clients);
	}

	handleClientMessage(client, message) {
	}

	checkAllClientTimes() {
		this.clients.forEach(this.checkClientTimes, this);
	}

	shouldSendPingToClient(client) {
		var
			id        = client.getId(),
			ping_time = this.client_ping_times[id],
			delta     = Date.now() - ping_time;

		console.log('[  ' + delta + '  ]');

		return delta > PING_INTERVAL;
	}

	isClientOverPongTimeout(client) {
		var
			id        = client.getId(),
			ping_time = this.client_ping_times[id],
			pong_time = this.client_pong_times[id];

		if (pong_time > ping_time) {
			return false;
		}

		var delta = Date.now() - ping_time;

		return delta > PONG_TIMEOUT;
	}

	sendPingToClient(client) {
		throw new Error('working here');
	}

	checkClientTimes(client) {
		if (this.shouldSendPingToClient(client)) {
			this.sendPingToClient(client);
		} else if (this.isClientOverPongTimeout(client)) {
			this.killClient(client);
		}
	}

}

extend(PingService.prototype, {
	clients: null,
	client_ping_times: null,
	client_pong_times: null
});

module.exports = PingService;
