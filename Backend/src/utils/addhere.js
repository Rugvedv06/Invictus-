export const pick = (obj, keys = []) =>
	keys.reduce((acc, key) => {
		if (Object.prototype.hasOwnProperty.call(obj, key) && obj[key] !== undefined) {
			acc[key] = obj[key];
		}
		return acc;
	}, {});

export const toInt = (value, fallback = 0) => {
	const num = Number.parseInt(value, 10);
	return Number.isNaN(num) ? fallback : num;
};

export const toNumber = (value, fallback = null) => {
	if (value === undefined || value === null || value === '') return fallback;
	const num = Number(value);
	return Number.isNaN(num) ? fallback : num;
};