module.exports = {
	Master: require('./master.js'),
	Constants: require('./lib/utilities/Constants.mjs'),
	ToShard: require('./lib/utilities/ToShard.js'),
	version: require('../package.json').version,

	Chart: require('./lib/utilities/Charts.js'),

	KlasaDashboardHooks: require('./lib/dashboard/klasa/KlasaDashboardHooks.mjs'),
	KomadaDashboardHooks: require('./lib/dashboard/komada/KomadaDashboardHooks.mjs'),
	ErisDashboardHooks: require('./lib/dashboard/eris/ErisDashboardHooks.mjs'),
	DiscordJsDashboardHooks: require('./lib/dashboard/discordjs/DiscordJsDashboardHooks.mjs')
};
