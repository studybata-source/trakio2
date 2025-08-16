import SQLite from 'react-native-sqlcipher-storage';
SQLite.enablePromise(true);

export type Migration = { version: number; up: (tx: SQLite.Transaction) => Promise<void> | void };

const migrations: Migration[] = [
  {
    version: 1,
    up: async (tx) => {
      await tx.executeSql(`CREATE TABLE IF NOT EXISTS tasks (
        id TEXT PRIMARY KEY,
        title TEXT NOT NULL,
        notes TEXT,
        duration_tag TEXT,
        created_at INTEGER NOT NULL,
        updated_at INTEGER NOT NULL,
        completed_at INTEGER,
        archived INTEGER DEFAULT 0,
        provider_id TEXT,
        provider_task_id TEXT
      );`);
      await tx.executeSql('CREATE INDEX IF NOT EXISTS idx_tasks_created ON tasks(created_at);');
      await tx.executeSql('CREATE INDEX IF NOT EXISTS idx_tasks_provider ON tasks(provider_id, provider_task_id);');
      await tx.executeSql('CREATE TABLE IF NOT EXISTS migrations (id INTEGER PRIMARY KEY AUTOINCREMENT, version INTEGER NOT NULL UNIQUE, applied_at INTEGER NOT NULL);');
    },
  },
];

export async function openDb(passphrase: string) {
  const db = await SQLite.openDatabase({ name: 'e1.db', key: passphrase, location: 'default' });
  await db.executeSql('PRAGMA cipher_compatibility = 4');
  await db.executeSql('PRAGMA kdf_iter = 256000');
  await runMigrations(db);
  return db;
}

async function getCurrentVersion(db: SQLite.SQLiteDatabase): Promise<number> {
  const res = await db.executeSql("SELECT MAX(version) as v FROM migrations");
  const row = res[0].rows.item(0);
  return row?.v ?? 0;
}

async function runMigrations(db: SQLite.SQLiteDatabase) {
  await db.transaction(async (tx) => {
    await tx.executeSql('CREATE TABLE IF NOT EXISTS migrations (id INTEGER PRIMARY KEY AUTOINCREMENT, version INTEGER NOT NULL UNIQUE, applied_at INTEGER NOT NULL)');
  });
  const current = await getCurrentVersion(db);
  for (const m of migrations) {
    if (m.version > current) {
      await db.transaction(async (tx) => {
        await m.up(tx);
        await tx.executeSql('INSERT OR REPLACE INTO migrations (version, applied_at) VALUES (?, ?)', [m.version, Date.now()]);
      });
    }
  }
}