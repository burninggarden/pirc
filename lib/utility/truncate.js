
// There isn't much reason for this module to exist, except that maybe
// "truncate" a little more semantically meaningful than "splice".

function truncate(array, length) {
	array.splice(length);
}

module.exports = truncate;
