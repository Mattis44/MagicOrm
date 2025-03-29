import { Entity } from "../types/Entity";

export const migrationTemplate = (entities: Entity[]) => {
    const timestamp = new Date().toISOString().replace(/[-T:.Z]/g, "");
    const className = `Version${timestamp}`;

    let upQueries = "";
    let downQueries = "";

    for (const entity of entities) {
        const tableName = entity.name.toLowerCase();
        const columnsToSql = entity.columns
            .map((column) => {
                let columnSql = `${column.name} ${column.type}`;

                if (column.primary) {
                    columnSql += " PRIMARY KEY";
                    if (column.generated) {
                        columnSql += " AUTOINCREMENT";
                    }
                }

                if (column.unique) {
                    columnSql += " UNIQUE";
                }

                if (column.nullable === false) {
                    columnSql += " NOT NULL";
                }

                if (column.default) {
                    columnSql += ` DEFAULT ${column.default}`;
                }
                return columnSql;
            })
            .join(",\n ");

        upQueries += `
        await queryRunner.query(\`
            CREATE TABLE IF NOT EXISTS "${tableName}" (
                ${columnsToSql}
            )
        \`);\n`;

        downQueries += `
        await queryRunner.query(\`
            DROP TABLE IF EXISTS "${tableName}"
        \`);\n`;
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
