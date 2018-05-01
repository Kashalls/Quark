const KlasaDashboardHooks = require('./lib/dashboard/klasa/KlasaDashboardHooks.mjs');
const KomadaDashboardHooks = require('./lib/dashboard/komada/KomadaDashboardHooks.mjs');
const ErisDashboardHooks = require('./lib/dashboard/eris/ErisDashboardHooks.mjs');

const { types } = require('./lib/utilities/Constants.mjs');

module.exports = class Quark {

	constructor(client) {
		this.type = types;
		this.client = client;
	}

	apiBind(type, privateKey, options = null) {
		if (typeof type !== 'string') throw new TypeError('Type is not a string');
		if (!this.types.includes(type.toLowerCase())) throw new Error('Incorrect library type');
		if (type === 'klasa') {
			return new KlasaDashboardHooks(this.client, privateKey, options);
		} else if (type === 'komada') {
			return new KomadaDashboardHooks(this.client, options);
		} else if (type === 'eris') {
			return new ErisDashboardHooks(this.client, options);
		}
		throw new Error('Please specify a library or framework type');
	}

};
