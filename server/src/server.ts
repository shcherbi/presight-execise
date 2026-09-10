
import app from "./app.ts";
import { db } from "./config/database.ts";
import { config } from "./config/environment.ts";

const server = app.listen(config.port, () => {
    console.log(`Server is running at http://localhost:${config.port}`);
});

//Graceful shutdown
function shutDown(): void {
    server.close((error?: Error) => {
        db.close();

        if (error) {
            console.error("Error during shutdown:", error);
        }

        process.exit(error ? 1 : 0);
    });

    server.closeAllConnections();
}

process.once("SIGINT", shutDown);
process.once("SIGTERM", shutDown);
