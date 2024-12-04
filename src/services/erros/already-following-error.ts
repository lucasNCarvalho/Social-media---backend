export class AlreadyFollowingError extends Error {
    constructor() {
        super("Você já está seguindo este usuário.");
        this.name = "AlreadyFollowingError";
    }
}
