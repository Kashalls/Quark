const { Client: djsClient } = require('discord.js');

/**
 * Add all the elements of the array
 * @param {Array} array The array
 * @returns {number} The sum
 */
const arraySum = array => array.reduce((partialSum, element) => partialSum + element, 0);

class ToShard {

	constructor(client) {
		if (!(client instanceof djsClient)) throw new TypeError('The type must be something that uses discord.js or discord.js it self');
		this.client = client;
	}

	async toShard(expression, combine = false) {
		if (!expression) throw new Error('Please provide an expression');

		const { shard } = this.client;

		if (combine) {
			if (!shard) throw new Error('You cannot combine a non sharded expression');
			return shard.broadcastEval(expression).then(arraySum);
		} else {
			if (!shard) return shard.broadcastEval(expression);
			return expression;
		}
	}

}

module.exports = ToShard;
