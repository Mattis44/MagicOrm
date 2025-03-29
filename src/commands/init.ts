import fs from "fs";
import path from "path";

export function initProject() {
    console.log("📂 Initialisation du projet MagicOrm...");

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

    const configPath = path.resolve(process.cwd(), "magicorm.json");

    if (!fs.existsSync(configPath)) {
        const defaultConfig = {
            database: {
                path: "database.db",
            },
            entities: ["dist/entities/**/*.js"],
            migrations: {
                readAt: "dist/migrations/**/*.js",
                saveAt: "src/migrations/",
            },
        };

        fs.writeFileSync(configPath, JSON.stringify(defaultConfig, null, 2));
        console.log(`✅ Fichier de configuration créé : ${configPath}`);
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

    @Column({ length: 50, nullable: false })
    name: string;

    constructor(id: number, name: string) {
        this.id = id;
        this.name = name;
    }
}
            `;
    const entityPath = path.resolve(process.cwd(), "src/entities/User.ts");

    if (!fs.existsSync(entityPath)) {
        fs.writeFileSync(entityPath, entityTemplate);
        console.log(`✅ Template d'entité créé : ${entityPath}`);
    } else {
        console.log(`⚠️ Template d'entité déjà existant : ${entityPath}`);
    }

    console.log("🎉 Initialisation terminée !");
}
