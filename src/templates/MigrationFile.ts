import MagicRunner from "../classes/MagicRunner";
import { Entity } from "../types/Entity";

const getColumnsFromDb = async (table: string): Promise<string[]> => {
    const db = MagicRunner.getInstance();
    const query = await db.query(`PRAGMA table_info("${table}")`);
    return query.map((column: any) => column.name);
};

const getNewColumns = async (entity: Entity, table: string) => {
    const existingColumns = await getColumnsFromDb(table);
    return entity.columns.filter(
        (column) => !existingColumns.includes(column.name)
    );
};

export const migrationTemplate = async (entities: Entity[]) => {
    const timestamp = new Date().toISOString().replace(/[-T:.Z]/g, "");
    const className = `Version${timestamp}`;

    const newColumnsByTable = await Promise.all(
        entities.map(async (entity) => ({
            tableName: entity.name.toLowerCase(),
            newColumns: await getNewColumns(entity, entity.name.toLowerCase()),
        }))
    );

    let upQueries = "";
    let downQueries = "";

    for (const { tableName, newColumns } of newColumnsByTable) {
        if (newColumns.length === 0) continue;

        for (const column of newColumns) {
            let columnSql = `${column.name} ${column.type}`;

            if (column.primary) {
                columnSql += " PRIMARY KEY";
                if (column.generated) columnSql += " AUTOINCREMENT";
            }
            if (column.unique) columnSql += " UNIQUE";
            if (column.nullable === false) columnSql += " NOT NULL";
            if (column.default) columnSql += ` DEFAULT ${column.default}`;

            upQueries += `
            await queryRunner.query(\`
                ALTER TABLE "${tableName}" ADD COLUMN ${columnSql}
            \`);\n`;
        }

        downQueries += `
        const existingColumns = await queryRunner.query(\`PRAGMA table_info("${tableName}")\`);
        const originalColumns = existingColumns.filter((col: { name: string }) => ["id", "name"].includes(col.name));
        const columnsToKeep = originalColumns.map((col: { name: string }) => col.name);

        await queryRunner.query(\`
            CREATE TABLE "${tableName}_tmp" AS SELECT \${columnsToKeep.join(", ")} FROM "${tableName}";
        \`);
        await queryRunner.query(\`DROP TABLE "${tableName}";\`);
        await queryRunner.query(\`ALTER TABLE "${tableName}_tmp" RENAME TO "${tableName}";\`);
        `;
    }

    return {
        file: `
class ${className} {
    public async up(queryRunner: any): Promise<void> {
        ${upQueries}
    }

    public async down(queryRunner: any): Promise<void> {
        ${downQueries}
    }
}
export default ${className};
`,
        name: className,
    };
};
