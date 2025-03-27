import sqlite3 from 'sqlite3'

export function SqliteConnector(dbPath: string) {
    const db = new sqlite3.Database(dbPath, sqlite3.OPEN_READWRITE, (err: Error | null) => {
        if (err) {
            console.error(err.message)
        }
        console.log('Connected to the database.')
    })

    return db;
}

export function SqliteClose(db: sqlite3.Database) {
    db.close((err: Error | null) => {
        if (err) {
            console.error(err.message)
        }
        console.log('Close the database connection.')
    })
}