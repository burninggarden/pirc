var
	extend = req('/utilities/extend');


class Channel {

	constructor(name) {
		this.name = name;
	}

}

extend(Channel.prototype, {
	name: null
});

module.exports = Channel;
