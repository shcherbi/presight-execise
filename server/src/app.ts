import express, {type ErrorRequestHandler, type Express} from "express";
import cors from "cors";

import userRoutes from "./routes/userRoutes.ts";
import {resolve} from "node:path";

const app: Express = express();

app.use(cors());
app.use(express.json());
app.use("/avatars", express.static(resolve(import.meta.dirname, "../db/avatars")));
app.use("/users", userRoutes);


const errorHandler: ErrorRequestHandler = (error, _req, res, _next) => {
    const status = typeof error?.status === "number" ? error.status : 500;
    res.status(status).json({error: status === 500 ? "Internal server error." : error.message});
};

app.use(errorHandler);

export default app;
