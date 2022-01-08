/**
 * A tow
 */
export class Tow {
    /**
     * The flatbed vehicle
     * any -> because client/server side transfer
     *  lt.Vehicle
     */
    flatbed: any;

    /**
     * The towed vehicle
     * any -> because client/server side transfer
     * alt.Vehicle
     */
    towed: any;

    constructor(flatbed: any, towed: any) {
        this.flatbed = flatbed;
        this.towed = towed;
    }
}
