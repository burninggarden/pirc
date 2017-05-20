

function toArray(array_like) {
	return Array.prototype.slice.call(array_like);
}

module.exports = toArray;
