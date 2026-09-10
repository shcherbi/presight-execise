import express, {type Express} from "express";

import userRoutes from "./routes/userRoutes.ts";
import {resolve} from "node:path";

const app: Express = express();

app.use(express.json());
app.use("/avatars", express.static(resolve(import.meta.dirname, "../db/avatars")));
app.use("/users", userRoutes);

export default app;
