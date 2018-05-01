const { Client: djsClient } = require('discord.js');

/**
 * @param {*[][]} array An array of arrays to sum
 * @returns {*}
 */
const sumFirstElements = array => array.reduce((sum, element) => sum + element[0], 0);

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
			return shard.broadcastEval(`[${expression}]`).then(sumFirstElements);
		} else {
			if (!shard) return shard.broadcastEval(`[${expression}]`);
			return expression;
		}
	}

}

module.exports = ToShard;
