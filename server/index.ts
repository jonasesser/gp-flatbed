import * as alt from 'alt-server';
import * as Athena from '@AthenaServer/api/index.js';
import { gpFlatbed } from './flatbed.js';

const PLUGIN_NAME = 'gpFlatbed';

Athena.systems.plugins.registerPlugin(PLUGIN_NAME, () => {
    gpFlatbed.init();
    alt.log(`~lg~${PLUGIN_NAME} was Loaded`);
});
