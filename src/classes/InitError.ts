export default class InitError extends Error {
    constructor(message: string) {
        super(
            `${message}, veuillez exécuter la commande "yarn magicorm init" pour initialiser le projet.`
        );
        this.name = "InitError";
    }
}