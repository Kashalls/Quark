module.exports = {
	Master: require('./master.js'),
	Constants: require('./lib/utilities/Constants.mjs'),
	version: require('../package.json').version,

	Chart: require('./lib/utilities/Charts.js')
};
