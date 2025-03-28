import { ColumnOptions } from "src/types/ColumnOptions";

export function getEntityColumns(target: Function) {
    return Reflect.getMetadata("columns", target.prototype) || [];
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