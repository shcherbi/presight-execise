import Database from "better-sqlite3";

import {config} from "./environment.ts";

export const db: Database.Database = new Database(config.databasePath);

db.pragma("journal_mode = WAL");
db.pragma("foreign_keys = ON");
