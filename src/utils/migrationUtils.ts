import path from "path";
import { getEntityColumns } from "../lib/decorators";

export const getAllEntities = async (files: string[]) => {
    const entities: any[] = [];

    await Promise.all(
        files.map(async (file) => {
            console.log(`📄 Chargement de : ${file}`);
            const absolutePath = path.resolve(process.cwd(), file);

            try {
                const module = await import(absolutePath);
                Object.values(module).forEach((entity: any) => {
                    if (typeof entity === "function") {
                        entities.push({
                            name: entity.name,
                            columns: getEntityColumns(entity),
                        });
                    }
                });
            } catch (err) {
                console.error(`❌ Erreur lors de l'importation de ${file} :`, err);
            }
        })
    );

    return entities;
};

