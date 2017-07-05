var isString = req('/lib/utilities/is-string');


function validate(name) {
	if (!isString(name)) {
		throw new Error('Invalid server name: ' + name);
	}
}


module.exports = {
	validate
};
