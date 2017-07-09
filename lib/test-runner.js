
var
	FS     = require('fs'),
	Promix = require('promix');

var
	isFunction     = req('/lib/utilities/is-function'),
	extend         = req('/lib/utilities/extend'),
	getBasePath    = req('/lib/utilities/get-base-path'),
	getExtension   = req('/lib/utilities/get-extension'),
	stripExtension = req('/lib/utilities/strip-extension'),
	getFilename    = req('/lib/utilities/get-filename'),
	TextFormatter  = req('/lib/utilities/text-formatter');

var
	Client = req('/lib/client');


class TestRunner {

	constructor(createServer) {
		if (!isFunction(createServer)) {
			throw new Error('Must supply a createServer() function to testServer');
		}

		this.createServer = createServer;
	}

	standardizeTestKey(key) {
		key = key.replace(/_/g, ' ');

		if (key[0].toUpperCase() === key[0]) {
			return key;
		}

		var
			result = key[0].toUpperCase(),
			index  = 1;

		while (index < key.length) {
			let character = key[index];

			if (character.toUpperCase() === character) {
				result += ' ';
			}

			result += character.toLowerCase();

			index++;
		}

		return result;
	}

	readDirectoryRecursively(directory, path) {
		if (!FS.existsSync(path)) {
			if (FS.existsSync(path + '.js')) {
				path += '.js';
			} else {
				throw new Error('Test path not found: ' + path);
			}
		}

		if (getExtension(path) === 'js') {
			let
				filename = getFilename(path),
				key      = stripExtension(filename);

			key = this.standardizeTestKey(key);

			return extend(directory, {
				[key]: this.wrapTestExportsForPath(path)
			});
		}

		var files = FS.readdirSync(path);

		files.forEach(function each(file) {
			var
				subdirectory,
				resolved_path = path + '/' + file,
				stats = FS.statSync(resolved_path),
				key;

			if (stats.isDirectory()) {
				// TODO:
				// save a list of directories, and don't read them
				// until the end to prevent too many files being open simultaneously
				file = this.standardizeTestKey(file);

				subdirectory = directory[file] = { };

				return void this.readDirectoryRecursively(
					subdirectory,
					resolved_path
				);
			}


			if (getExtension(file) !== 'js') {
				return;
			}

			key = stripExtension(file);

			key = this.standardizeTestKey(key);

			if (directory[key] !== undefined) {
				if (typeof directory[key] === 'function') {
					throw new Error(
						'Testcase ' + key
						+ ' overwritten by nested module'
						+ ' (in ' + path + ')'
					);
				}

				directory[key] = extend(
					directory[key],
					this.wrapTestExportsForPath(resolved_path),
					path
				);
			} else {
				directory[key] = this.wrapTestExportsForPath(resolved_path);
			}
		}, this);

		return directory;
	}

	wrapTestExportsForPath(path) {
		var exports = require(path);

		path = path.replace(/_/g, ' ');

		if (isFunction(exports)) {
			return this.wrapTestMethod(path, exports);
		}

		var
			result = { },
			key;

		for (key in exports) {
			let property = exports[key];

			key = this.standardizeTestKey(key);

			if (isFunction(property)) {
				result[key] = this.wrapTestMethod(key, property);
			} else {
				result[key] = property;
			}
		}

		return result;
	}

	wrapTestMethod(key, method) {
		var
			port    = this.getStartingPort(),
			servers = [ ],
			clients = [ ];

		function createServer(options) {
			if (!options) {
				options = { };
			}

			if (!options.port) {
				options.port = port++;
			}

			var server = this.createServerWithOptions(options);

			servers.push(server);

			return server;
		}

		function createClient(options) {
			var client = this.createClientWithOptions(options);

			clients.push(client);

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

		function createServerAndClient(server_options, client_options) {
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

			var server = createServer.call(this, server_options);

			client_options.port = server.getPort();

			var client = createClient.call(this, client_options);

			return client;
		}

		function wrappedTestMethod(test) {

			var timeout_delay = this.getTimeoutDelay();

			var timeout_timer = setTimeout(function deferred() {
				throw new Error(
					`Killing test ${key} after ${timeout_delay}ms of inactivity`
				);
			}, timeout_delay);

			function wrappedDone() {
				var chain = Promix.chain();

				servers.forEach(function each(server) {
					chain.andCall(server.destroy).bind(server);
				});

				clients.forEach(function each(client) {
					chain.andCall(client.destroy).bind(client);
				});

				chain.then(function finisher() {
					clearTimeout(timeout_timer);
					test.done();
				});

				chain.otherwise(function failure(error) {
					throw error;
				});
			}

			function bypassTest() {
				console.log(TextFormatter.yellow('BYPASSED'));
				wrappedDone.call(this);
			}

			method({
				ok:                    test.ok.bind(test),
				expect:                test.expect.bind(test),
				equals:                test.equals.bind(test),
				done:                  wrappedDone.bind(this),
				createServer:          createServer.bind(this),
				createClient:          createClient.bind(this),
				createServerAndClient: createServerAndClient.bind(this),
				bypass:                bypassTest.bind(this)
			});
		}

		return wrappedTestMethod.bind(this);
	}

	getTimeoutDelay() {
		// Five second timeout threshold:
		return 5000;
	}

	getTests(section) {
		var tests = this.readDirectoryRecursively({ }, this.getTestPath());

		if (!section) {
			return tests;
		}

		var section_result = this.getSectionFromTests(section, tests);

		return {
			[section]: section_result
		};
	}

	getSectionFromTests(section, tests) {
		var key;

		for (key in tests) {
			if (key.indexOf(section) === 0) {
				return tests[key];
			} else if (typeof tests[key] === 'object') {
				let result = this.getSectionFromTests(section, tests[key]);

				if (result) {
					return result;
				}
			}
		}

		return null;
	}

	getReporter() {
		var reporters = require('nodeunit/lib/reporters');

		return reporters.default;
	}

	getTestPath() {
		return getBasePath() + '/tests/';
	}

	getStartingPort() {
		return this.starting_port;
	}

	run(section) {
		this.addUncaughtExceptionHandler();

		this.getReporter().run(
			this.getTests(section),
			null,
			this.handleTestsComplete.bind(this)
		);
	}

	handleTestsComplete(error) {
		if (error) {
			process.exit(1);
		} else {
			process.exit(0);
		}
	}

	addUncaughtExceptionHandler() {
		process.on('uncaughtException', this.handleUncaughtException.bind(this));
	}

	handleUncaughtException(error) {
		console.error(error);
		process.exit(1);
	}

	createServerWithOptions(options) {
		if (!options) {
			options = { };
		}

		options = extend(this.getDefaultServerOptions(), options);

		return this.createServer(options);
	}

	getDefaultServerOptions() {
		return {
			port: this.getStartingPort(),
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

}

extend(TestRunner.prototype, {
	starting_port: 7654
});


module.exports = TestRunner;
