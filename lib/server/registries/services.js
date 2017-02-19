
var
	add    = req('/utilities/add'),
	extend = req('/utilities/extend');


class ServiceRegistry {

	constructor() {
		this.services = [ ];
	}

	getServices() {
		return this.services;
	}

	addService(service) {
		add(service).to(this.getServices());
	}

	getServiceByType(service_type) {
		var
			index    = 0,
			services = this.getServices();

		while (index < services.length) {
			let service = services[index];

			if (service.getType() === service_type) {
				return service;
			}

			index++;
		}

		return null;
	}

}

extend(ServiceRegistry.prototype, {

	services: null

});

module.exports = ServiceRegistry;
