
const BASE_PATH = __dirname.split('pirc')[0] + 'pirc';

function req(path) {
	return require(BASE_PATH + path);
}

module.exports = global.req = req;
