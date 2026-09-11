import type {Request, Response} from "express";
import {z} from "zod";

import userService from "../services/userService.ts";
import {paginationSchema, userFilterSchema, userQuerySchema} from "../models/user.ts";

function parse<T>(schema: z.ZodType<T>, input: unknown, res: Response): T | undefined {
    const result = schema.safeParse(input);

    if (!result.success) {
        res.status(400).json({
            error: "Invalid request.",
            issues: z.treeifyError(result.error),
        });
        return undefined;
    }

    return result.data;
}

function getUsers(req: Request, res: Response): void {
    const pagination = parse(paginationSchema, req.query, res);
    if (!pagination) {
        return;
    }

    res.json(userService.getUsers(pagination.page, pagination.limit));
}

function queryUsers(req: Request, res: Response): void {
    const userQuery = parse(userQuerySchema, req.body ?? {}, res);
    if (!userQuery) {
        return;
    }

    res.json(userService.queryUsers(userQuery));
}

function getFilterOptions(req: Request, res: Response): void {
    const userFilter = parse(userFilterSchema, req.body ?? {}, res);
    if (!userFilter) {
        return;
    }

    res.json(userService.getFilterOptions(userFilter));
}

export default {
    getUsers,
    queryUsers,
    getFilterOptions
}
