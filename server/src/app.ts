import express, {type Express} from "express";

import userRoutes from "./routes/userRoutes.ts";

const app: Express = express();

app.use(express.json());
app.use("/users", userRoutes);

export default app;
