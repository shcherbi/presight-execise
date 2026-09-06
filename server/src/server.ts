
import app from "./app.ts";
import { db } from "./config/database.ts";
import { config } from "./config/environment.ts";

const server = app.listen(config.port, () => {
    console.log(`Server is running at http://localhost:${config.port}`);
});

//Graceful shutdown
function shutDown(): void {
    server.close((error: any) => {
        db.close();

        if (error !== undefined) {
            throw error;
        }
    });
}

process.once("SIGINT", shutDown);
process.once("SIGTERM", shutDown);
