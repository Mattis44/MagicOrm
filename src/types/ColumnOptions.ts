export type ColumnOptions = {
    type?: "string" | "number" | "boolean" | "integer";
    length?: number,
    nullable?: boolean,
    unique?: boolean,
    default?: any;
}