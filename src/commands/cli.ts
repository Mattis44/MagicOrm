import { Command } from "commander";
import { initProject } from "./init";
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

    program.parse(process.argv);
}
