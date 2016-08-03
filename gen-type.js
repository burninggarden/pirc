var fs = require('fs');

var base_path = __dirname.split('pirc')[0] + 'pirc';

function uppercase(string) {
	return string[0].toUpperCase() + string.slice(1);
}

var filename = process.argv[2];

if (!filename) {
	throw new Error('invalid filename: ' + filename);
}

var response_code = process.argv[3];

if (isNaN(parseInt(response_code))) {
	throw new Error('invalid response_code: ' + response_code);
}

var classname = filename.split('-').map(uppercase).join('');

var response_type = filename.split('-').join('').toUpperCase();

var response_code_file_contents = fs.readFileSync(base_path + '/constants/response-codes.js', 'utf8');

var lines = response_code_file_contents.split('\n');

var result = '';

function getResponseCodeForLine(line) {
	line = line.trim();

	var trailing = line.slice(-6);

	if (trailing.slice(0, 2) === '//') {
		let code = trailing.slice(3);

		if (!isNaN(parseInt(code))) {
			return code;
		}
	}

	return null;
}

var written = false;

lines.forEach(function each(line) {
	var sibling_response_code = parseInt(line.slice(2, 5));

	if (!written && sibling_response_code && parseInt(response_code) < parseInt(sibling_response_code)) {
		result += `\t'${response_code}': ResponseTypes.${response_type},\n`;
		written = true;
	}

	if (!written && line.trim() === '};') {
		result += `\t'${response_code}': ResponseTypes.${response_type},\n`;
		written = true;
	}

	result += line;
	result += '\n';
});

fs.writeFileSync(base_path + '/constants/response-codes.js', result, 'utf8');

var response_type_file_contents = fs.readFileSync(base_path + '/constants/response-types.js', 'utf8');

var lines = response_type_file_contents.split('\n');

var result = '';

function pad(string, length) {
	while (string.length < length) {
		string += ' ';
	}

	return string;
}

var written = false;

var padded_response_type = pad(response_type + ':', 24);

var padded_rfc_key = pad("'RPL_" + response_type + "',", 32);

lines.forEach(function each(line) {
	var sibling_response_code = getResponseCodeForLine(line);

	if (!written && sibling_response_code && parseInt(response_code) < parseInt(sibling_response_code)) {
		result += `\t${padded_response_type}${padded_rfc_key}// ${response_code}\n`;
		written = true;
	}

	if (!written && line.trim() === '};') {
		result += `\t${padded_response_type}${padded_rfc_key}// ${response_code}\n`;
		written = true;
	}

	result += line + '\n';
});

fs.writeFileSync(base_path + '/constants/response-types.js', result, 'utf8');


var mapping_file_contents = fs.readFileSync(base_path + '/mappings/response-types-to-constructors.js', 'utf8');

var result = '';

var padded_response_type = pad(`[ResponseTypes.${response_type}]:`, 32);

var padded_load_call = pad(`load('${filename}'),`, 32);

var written = false;

mapping_file_contents.split('\n').forEach(function each(line) {
	var sibling_response_code = getResponseCodeForLine(line);

	if (!written && sibling_response_code && parseInt(response_code) < parseInt(sibling_response_code)) {
		result += `\t${padded_response_type}${padded_load_call}// ${response_code}\n`;
		written = true;
	}

	if (!written && line.trim() === '};') {
		result += `\t${padded_response_type}${padded_load_call}// ${response_code}\n`;
		written = true;
	}

	result += line + '\n';
});

fs.writeFileSync(base_path + '/mappings/response-types-to-constructors.js', result, 'utf8');

var file_path = base_path + '/lib/messages/server/' + filename + '.js';

if (fs.existsSync(file_path)) {
	// throw new Error('file path ' + file_path + ' already exists, aborting');
}

var file_contents = `
var req = require('req');

var
	extend        = req('/utilities/extend'),
	ServerMessage = req('/lib/messages/server'),
	ResponseTypes = req('/constants/response-types');

class Server${classname}Message extends ServerMessage {

	setMessageParts(message_parts) {
	}

}

extend(Server${classname}Message.prototype, {

	response_type: ResponseTypes.${response_type}

});

module.exports = Server${classname}Message;
`;

fs.writeFileSync(file_path, file_contents, 'utf8');
