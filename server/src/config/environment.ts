import {resolve} from "node:path";

export const config = {
    port: process.env.PORT || 3000,
    databasePath: resolve(import.meta.dirname, "../../", process.env.DATABASE_PATH || "db/app.sqlite3")
};
