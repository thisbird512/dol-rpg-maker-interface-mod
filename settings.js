/**
 * Settings for the game, also manages state (kind of)
 *
 * @type {{
 *  textSpeed: {
 * 		min: number,
 * 		max: number,
 * 		value: number
 * 		increase: () => void,
 * 		decrease: () => void,
 * 		skip: () => void
 * 	}
 * }}
 */
const SETTINGS = {
	textSpeed: {
		value: 4,
		min: 1,
		max: 4,
		increase: () => (SETTINGS.textSpeed.value = Math.min(SETTINGS.textSpeed.value + 1, SETTINGS.textSpeed.max)),
		decrease: () => (SETTINGS.textSpeed.value = Math.max(SETTINGS.textSpeed.value - 1, SETTINGS.textSpeed.min)),
		skip: () => (SETTINGS.textSpeed.value = -1),
	},
};

module.exports = { SETTINGS };
