import type {Request, Response} from "express";

import userService from "../services/userService.ts";
import type {UserQuery} from "../models/user.ts";

const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 20;

function parsePositiveIntegerForRequestQuery(value: Request["query"][string] | undefined, defaultValue: number): number | undefined {
    if (value === undefined) {
        return defaultValue;
    }

    if (typeof value !== "string" || !/^[1-9]\d*$/.test(value)) {
        return undefined;
    }

    return Number(value);
}

function parsePositiveIntegerForUserQuery(value:number | undefined, defaultValue: number): number | undefined {
    if (value === undefined) {
        return defaultValue;
    }

    return value;
}

function getUsers(req: Request, res: Response): void {
    const page = parsePositiveIntegerForRequestQuery(req.query.page, DEFAULT_PAGE);
    const limit = parsePositiveIntegerForRequestQuery(req.query.limit, DEFAULT_LIMIT);

    if (page === undefined || limit === undefined) {
        res.status(400).json({
            error: `"page" must be a positive integer and "limit" must be a positive integer.`,
        });
        return;
    }

    res.json(userService.getUsers(page, limit));
}

function queryUsers(req: Request<{}, {}, UserQuery>, res: Response): void {
    const userQuery: UserQuery = req.body ?? {} as UserQuery;
    const page = parsePositiveIntegerForUserQuery(userQuery.page, DEFAULT_PAGE);
    const limit = parsePositiveIntegerForUserQuery(userQuery.limit, DEFAULT_LIMIT);

    if (page === undefined || limit === undefined) {
        res.status(400).json({
            error: `"page" must be a positive integer and "limit" must be a positive integer.`,
        });
        return;
    }

    userQuery.page = page;
    userQuery.limit = limit;

    res.json(userService.queryUsers(userQuery));
}

export default {
    getUsers,
    queryUsers
}
