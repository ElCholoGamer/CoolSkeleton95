Array.prototype.random = function () {
	return this[Math.floor(Math.random() * this.length)];
};

Array.prototype.chunk = function (chunkSize) {
	const count = Math.ceil(this.length / chunkSize);
	return [...Array(count)].map((e, index) => {
		const start = index * chunkSize;
		return this.slice(start, start + chunkSize);
	});
};
