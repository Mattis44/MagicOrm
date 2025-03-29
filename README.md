# MagicOrm
MagicOrm is a TypeScript only ORM for SQLite3, designed to be simple and easy to use.

## Installing

For the latest version:
```
yarn add magic-orm
```
or
```
npm install magic-orm
```

## Usage

We recommend using `yarn magicorm init` to initialize your project. This will create all the necessary files and folders for you such as a template and the `magicorm.json` configuration file.
```ts
import { Entity, Column, PrimaryGeneratedColumn } from 'magicorm';

@Entity
export class User {
  @PrimaryGeneratedColumn
  id: number;

  @Column({ length: 255, nullable: false })
  name: string;

  @Column({ length: 255, nullable: false })
  email: string;
}
```

You'll have to customize the `magicorm.json` file to your needs. The default configuration is as follows:
```json
{
  "database": {
    "path": "database.db" // Path to your SQLite database file
  },
  "entities": [
    "dist/entities/**/*.js" // Path to your compiled entities
  ],
  "migrations": [
    "src/migrations/**/*.ts" // Path to your migration files (not used yet)
  ]
}
```

Make sure to change the `entities` path to point to your compiled entities. The default is set to `dist/entities/**/*.js`, which is the default output path for TypeScript compilation.