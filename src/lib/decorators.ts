export function getEntityColumns(target: Function) {
    return Reflect.getMetadata("columns", target.prototype) || [];
}

export function Entity(target: Function) {
    Reflect.defineMetadata("Entity", true, target);
}

export function Column(target: Object, propertyKey: string) {
    const columns = Reflect.getMetadata("columns", target) || [];

    const propertyType = Reflect.getMetadata(
        "design:type",
        target,
        propertyKey
    );

    columns.push({ name: propertyKey, type: propertyType.name });
    Reflect.defineMetadata("columns", columns, target);
}

export function PrimaryGeneratedColumn(target: Object, propertyKey: string) {
    Column(target, propertyKey);
    Reflect.defineMetadata("PrimaryGeneratedColumn", propertyKey, target);
}