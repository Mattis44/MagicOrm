import path from "path";
import fs from "fs";
import InitError from "../classes/InitError";
import { glob } from "glob";
import * as migrationUtils from "../utils/migrationUtils";
import * as migrationFile from "../templates/MigrationFile";
import MagicRunner from "../classes/MagicRunner";

export async function createMigration() {
    const configPath = path.resolve(process.cwd(), "magicorm.json");

    if (!fs.existsSync(configPath)) {
        throw new InitError(
            "FATAL: Le fichier de configuration magicorm.json est introuvable."
        );
    }
    const config = JSON.parse(fs.readFileSync(configPath, "utf-8"));

    if (!config.migrations?.saveAt) {
        throw new InitError(
            "FATAL: Aucun chemin de migration spécifié dans le fichier de configuration."
        );
    }

    if (!config.migrations?.readAt) {
        throw new InitError(
            "FATAL: Aucun chemin de migration spécifié dans le fichier de configuration."
        );
    }

    if (
        !config.entities ||
        !Array.isArray(config.entities) ||
        config.entities.length === 0
    ) {
        throw new InitError(
            "FATAL: Aucun chemin d'entité spécifié dans le fichier de configuration."
        );
    }

    const entitiesData: { name: string; columns: any[] }[] = [];

    for (const pattern of config.entities) {
        const files = glob.sync(pattern, { cwd: process.cwd() });

        console.log(`🔍 Recherche avec le pattern : ${pattern}`);
        console.log(`📂 Répertoire courant : ${process.cwd()}`);
        console.log(`📋 Fichiers trouvés :`, files);

        const entities = await migrationUtils.getAllEntities(files);
        for (const entity of entities) {
            console.log(`📦 Entité trouvée : ${entity.name}`);
            console.log(`🔍 Colonnes :`, entity.columns);

            entitiesData.push({ name: entity.name, columns: entity.columns });
        }
    }

    if (entitiesData.length === 0) {
        throw new InitError(
            "FATAL: Aucune entité trouvée. Veuillez vérifier vos chemins d'entité."
        );
    }

    const { file, name } = await migrationFile.migrationTemplate(entitiesData);

    fs.writeFileSync(
        path.resolve(process.cwd(), config.migrations.saveAt, `${name}.ts`),
        file
    );

    console.log(`✅ Fichier de migration créé : ${name}.ts`);
    console.log(
        `📂 Chemin : ${path.resolve(
            process.cwd(),
            config.migrations.saveAt,
            `${name}.ts`
        )}`
    );
}

export async function runMigration() {
    const configPath = path.resolve(process.cwd(), "magicorm.json");

    if (!fs.existsSync(configPath)) {
        throw new InitError(
            "FATAL: Le fichier de configuration magicorm.json est introuvable."
        );
    }

    const config = JSON.parse(fs.readFileSync(configPath, "utf-8"));

    if (!config.migrations?.readAt) {
        throw new InitError(
            "FATAL: Aucun chemin de migration spécifié dans le fichier de configuration."
        );
    }

    const files = glob
        .sync(config.migrations.readAt, { cwd: process.cwd() })
        .filter((file) => file.endsWith(".js") || file.endsWith(".ts"));

    console.log(`🔍 Recherche avec le pattern : ${config.migrations.readAt}`);
    console.log(`📂 Répertoire courant : ${process.cwd()}`);
    console.log(`📋 Fichiers trouvés :`, files);

    const filteredFiles = files.sort((a, b) => {
        const extractTimestamp = (filename: string) => {
            const match = filename.match(/Version(\d{14})/);
            return match ? parseInt(match[1], 10) : 0;
        };
        return extractTimestamp(a) - extractTimestamp(b);
    });

    console.log(`📦 Fichiers de migration triés :`, filteredFiles);

    if (filteredFiles.length === 0) {
        throw new InitError(
            "FATAL: Aucun fichier de migration trouvé. Veuillez vérifier vos chemins de migration."
        );
    }

    const latestMigration = filteredFiles[filteredFiles.length - 1];
    console.log(`🚀 Exécution de la migration : ${latestMigration}`);

    try {
        const { default: MigrationClass } = await import(
            path.resolve(process.cwd(), latestMigration)
        );
        const migrationInstance = new MigrationClass();
        const magicRunner = MagicRunner.getInstance();

        await migrationInstance.up(magicRunner);
        console.log(`✅ Migration exécutée avec succès : ${latestMigration}`);
    } catch (error) {
        console.error(
            `❌ Erreur lors de l'exécution de la migration ${latestMigration} :`,
            error
        );
        throw new InitError(`FATAL: Échec de l'exécution de la migration.`);
    }
}
