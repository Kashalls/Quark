/*
MIT License

Copyright (c) 2018 Dirigeants

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/

import * as Polkaa from 'polka';
const Polka = new Polkaa().constructor;

import Klasa, { Duration } from 'klasa';
const { util: { isFunction } } = Klasa;

export default class KlasaDashboardHooks extends Polka {

	constructor(client, options = {
		port: 3000,
		origin: '*'
	}) {
		super();

		this.client = client;

		this.origin = options.origin;

		this.use(this.setHeaders.bind(this));

		this.get('api/application', (request, response) => response.end(JSON.stringify({
			commandCount: this.client.commands.size,
			eventCount: this.client.events.size,
			monitorCount: this.client.monitors.size,
			extandableCount: this.client.extandables.size,
			inhibitorCount: this.client.inhibitors.size,
			finalizerCount: this.client.finalizers.size,
			tasksCount: this.client.tasks.size,
			users: this.client.users.size,
			guilds: this.client.guilds.size,
			channels: this.client.channels.size,
			shards: this.client.options.shardCount,
			uptime: Duration.toNow(Date.now() - (process.uptime() * 1000)),
			latency: this.client.ping.toFixed(0),
			memory: process.memoryUsage().heapUsed / 1024 / 1024,
			invite: this.client.invite,
			...this.client.application
		})));

		this.get('api/users', (request, response) => response.end(JSON.stringify(this.client.users.keyArray())));

		this.get('api/users/:userID', (request, response) => {
			const { userID } = request.params;
			const user = this.client.users.get(userID);
			if (!user) response.end('{}');
			return response.end(JSON.stringify(user));
		});

		this.get('api/guilds', (request, response) => response.end(JSON.stringify(this.client.guilds.keyArray())));

		this.get('api/guilds/:guildID', (request, response) => {
			const { guildID } = request.params;
			const guild = this.client.guilds.get(guildID);
			if (!guild) response.end('{}');
			return response.end(JSON.stringify(guild));
		});

		this.get('api/guilds/:guildID/members', (request, response) => {
			const { guildID } = request.params;
			const guild = this.client.guilds.get(guildID);
			if (!guild) response.end('[]');
			return response.end(JSON.stringify(guild.members.keyArray()));
		});

		this.get('api/guilds/:guildID/members/:memberID', (request, response) => {
			const { guildID, memberID } = request.params;
			const guild = this.client.guilds.get(guildID);
			if (!guild) return response.end('{}');
			const member = guild.members.get(memberID);
			if (!member) return response.end('{}');
			return response.end(JSON.stringify(member));
		});

		this.get('api/guilds/:guildID/roles', (request, response) => {
			const { guildID } = request.params;
			const guild = this.client.guilds.get(guildID);
			if (!guild) response.end('[]');
			return response.end(JSON.stringify(guild.roles.keyArray()));
		});

		this.get('api/guilds/:guildID/roles/:roleID', (request, response) => {
			const { guildID, roleID } = request.params;
			const guild = this.client.guilds.get(guildID);
			if (!guild) return response.end('{}');
			const role = guild.members.get(roleID);
			if (!role) return response.end('{}');
			return response.end(JSON.stringify(role));
		});

		this.get('api/guilds/:guildID/channels', (request, response) => {
			const { guildID } = request.params;
			const guild = this.client.guilds.get(guildID);
			if (!guild) response.end('[]');
			return response.end(JSON.stringify(guild.channels.keyArray()));
		});

		this.get('api/guilds/:guildID/channels/:channelID', (request, response) => {
			const { guildID, channelID } = request.params;
			const guild = this.client.guilds.get(guildID);
			if (!guild) return response.end('{}');
			const channel = guild.members.get(channelID);
			if (!channel) return response.end('{}');
			return response.end(JSON.stringify(channel));
		});

		this.get('api/commands', (request, response) => {
			const commands = {};
			const msg = { language: this.client.languages.default };
			this.client.commands.filter(cmd => cmd.permLevel <= options.maxPermLevel).forEach(cmd => {
				if (!commands.hasOwnProperty(cmd.category)) commands[cmd.category] = [];

				commands[cmd.category].push({
					name: cmd.name,
					aliases: cmd.aliases,
					description: isFunction(cmd.description) ? cmd.description(msg) : cmd.description,
					extendedHelp: isFunction(cmd.extendedHelp) ? cmd.extendedHelp(msg) : cmd.extendedHelp,
					botPerms: cmd.botPerms,
					category: cmd.catergory,
					cooldown: {
						usages: cmd.bucket,
						duration: cmd.cooldown
					},
					store: cmd.store,
					guarded: cmd.guarded,
					deletable: cmd.deletable,
					enabled: cmd.enabled,
					nsfw: cmd.nsfw,
					permLevel: cmd.permLevel,
					requiredConfigs: cmd.requiredConfigs,
					runIn: cmd.runIn,
					usage: cmd.usage.nearlyFullUsage,
					usageString: cmd.usage.usageString,
					usageDelim: cmd.usage.usageDelim
				});
			});
			return response.end(JSON.stringify(commands));
		});

		for (const [name, store] of this.client.pieceStores) {
			this.get(`api/${name}`, (request, response) => response.end(JSON.stringify(store.keyArray())));

			this.get(`api/${name}/:id`, (request, response) => {
				const { id } = request.params;
				if (id === 'all') return response.end(JSON.stringify(store.array()));
				const piece = store.get(id);
				if (!piece) response.end('{}');
				return response.end(JSON.stringify(piece));
			});
		}

		this.listen(options.port);
	}

	setHeaders(request, response, next) {
		response.setHeader('Access-Control-Allow-Origin', this.origin);
		response.setHeader('Content-Type', 'application/json');
		next();
	}

}
