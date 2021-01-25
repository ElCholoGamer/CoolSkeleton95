Math.clamp = function (num, min, max) {
	return Math.min(max, Math.max(num, min));
};

Math.randomInt = function (min, max) {
	return Math.floor(Math.random() * (max - min)) + min;
};
