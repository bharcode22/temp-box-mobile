import { sql } from 'drizzle-orm';
import { getDb } from './db';

const initSql = [
  `CREATE TABLE IF NOT EXISTS \`product_types\` (
  	\`id\` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
  	\`name\` text NOT NULL
  );`,
  `CREATE TABLE IF NOT EXISTS \`products\` (
  	\`id\` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
  	\`name\` text NOT NULL,
  	\`type\` text DEFAULT '',
  	\`price\` real NOT NULL,
  	\`stock\` integer DEFAULT 0 NOT NULL,
  	\`created_at\` text DEFAULT (CURRENT_TIMESTAMP) NOT NULL,
  	\`product_type_id\` integer,
  	FOREIGN KEY (\`product_type_id\`) REFERENCES \`product_types\`(\`id\`) ON UPDATE no action ON DELETE no action
  );`,
  `CREATE TABLE IF NOT EXISTS \`transactions\` (
  	\`id\` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
  	\`created_at\` text DEFAULT (CURRENT_TIMESTAMP) NOT NULL,
  	\`total\` real NOT NULL,
  	\`qty\` integer DEFAULT 0 NOT NULL,
  	\`price\` real DEFAULT 0 NOT NULL,
  	\`seller\` text DEFAULT '' NOT NULL,
  	\`buyer\` text DEFAULT '' NOT NULL
  );`,
  `CREATE TABLE IF NOT EXISTS \`transaction_items\` (
  	\`id\` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
  	\`transaction_id\` integer NOT NULL,
  	\`product_id\` integer NOT NULL,
  	\`quantity\` integer NOT NULL,
  	\`price\` real NOT NULL,
  	FOREIGN KEY (\`transaction_id\`) REFERENCES \`transactions\`(\`id\`) ON UPDATE no action ON DELETE no action,
  	FOREIGN KEY (\`product_id\`) REFERENCES \`products\`(\`id\`) ON UPDATE no action ON DELETE no action
  );`,
  `CREATE TABLE IF NOT EXISTS \`users\` (
  	\`id\` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
  	\`username\` text NOT NULL,
  	\`name\` text NOT NULL,
  	\`password\` text NOT NULL
  );`
];

// Helper untuk menjalankan migrasi skema tabel pada startup
export async function runMigrations(): Promise<void> {
  try {
    const db = getDb();
    for (const query of initSql) {
      await db.run(sql.raw(query));
    }
    console.log('[Drizzle] Migrasi database berhasil dijalankan.');
  } catch (error) {
    console.error('[Drizzle] Gagal menjalankan migrasi database:', error);
  }
}
