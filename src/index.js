import KlasaDashboardHooks from './lib/klasa/KlasaDashboardHooks.js';

export default class BotHooks {

	constructor(client) {
		this.type = [
			'klasa',
			'komada',
			'd.js',
			'discord.js',
			'eris',
			'd.io',
			'discord.io',
			'discordie'
		];
		this.client = client;
	}

	apiBind(type, options = null) {
		if (typeof type !== 'string') throw new TypeError('Type is not a string');
		if (!this.types.includes(type.toLowerCase())) throw new Error('Incorrect library type');
		if (type === 'klasa') {
			return new KlasaDashboardHooks(this.client, options);
		}
		throw new Error('Please specify a library or framework type');
	}

}
