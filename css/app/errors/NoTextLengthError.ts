export default class NoTextLengthError extends Error {
    constructor(text: string) {
        super(`No possible length for the string '${text}'.`);
        this.name = "NoTextLengthError";
    }
}