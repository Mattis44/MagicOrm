export type Entity = {
    name: string;
    columns: {
        name: string;
        type: string;
        length?: number;
        nullable?: boolean;
        unique?: boolean;
        primary?: boolean;
        generated?: boolean;
        default?: any;
    }[];
}