import {Router} from "express";

import userController from "../controllers/userController.ts";

const router = Router();

router.get("/", userController.getUsers);
router.post("/query", userController.queryUsers);

export default router;
