export default class UnexpectedResponseError extends Error {
    constructor(code: number) {
        super(`Unexpected response with status code '${code}'.`);
        this.name = "UnexpectedResponseError";
    }
}