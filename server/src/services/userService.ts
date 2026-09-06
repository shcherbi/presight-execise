import type {PaginatedUsers} from "../models/user.ts";
import {countUsers, findUsers} from "../repositories/userRepository.ts";

export function listUsers(page: number, limit: number): PaginatedUsers {
    const total = countUsers();
    const offset = (page - 1) * limit;
    const users = findUsers(limit, offset);

    return {
        users,
        pagination: {
            page,
            limit,
            total,
            totalPages: Math.ceil(total / limit),
            hasNextPage: page * limit < total,
        },
    };
}
