const { Client: djsClient } = require('discord.js');

class ToShard {

	constructor(client) {
		if (!(client instanceof djsClient)) throw new TypeError('The type must be something that uses discord.js or discord.js it self');
		this.client = client;
	}

	async toShard(expression, combine = null) { // eslint-disable-line
		if (!this.client.shard && combine === true) throw new Error('You cannot combine a non sharded expression');
		if (!combine) {
			if (!this.client.shard) {
				const evaluations = await this.client.shard.broadcastEval(expression);
				return evaluations;
			}
			return expression;
		} else if (combine === true) {
			let data = 0;
			const evaluations = await this.client.shard.broadcastEval(expression);
			for (const evaluation of evaluations) {
				data += evaluation[0];
			}
			return data;
		}
		if (!expression) throw new Error('Please provide an expression');
	}

}

module.exports = ToShard;
