declare module 'magicorm' {
    export function Entity(target: Function): void;
    export function PrimaryGeneratedColumn(target: Object, propertyKey: string): void;
    export function Column(target: Object, propertyKey: string): void;
    export function getEntityColumns(target: Function): any[];
}
