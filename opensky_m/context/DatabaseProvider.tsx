import React, { createContext, useContext, useEffect, useState } from 'react'
import * as SQLite from 'expo-sqlite'

type DatabaseContextType = SQLite.SQLiteDatabase | undefined

const DatabaseContext = createContext<DatabaseContextType>(undefined)

export const useDatabase = (): DatabaseContextType => {
    return useContext(DatabaseContext)
}

export const DatabaseProvider = ({ children }: { children: React.ReactNode }) => {
    const [db, setDb] = useState<DatabaseContextType>(undefined)

    useEffect(() => {
        const initializeDatabase = async () => {
            const db = await SQLite.openDatabaseAsync('opensky_mobile.db')

            await db.execAsync(`
                CREATE TABLE IF NOT EXISTS customers (
                    customer_id INTEGER PRIMARY KEY AUTOINCREMENT,
                    name TEXT NOT NULL,
                    email TEXT,
                    phone TEXT,
                    address TEXT
                );
                
                CREATE TABLE IF NOT EXISTS products (
                    product_id INTEGER PRIMARY KEY AUTOINCREMENT,
                    name TEXT NOT NULL,
                    description TEXT,
                    unit_price REAL NOT NULL,
                    quantity INTEGER NOT NULL,
                    quantity_dispatched INTEGER NOT NULL
                );

                CREATE TABLE IF NOT EXISTS invoice_master (
                    invoice_id INTEGER PRIMARY KEY AUTOINCREMENT,
                    customer_id INTEGER NOT NULL,
                    invoice_date DATE NOT NULL,
                    total_amount REAL NOT NULL,
                    status TEXT NOT NULL,
                    FOREIGN KEY (customer_id) REFERENCES customers(customer_id)
                );

                CREATE TABLE IF NOT EXISTS invoice_items (
                    item_id INTEGER PRIMARY KEY AUTOINCREMENT,
                    invoice_id INTEGER NOT NULL,
                    product_id INTEGER NOT NULL,
                    description TEXT,
                    quantity INTEGER NOT NULL,
                    unit_price REAL NOT NULL,
                    line_total REAL NOT NULL,
                    FOREIGN KEY (invoice_id) REFERENCES invoice_master(invoice_id),
                    FOREIGN KEY (product_id) REFERENCES products(product_id)
                );

                CREATE TABLE IF NOT EXISTS cash_book (
                    transaction_id INTEGER PRIMARY KEY AUTOINCREMENT,
                    invoice_id INTEGER NOT NULL,
                    transaction_date DATE NOT NULL,
                    amount REAL NOT NULL,
                    transaction_type TEXT NOT NULL,
                    FOREIGN KEY (invoice_id) REFERENCES invoice_master(invoice_id)
                );
                
                CREATE TABLE IF NOT EXISTS parking_ticket (
                    transaction_id INTEGER PRIMARY KEY AUTOINCREMENT,
                    ticket_id INTEGER NOT NULL,
                    ticket_time TIMESTAMP NOT NULL,
                    ticket_ref TEXT,
                    amount REAL NOT NULL
                );`)


            setDb(db)
        }

        initializeDatabase()
    })

    return (
        <DatabaseContext.Provider value={db}>
            {children}
        </DatabaseContext.Provider>
    )
}