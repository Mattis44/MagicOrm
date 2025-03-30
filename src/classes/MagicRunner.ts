import sqlite3 from "sqlite3";
import fs from "fs";
import path from "path";

const configPath = path.resolve(process.cwd(), "magicorm.json");

if (!fs.existsSync(configPath)) {
    throw new Error("❌ Fichier de configuration magicorm.json introuvable.");
}

const config = JSON.parse(fs.readFileSync(configPath, "utf-8"));
const dbPath = config.database.path || "database.db";

class MagicRunner {
    private static instance: MagicRunner;
    private db: sqlite3.Database;

    private constructor() {
        this.db = new sqlite3.Database(dbPath, sqlite3.OPEN_READWRITE, (err) => {
            if (err) {
                console.error("❌ Erreur de connexion à la base de données :", err.message);
            } else {
                console.log(`✅ Connecté à la base de données : ${dbPath}`);
            }
        });
    }

    public static getInstance(): MagicRunner {
        if (!MagicRunner.instance) {
            MagicRunner.instance = new MagicRunner();
        }
        return MagicRunner.instance;
    }

    public query(sql: string, params: any[] = []): Promise<any> {
        return new Promise((resolve, reject) => {
            this.db.all(sql, params, (err, rows) => {
                if (err) {
                    console.error("❌ Erreur SQL :", err.message);
                    reject(err);
                } else {
                    resolve(rows);
                }
            });
        });
    }

    public close(): Promise<void> {
        return new Promise((resolve, reject) => {
            this.db.close((err) => {
                if (err) {
                    console.error("❌ Erreur lors de la fermeture :", err.message);
                    reject(err);
                } else {
                    console.log("🔒 Connexion fermée.");
                    resolve();
                }
            });
        });
    }
}

export default MagicRunner;
