export class UserNameAlreadyExistsError extends Error {
    constructor() {
        super('Username already exists.')
    }
}