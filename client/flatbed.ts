import * as alt from 'alt-client';
import * as native from 'natives';
import * as AthenaClient from '@AthenaClient/api/index.js';
import { KEY_BINDS } from '../../../shared/enums/keyBinds.js';
import { SYSTEM_EVENTS } from '../../../shared/enums/system.js';
import { ITow } from '../shared/iTow.js';
import { GP_Events_Flatbed } from '../shared/events.js';

let positionOnTow = new Map<number, alt.Vector3>();
positionOnTow.set(native.getHashKey('flatbed'), new alt.Vector3(-0.5, -5.5, 1));
positionOnTow.set(native.getHashKey('slamtruck'), new alt.Vector3(0, -2, 0.5));

let positionBehindTow = new Map<number, alt.Vector3>();
positionBehindTow.set(native.getHashKey('flatbed'), new alt.Vector3(-0.5, -13, 0));
positionBehindTow.set(native.getHashKey('slamtruck'), new alt.Vector3(0, -7.5, 0));

/**
 * A tow
 */
class Tow implements ITow {
    /**
     * The flatbed vehicle
     */
    flatbed: alt.Vehicle;

    /**
     * The towed vehicle
     */
    towed: alt.Vehicle;
}

export class gpFlatbed {
    static init() {
        alt.onServer(SYSTEM_EVENTS.TICKS_START, gpFlatbed.registerKeybinds);
        alt.onServer(GP_Events_Flatbed.SendTowedVehiclesList, gpFlatbed.sendTowedVehiclesList);
        alt.onServer(GP_Events_Flatbed.SendVehiclesList, gpFlatbed.sendVehiclesList);
    }

    /**
     * Register the keybind to the Keybind Controller.
     * Triggers a possible animation
     * @static
     */
    static registerKeybinds() {
        //Dependency to Athena Framework, replace if Athena will not be used.
        AthenaClient.systems.hotkeys.add({
            key: KEY_BINDS.TOWTRUCK,
            description: 'Towtruck',
            identifier: 'Towtruck-getvehiclelist',
            keyDown: gpFlatbed.getTowedVehiclesList,
        });
    }

    static getTowedVehiclesList() {
        if (alt.Player.local.vehicle && positionOnTow.get(native.getEntityModel(alt.Player.local.vehicle.scriptID))) {
            alt.emitServer(GP_Events_Flatbed.GetTowedVehiclesList);
        }
    }

    static sendTowedVehiclesList(tows: Tow[]) {
        if (!tows || tows.length == 0) {
            alt.emitServer(GP_Events_Flatbed.GetVehiclesList);
        } else {
            let found = false;
            tows.forEach((tow) => {
                if (tow.flatbed && tow.flatbed.scriptID == alt.Player.local.vehicle.scriptID) {
                    let positionBehind = positionBehindTow.get(
                        native.getEntityModel(alt.Player.local.vehicle.scriptID),
                    );
                    native.attachEntityToEntity(
                        tow.towed.scriptID,
                        tow.flatbed.scriptID,
                        20,
                        positionBehind.x,
                        positionBehind.y,
                        0.0,
                        0.0,
                        0.0,
                        0.0,
                        false,
                        false,
                        true,
                        false,
                        20,
                        true,
                        false, //TODO: New parameter unknown
                    );
                    native.detachEntity(tow.towed, true, true);
                    alt.emitServer(GP_Events_Flatbed.RemoveTow, tow);
                    found = true;
                }
            });

            if (!found) {
                alt.emitServer(GP_Events_Flatbed.GetVehiclesList);
            }
        }
    }

    static sendVehiclesList(vehicles: alt.Vehicle[]) {
        let j = alt.Player.local.scriptID;
        let jcoords = native.getEntityCoords(j, true);
        let found = false;

        vehicles.forEach((veh) => {
            if (veh.scriptID != 0) {
                let vehcoords = native.getEntityCoords(veh.scriptID, true);
                let dist = native.getDistanceBetweenCoords(
                    jcoords.x,
                    jcoords.y,
                    jcoords.z,
                    vehcoords.x,
                    vehcoords.y,
                    vehcoords.z,
                    true,
                );

                if (!found && dist <= 12.0 && dist >= 7.0 && dist != 0) {
                    let positionOn = positionOnTow.get(native.getEntityModel(alt.Player.local.vehicle.scriptID));
                    native.attachEntityToEntity(
                        veh.scriptID,
                        alt.Player.local.vehicle.scriptID,
                        20,
                        positionOn.x,
                        positionOn.y,
                        positionOn.z,
                        0.0,
                        0.0,
                        0.0,
                        true,
                        false,
                        true,
                        false,
                        10,
                        true,
                        false, //TODO: New parameter unknown
                    );
                    alt.emitServer(GP_Events_Flatbed.AddTow, alt.Player.local.vehicle, veh);
                    found = true;
                }
            }
        });
    }
}
