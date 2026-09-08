import type {PaginatedUsers, User, UserRow} from "../models/user.ts";

export function getPaginatedUsersDto(users: User[], page: number, limit: number, total: number): PaginatedUsers {
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

export function toUser(userRow: UserRow): User {
    if (userRow.hobbies === null || userRow.hobbies === undefined) {
        return {
            ...userRow,
            hobbies: []
        };
    }

    return {
        ...userRow,
        hobbies: JSON.parse(userRow.hobbies) as string[]
    };
}