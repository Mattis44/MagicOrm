import { Command } from "commander";
import { initProject } from "./init";
import { createMigration, runMigration } from "./migration";
import { scanEntities } from "./scanEntities";

export function cli() {
    const program = new Command();

    program
        .command("init")
        .description(
            "Initialise le projet MagicOrm en créant les dossiers nécessaires et un fichier de configuration"
        )
        .action(() => {
            initProject();
        });

    program
        .command("scan")
        .description(
            "Scanne les entités définies dans magicorm.json et affiche leurs colonnes"
        )
        .action(() => {
            scanEntities();
        });

    program
        .command("migration")
        .description(
            "Crée une migration basée sur les entités définies dans magicorm.json"
        )
        .option("-r, --run", "Exécute la migration")
        .action((o) => {
            if (!o.run) {
                createMigration();
            }
            runMigration();
        });

    program.parse(process.argv);
}
