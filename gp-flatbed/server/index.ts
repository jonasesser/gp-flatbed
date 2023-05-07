import * as alt from 'alt-server';
import * as Athena from '@AthenaServer/api';
import { gpFlatbed } from './flatbed';

const PLUGIN_NAME = 'gpFlatbed';

Athena.systems.plugins.registerPlugin(PLUGIN_NAME, () => {
    gpFlatbed.init();
    alt.log(`~lg~${PLUGIN_NAME} was Loaded`);
});
