import { ColumnOptions } from "../types/ColumnOptions";

export function getEntityColumns(target: Function) {
    const columns = Reflect.getMetadata("columns", target.prototype) || [];
    const primaryKeyGeneratedColumn = Reflect.getMetadata("PrimaryGeneratedColumn", target.prototype);
    if (primaryKeyGeneratedColumn) {
        const primaryKeyColumn = columns.find((column: any) => column.name === primaryKeyGeneratedColumn);
        if (primaryKeyColumn) {
            primaryKeyColumn.primary = true;
            primaryKeyColumn.generated = true;
        }
    }
    return columns.map((column: any) => {
        return {
            name: column.name,
            type: column.type,
            length: column.length,
            nullable: column.nullable,
            unique: column.unique,
            primary: column.primary || false,
            generated: column.generated || false,
            default: column.default
        };
    });
}

export function Entity(target: Function) {
    Reflect.defineMetadata("Entity", true, target);
}

export function Column(options?: ColumnOptions) {
    return function (target: Object, propertyKey: string) {
        const columns = Reflect.getMetadata("columns", target) || [];

        const propertyType = Reflect.getMetadata("design:type", target, propertyKey);

        const columnData = {
            name: propertyKey,
            type: options?.type ?? propertyType.name.toLowerCase(),
            length: options?.length ?? null,
            nullable: options?.nullable ?? false,
            unique: options?.unique ?? false,
            default: options?.default ?? undefined
        };

        columns.push(columnData);
        Reflect.defineMetadata("columns", columns, target);
    };

}

export function PrimaryGeneratedColumn(target: Object, propertyKey: string) {
    Column({ type: "integer" })(target, propertyKey);
    Reflect.defineMetadata("PrimaryGeneratedColumn", propertyKey, target);
}