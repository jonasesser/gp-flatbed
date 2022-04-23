import * as alt from 'alt-server';
import { PluginSystem } from '../../../server/systems/plugins';
import { gpFlatbed } from './flatbed';

const PLUGIN_NAME = 'gpFlatbed';

PluginSystem.registerPlugin(PLUGIN_NAME, () => {
    gpFlatbed.init();
    alt.log(`~lg~${PLUGIN_NAME} was Loaded`);
});
