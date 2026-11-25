export default class NoElementError extends Error {
    constructor(id: string) {
        super(`No such element with an id '${id}'.`);
        this.name = "NoElementError";
    }
}