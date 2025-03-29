import path from "path";
import fs from "fs";
import { glob } from "glob";
import InitError from "../classes/InitError";
import { Entity } from "src/types/Entity";
import * as migrationUtils from "../utils/migrationUtils";

export async function scanEntities() {
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

    for (const pattern of config.entities) {
        const files = glob.sync(pattern, { cwd: process.cwd() });

        console.log(`🔍 Recherche avec le pattern : ${pattern}`);
        console.log(`📂 Répertoire courant : ${process.cwd()}`);
        console.log(`📋 Fichiers trouvés :`, files);

        const entities = await migrationUtils.getAllEntities(files);
        entities.forEach((entity: Entity) => {
            console.log(`📋 Entité : ${entity.name}`);
            console.log("Colonnes : ", entity.columns);
        });
    }
}
