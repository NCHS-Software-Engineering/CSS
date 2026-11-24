export default class NoTextLengthError extends Error {
    constructor(text: string) {
        super(`No possible length for the string '${text}'. (recorded length: ${text.length})`);
        this.name = "NoTextLengthError";
    }
}