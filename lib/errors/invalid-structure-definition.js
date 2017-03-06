
var
	extend     = req('/utilities/extend'),
	BaseError  = req('/lib/errors/base'),
	ErrorCodes = req('/constants/error-codes');

class InvalidStructureDefinitionError extends BaseError {

	setMessage() {
		var serialized_structure = JSON.stringify(this.value);

		this.message = 'Invalid structure definition: ' + serialized_structure;
	}

}

extend(InvalidStructureDefinitionError.prototype, {
	code:   ErrorCodes.INVALID_STRUCTURE_DEFINITION,
	reason: false
});

module.exports = InvalidStructureDefinitionError;
