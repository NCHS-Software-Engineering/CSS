export default class InvalidRoomReceivedError extends Error {
    constructor(room: string, json: Object) {
        super(`Received an invalid room for '${room}' (contains '${JSON.stringify(json)}').`);
        this.name = "InvalidRoomReceivedError";
    }
}