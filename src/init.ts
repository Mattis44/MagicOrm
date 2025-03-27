import { Command } from "commander";
import fs from "fs";
import path from "path";

export function initProject() {
    const program = new Command();

    program
        .option(
            "--init",
            "Initialise le projet MagicOrm en créant les dossiers nécessaires et un fichier de configuration"
        )
        .action((options) => {
            if (options.init) {
                console.log("📂 Initialisation du projet MagicOrm...");

                // Création des dossiers dans src
                const folders = ["src", "src/entities", "src/migrations"];

                folders.forEach((folder) => {
                    const folderPath = path.resolve(process.cwd(), folder);

                    if (!fs.existsSync(folderPath)) {
                        fs.mkdirSync(folderPath, { recursive: true });
                        console.log(`✅ Dossier créé : ${folderPath}`);
                    } else {
                        console.log(`⚠️ Dossier déjà existant : ${folderPath}`);
                    }
                });

                // Création du fichier magicorm.json dans src
                const configPath = path.resolve(process.cwd(), "magicorm.json");

                if (!fs.existsSync(configPath)) {
                    const defaultConfig = {
                        database: {
                            path: "database.db",
                        },
                        entities: ["src/entities/**/*.ts"],
                        migrations: ["src/migrations/**/*.ts"],
                    };

                    fs.writeFileSync(
                        configPath,
                        JSON.stringify(defaultConfig, null, 2)
                    );
                    console.log(
                        `✅ Fichier de configuration créé : ${configPath}`
                    );
                } else {
                    console.log(
                        `⚠️ Fichier de configuration déjà existant : ${configPath}`
                    );
                }

                const entityTemplate = `
import { Entity, Column, PrimaryGeneratedColumn } from "magicorm";

@Entity
export class User {
    @PrimaryGeneratedColumn
    id: number;

    @Column
    name: string;

    constructor(id: number, name: string) {
        this.id = id;
        this.name = name;
    }
}
            `;
                const entityPath = path.resolve(
                    process.cwd(),
                    "src/entities/User.ts"
                );

                if (!fs.existsSync(entityPath)) {
                    fs.writeFileSync(entityPath, entityTemplate);
                    console.log(`✅ Template d'entité créé : ${entityPath}`);
                } else {
                    console.log(
                        `⚠️ Template d'entité déjà existant : ${entityPath}`
                    );
                }

                console.log("🎉 Initialisation terminée !");
            }
        });

    program.parse(process.argv);
}
