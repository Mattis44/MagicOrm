import path from "path";
import fs from "fs";
import { getEntityColumns } from "../lib/decorators";
import { glob } from "glob";

class InitError extends Error {
    constructor(message: string) {
        super(
            `${message}, veuillez exécuter la commande "yarn magicorm init" pour initialiser le projet.`
        );
        this.name = "InitError";
    }
}

export function scanEntities() {
    const configPath = path.resolve(process.cwd(), "magicorm.json");

    if (!fs.existsSync(configPath)) {
        throw new InitError(
            "FATAL: Le fichier de configuration magicorm.json est introuvable."
        );
    }
    const config = JSON.parse(fs.readFileSync(configPath, "utf-8"));

    if (
        !config.entities ||
        !Array.isArray(config.entities) ||
        config.entities.length === 0
    ) {
        throw new InitError(
            "FATAL: Aucun chemin d'entité spécifié dans le fichier de configuration. Veuillez ajouter au moins un chemin d'entité dans le tableau 'entities'."
        );
    }

    config.entities.forEach((pattern: string) => {
        const files = glob.sync(pattern, { cwd: process.cwd() });

        console.log(`🔍 Recherche avec le pattern : ${pattern}`);
        console.log(`📂 Répertoire courant : ${process.cwd()}`);
        console.log(`📋 Fichiers trouvés :`, files);

        files.forEach((file: string) => {
            console.log(`📄 Chargement de : ${file}`);
            const absolutePath = path.resolve(process.cwd(), file);

            import(absolutePath)
                .then((module) => {
                    Object.values(module).forEach((entity: any) => {
                        if (typeof entity === "function") {
                            const columns = getEntityColumns(entity);
                            console.log(`\n📌 Entité : ${entity.name}`);
                            console.table(columns);
                        }
                    });
                })
                .catch((err) => {
                    console.error(
                        `❌ Erreur lors de l'importation de ${file} :`,
                        err
                    );
                });
        });
    });
}
