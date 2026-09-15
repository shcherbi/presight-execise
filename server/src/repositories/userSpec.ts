import type {UserFilter, UserQuery} from "../models/user.ts";
import {type BindValue, type Filter, SORT_BY, type SortBy} from "../models/db.ts";


function placeholders(values: unknown[]): string {
    return values.map(() => "?").join(", ");
}

function escapeLike(value: string): string {
    return value.replace(/[\\%_]/g, "\\$&");
}

function direction(sortBy: SortBy | undefined): string {
    return sortBy === SORT_BY.DESC ? "DESC" : "ASC";
}

function buildUserFilter(userQuery: UserFilter): Filter {
    const filterArray: string[] = [];
    const params: BindValue[] = [];

    if (userQuery.name) {
        filterArray.push(`(u.first_name || ' ' || u.last_name) LIKE ? ESCAPE '\\' COLLATE NOCASE`);
        params.push(`%${escapeLike(userQuery.name.trim())}%`);
    }

    if (userQuery.nationalities && userQuery.nationalities.length !== 0) {
        filterArray.push(`u.nationality IN (${placeholders(userQuery.nationalities)})`);
        params.push(...userQuery.nationalities);
    }

    if (userQuery.hobbies && userQuery.hobbies.length !== 0) {
        filterArray.push(`
            u.id IN (SELECT fuh.user_id
                     FROM user_hobbies fuh 
                        JOIN hobbies fh ON fh.id = fuh.hobby_id
                     WHERE fh.name IN (${placeholders(userQuery.hobbies)})
                     GROUP BY fuh.user_id
                     HAVING COUNT(DISTINCT fh.name) = ?)
        `);
        params.push(...userQuery.hobbies, userQuery.hobbies.length);
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