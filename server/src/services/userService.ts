import type {PaginatedUsers, User, UserQuery} from "../models/user.ts";
import repository from "../repositories/userRepository.ts";
import {getPaginatedUsersDto} from "../mapper/user.ts";

function getUsers(page: number, limit: number): PaginatedUsers {
    const total: number = repository.countUsers();
    const offset: number = (page - 1) * limit;
    const users: User[] = repository.findUsers(limit, offset);

    return getPaginatedUsersDto(users, page, limit, total);
}


function queryUsers(userQuery: UserQuery): PaginatedUsers {
    const total: number = repository.countQueriedUsers(userQuery);
    const offset: number = (userQuery.page - 1) * userQuery.limit;
    const users: User[] = repository.queryUsers(userQuery, userQuery.limit, offset);

    return getPaginatedUsersDto(users, userQuery.page, userQuery.limit, total);
}

export default {
    getUsers,
    queryUsers
}