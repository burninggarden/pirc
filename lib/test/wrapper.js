
var
	Promix = require('promix');

var
	add           = require('../utility/add'),
	extend        = require('../utility/extend'),
	TextFormatter = require('../utility/text-formatter'),
	Client        = require('../client');


class Test_Wrapper {

	constructor() {
		this.clients = [ ];
		this.servers = [ ];
	}

	setKey(key) {
		this.key = key;
		return this;
	}

	getKey() {
		return this.key;
	}

	setMethod(method) {
		this.method = method;
		return this;
	}

	getMethod() {
		return this.method;
	}

	setTest(test) {
		this.test = test;
		return this;
	}

	getTest() {
		return this.test;
	}

	setServerFactory(server_factory) {
		this.server_factory = server_factory;
		return this;
	}

	getServerFactory() {
		return this.server_factory;
	}

	createServer(options) {
		if (!options) {
			options = { };
		}

		if (!options.port) {
			options.port = this.incrementPort();
		}

		var server = this.createServerWithOptions(options);

		add(server).to(this.servers);

		return server;
	}

	incrementPort() {
		return this.current_port++;
	}

	createClient(options) {
		var client = this.createClientWithOptions(options);

		add(client).to(this.clients);

		if (options.port) {
			let parameters = {
				port: options.port
			};

			client.connectToServer(parameters, function handler(error) {
				if (error && options.autoregister !== false) {
					throw error;
				}
			});
		}

		return client;
	}

	createServerAndClient(server_options, client_options) {
		if (arguments.length === 1) {
			client_options = server_options;
			server_options = null;
		}

		if (!client_options) {
			client_options = { };
		}

		if (!server_options) {
			server_options = { };
		}

		var server = this.createServer(server_options);

		client_options.port = server.getPort();

		var client = this.createClient(client_options);

		return client;
	}

	createServerWithOptions(options) {
		if (!options) {
			options = { };
		}

		options = extend(this.getDefaultServerOptions(), options);

		return this.getServerFactory()(options);
	}

	getDefaultServerOptions() {
		return {
			port: this.incrementPort(),
			motd: 'test motd'
		};
	}

	createClientWithOptions(options) {
		if (!options) {
			options = { };
		}

		options = extend(this.getDefaultClientOptions(), options);

		return new Client(options);
	}

	getDefaultClientOptions() {
		return {
		};
	}

	run() {
		this.resetTimeout();
		this.getMethod()(this);
	}

	resetTimeout() {
		if (this.isFinished()) {
			throw new Error('Tried to reset timeout after test was finished');
		}

		this.clearTimeout();
		this.queueTimeout();
	}

	clearTimeout() {
		clearTimeout(this.timeout_timer);
	}

	queueTimeout() {
		this.timeout_timer = setTimeout(
			this.handleTimeout.bind(this),
			this.getTimeoutDelay()
		);
	}

	handleTimeout() {
		var
			key   = this.getKey(),
			delay = this.getTimeoutDelay();

		throw new Error(
			`Killing test ${key} after ${delay}ms of inactivity`
		);
	}

	getTimeoutDelay() {
		return this.timeout_delay;
	}

	done() {
		this.resetTimeout();

		var chain = Promix.chain();

		this.servers.forEach(function each(server) {
			chain.andCall(server.destroy).bind(server);
		});

		this.clients.forEach(function each(client) {
			chain.andCall(client.destroy).bind(client);
		});

		chain.then(this.finish).bind(this);
		chain.otherwise(this.handleError).bind(this);
	}

	finish() {
		this.clearTimeout();
		this.is_finished = true;
		this.getTest().done();
	}

	isFinished() {
		return this.is_finished;
	}

	bypass() {
		console.log(TextFormatter.yellow('BYPASSED'));
		this.done();
	}

	handleError(error) {
		this.ok(false, error.toString());
		this.finish();
	}

	ok() {
		this.resetTimeout();
		this.invokeTestMethod('ok', arguments);
	}

	expect() {
		this.resetTimeout();
		this.invokeTestMethod('expect', arguments);
	}

	equals() {
		this.resetTimeout();
		this.invokeTestMethod('equals', arguments);
	}

	deepEquals() {
		this.resetTimeout();
		this.invokeTestMethod('deepEqual', arguments);
	}

	deepEqual() {
		this.resetTimeout();
		this.invokeTestMethod('deepEqual', arguments);
	}

	invokeTestMethod(name, args) {
		if (this.isFinished()) {
			throw new Error(
				`Tried to invoke test method ${name} after test completion`
			);
		}

		var test = this.getTest();

		test[name].apply(test, args);
	}

}

extend(Test_Wrapper.prototype, {
	key:            null,
	method:         null,
	test:           null,
	current_port:   7654,
	timeout_timer:  null,
	timeout_delay:  5000,
	server_factory: null,
	is_finished:    false
});

module.exports = Test_Wrapper;
