import type {UserQuery} from "../models/user.ts";
import {type BindValue, type Filter, SortBy} from "../models/db.ts";


function placeholders(values: unknown[]): string {
    return values.map(() => "?").join(", ");
}

function direction(sortBy: SortBy | undefined): string {
    return sortBy === SortBy.DESC ? "DESC" : "ASC";
}

function buildUserFilter(userQuery: UserQuery): Filter {
    const filterArray: string[] = [];
    const params: BindValue[] = [];

    if (userQuery.firstName) {
        filterArray.push("u.first_name LIKE ?");
        params.push(`%${userQuery.firstName.trim()}%`);
    }

    if (userQuery.lastName) {
        filterArray.push("u.last_name LIKE ?");
        params.push(`%${userQuery.lastName.trim()}%`);
    }

    if (userQuery.nationalities && userQuery.nationalities.length !== 0) {
        filterArray.push(`u.nationality IN (${placeholders(userQuery.nationalities)})`);
        params.push(...userQuery.nationalities);
    }

    if (userQuery.hobbies && userQuery.hobbies.length !== 0) {
        filterArray.push(`
            EXISTS (SELECT 1
                    FROM user_hobbies uh
                             JOIN hobbies h ON h.id = uh.hobby_id
                    WHERE uh.user_id = u.id
                      AND h.name IN (${placeholders(userQuery.hobbies)}))
        `);
        params.push(...userQuery.hobbies);
    }

    return {
        where: filterArray.length === 0 ? "" : `WHERE ${filterArray.join(" AND ")}`,
        params
    };
}

function buildUserOrderBy(userQuery: UserQuery): string {
    const sortByArray: string[] = [];

    if (userQuery.sortBy && userQuery.sortBy.firstName) {
        sortByArray.push(`u.first_name ${direction(userQuery.sortBy.firstName)}`);
    }

    if (userQuery.sortBy && userQuery.sortBy.lastName) {
        sortByArray.push(`u.last_name ${direction(userQuery.sortBy.lastName)}`);
    }

    if (userQuery.sortBy && userQuery.sortBy.age) {
        sortByArray.push(`u.age ${direction(userQuery.sortBy.age)}`);
    }

    if (userQuery.sortBy && userQuery.sortBy.nationality) {
        sortByArray.push(`u.nationality ${direction(userQuery.sortBy.nationality)}`);
    }

    sortByArray.push("u.id");

    return `ORDER BY ${sortByArray.join(", ")}`;
}

export default {
    buildUserFilter,
    buildUserOrderBy
}