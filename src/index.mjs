import quarkPackage from '../package.json';

export { default as Client } from './Master';
export { default as QuarkClient } from './Master';
export { default as Master } from './Master';

export { default as KlasaDashboardHooks } from './lib/dashboard/klasa/KlasaDashboardHooks.mjs';
export { default as KomadaDashboardHooks } from './lib/dashboard/komada/KomadaDashboardHooks.mjs';
export { default as ErisDashboardHooks } from './lib/dashboard/eris/ErisDashboardHooks.mjs';
export { default as DiscordJsDashboardHooks } from './lib/dashboard/discordjs/DiscordJsDashboardHooks.mjs';

export { default as Chart } from './lib/utilities/Charts';
export { default as Constants } from './lib/utilities/Constants';
export { default as ToShard } from './lib/utilities/ToShard';

export const { version } = quarkPackage;
