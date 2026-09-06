import type {Request, Response} from "express";

import * as userService from "../services/userService.ts";

const DEFAULT_PAGE = 1;
const DEFAULT_SIZE = 20;

function parsePositiveInteger(value: Request["query"][string] | undefined, defaultValue: number): number | undefined {
    if (value === undefined) {
        return defaultValue;
    }

    if (typeof value !== "string" || !/^[1-9]\d*$/.test(value)) {
        return undefined;
    }

    return Number(value);
}

export function getUsers(req: Request, res: Response): void {
    const page = parsePositiveInteger(req.query.page, DEFAULT_PAGE);
    const limit = parsePositiveInteger(req.query.limit, DEFAULT_SIZE);

    if (page === undefined || limit === undefined) {
        res.status(400).json({
            error: `"page" must be a positive integer and "limit" must be a positive integer.`,
        });
        return;
    }

    res.json(userService.listUsers(page, limit));
}
