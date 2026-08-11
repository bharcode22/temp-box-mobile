import { drizzle } from 'drizzle-orm/op-sqlite';
import { open } from '@op-engineering/op-sqlite';
import * as schema from './schema';

let dbInstance: any = null;

// Menggunakan Lazy Initialization untuk mencegah crash JSI pada thread latar belakang (Headless JS)
export const getDb = () => {
  if (!dbInstance) {
    console.log('[Drizzle Database] Menginisialisasi koneksi SQLite lokal kasir.db...');
    const opsqliteDb = open({
      name: 'kasir.db',
    });

    // Polyfill untuk kompatibilitas Drizzle ORM dengan op-sqlite v17+
    if (opsqliteDb) {
      const dbAsAny = opsqliteDb as any;

      // 1. Bungkus execute untuk menyuntikkan properti _array ke rows
      const originalExecute = dbAsAny.execute.bind(dbAsAny);
      dbAsAny.execute = async (query: string, params?: any[]) => {
        const res = await originalExecute(query, params);
        if (res && res.rows && !res.rows._array) {
          // Drizzle mencari properti _array di dalam hasil baris data
          res.rows._array = res.rows;
        }
        return res;
      };

      // Petakan executeAsync ke execute yang sudah di-polyfill
      dbAsAny.executeAsync = dbAsAny.execute;

      // 2. Petakan executeRawAsync untuk mengembalikan rawRows (array 2D) secara langsung
      if (dbAsAny.executeRaw) {
        dbAsAny.executeRawAsync = async (query: string, params?: any[]) => {
          const res = await dbAsAny.executeRaw(query, params);
          return res.rawRows || [];
        };
      }
    }

    dbInstance = drizzle(opsqliteDb, { schema });
  }
  return dbInstance;
};
