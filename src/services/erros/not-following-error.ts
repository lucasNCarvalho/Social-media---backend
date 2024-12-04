export class NotFollowingError extends Error {
    constructor() {
        super("Você não está seguindo este usuário.");
        this.name = "NotFollowingError";
    }
}