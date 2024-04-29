/** @param {string} name */
function getCookie(name) {
	if (!name) throw new Error("[getCookie()] name not provided");
	const cookieValue = document.cookie.match("(^|;)\\s*" + name + "=([^;]*)");
	return cookieValue ? cookieValue.pop() : "";
}

/**
 * @param {string} name - The name of the cookie.
 * @param {string} value - The value of the cookie.
 * @param {number} [days=30] - The number of days until the cookie expires. If not provided, defaults to 30 days.
 * @param {string} [path='/'] - The path on the server where the cookie is valid. Defaults to '/'.
 */
function setCookie(name, value, days = 30, path = "/") {
	if (!name) throw new Error("[setCookie()] name not provided");

	const expiryDate = days ? new Date(new Date().getTime() + days * 24 * 60 * 60 * 1000).toUTCString() : "";
	document.cookie = `${name}=${encodeURIComponent(value)}${expiryDate ? `;expires=${expiryDate}` : ""};path=${path}`;
}

/**
 * @param {string} name - The name of the cookie to remove.
 */
function removeCookie(name) {
	setCookie(name, "", -1);
}

module.exports = { getCookie, setCookie, removeCookie };
