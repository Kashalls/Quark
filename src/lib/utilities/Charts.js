const { promisify } = require('util');
const { writeFile } = require('fs-nextra');
try {
	var exporter = require('highcharts-export-server');
	if (!exporter.initPool) exporter = null;
} catch (err) { } // eslint-disable-line no-empty
const render = promisify(exporter.export);
exporter.initPool();

class Chart {

	constructor() {
		this.type = 'png';
		this.options = {};
		this.options.credits = {};
		this.options.credits.enabled = false;
		this.options.chart = {};
		this.options.chart.backgroundColor = '#2C2F33';
		this.options.chart.borderColor = '#3498DB';
		this.options.chart.borderWidth = 2;
		this.options.title = {};
		this.options.title.style = {};
		this.options.title.style.color = '#FFFFFF';
		this.options.title.style.fontWeight = 'bold';
		this.options.xAxis = {};
		this.options.xAxis.type = 'datetime';
		this.options.xAxis.labels = { style: { color: '#FFFFFF' } };
		this.options.yAxis = {};
		this.options.yAxis.title = { text: null };
		this.options.yAxis.labels = { style: { color: '#FFFFFF' } };
		this.options.legend = {};
		this.options.legend.itemStyle = {};
		this.options.legend.itemStyle.color = '#FFFFFF';
		this.options.legend.itemStyle.fontWeight = 'bold';
		this.options.plotOptions = {};
		this.options.plotOptions.series = {};
		this.options.series = [];
	}

	async generateChart(location) {
		const res = await render(this);
		const data = res.data.replace(/^data:image\/\w+;base64,/, '');
		return writeFile(location, data, 'base64');
	}

}

module.exports = Chart;
