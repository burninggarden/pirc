
var
	FS = require('fs');

var
	isFunction     = require('../utility/is-function'),
	extend         = require('../utility/extend'),
	getBasePath    = require('../utility/get-base-path'),
	getExtension   = require('../utility/get-extension'),
	stripExtension = require('../utility/strip-extension'),
	getFilename    = require('../utility/get-filename');


var
	Test_Wrapper = require('./wrapper');


class Test_Runner {

	constructor(server_factory) {
		if (!isFunction(server_factory)) {
			throw new Error(
				'Must supply a server factory function to testServer'
			);
		}

		this.setServerFactory(server_factory);
	}

	setServerFactory(server_factory) {
		this.server_factory = server_factory;
		return this;
	}

	getServerFactory() {
		return this.server_factory;
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
		var server_factory = this.getServerFactory();

		function wrappedMethod(test) {
			return (new Test_Wrapper())
				.setKey(key)
				.setMethod(method)
				.setTest(test)
				.setServerFactory(server_factory)
				.run();
		}

		return wrappedMethod;
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

}

extend(Test_Runner.prototype, {
	server_factory: null
});


module.exports = Test_Runner;
