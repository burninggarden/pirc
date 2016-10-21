
const COLOR_RESET_CODE = '39;49';

const STYLES = {
	BOLD:          'bold',
	DIM:           'dim',
	ITALIC:        'italic',
	UNDERLINE:     'underline',
	INVERSE:       'inverse',
	STRIKETHROUGH: 'strikethrough',

	BLACK:         'black',
	RED:           'red',
	GREEN:         'green',
	YELLOW:        'yellow',
	BLUE:          'blue',
	MAGENTA:       'magenta',
	CYAN:          'cyan',
	WHITE:         'white',
	GREY:          'grey'
};

const ASCII_CODES = {
	[STYLES.BLACK]:         [30, COLOR_RESET_CODE],
	[STYLES.RED]:           [31, COLOR_RESET_CODE],
	[STYLES.GREEN]:         [32, COLOR_RESET_CODE],
	[STYLES.YELLOW]:        [33, COLOR_RESET_CODE],
	[STYLES.BLUE]:          [34, COLOR_RESET_CODE],
	[STYLES.MAGENTA]:       [35, COLOR_RESET_CODE],
	[STYLES.CYAN]:          [36, COLOR_RESET_CODE],
	[STYLES.WHITE]:         [37, COLOR_RESET_CODE],
	[STYLES.GREY]:          [38, COLOR_RESET_CODE],

	// TODO: check the bold style:
	[STYLES.BOLD]:          [1, 22],
	[STYLES.DIM]:           [2, 22],
	[STYLES.ITALIC]:        [3, 23],
	[STYLES.UNDERLINE]:     [4, 24],
	[STYLES.INVERSE]:       [7, 27],
	[STYLES.STRIKETHROUGH]: [9, 29]
};

class TextFormatter {

	wrap(text, ascii_codes) {
		var
			start_code = ascii_codes[0],
			end_code   = ascii_codes[1];

		return '\x1b[' + start_code + 'm' + text + '\x1b[' + end_code + 'm';
	}

	wrapTextWithStyle(text, style) {
		return this.wrap(text, ASCII_CODES[style]);
	}

	bold(text) {
		return this.wrapTextWithStyle(text, STYLES.BOLD);
	}

	dim(text) {
		return this.wrapTextWithStyle(text, STYLES.DIM);
	}

	italic(text) {
		return this.wrapTextWithStyle(text, STYLES.ITALIC);
	}

	underline(text) {
		return this.wrapTextWithStyle(text, STYLES.UNDERLINE);
	}

	inverse(text) {
		return this.wrapTextWithStyle(text, STYLES.INVERSE);
	}

	strikethrough(text) {
		return this.wrapTextWithStyle(text, STYLES.STRIKETHROUGH);
	}

	black(text) {
		return this.wrapTextWithStyle(text, STYLES.BLACK);
	}

	red(text) {
		return this.wrapTextWithStyle(text, STYLES.RED);
	}

	green(text) {
		return this.wrapTextWithStyle(text, STYLES.GREEN);
	}

	yellow(text) {
		return this.wrapTextWithStyle(text, STYLES.YELLOW);
	}

	blue(text) {
		return this.wrapTextWithStyle(text, STYLES.BLUE);
	}

	magenta(text) {
		return this.wrapTextWithStyle(text, STYLES.MAGENTA);
	}

	cyan(text) {
		return this.wrapTextWithStyle(text, STYLES.CYAN);
	}

	white(text) {
		return this.wrapTextWithStyle(text, STYLES.WHITE);
	}

	grey(text) {
		return this.wrapTextWithStyle(text, STYLES.GREY);
	}

}

module.exports = new TextFormatter();
