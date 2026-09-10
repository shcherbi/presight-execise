import {db} from "../config/database.ts";
import {type BindValue} from "../models/db.ts";
import type {ValueCount, User, UserFilter, UserQuery, UserRow} from "../models/user.ts";
import {toUser} from "../mapper/user.ts";
import userSpec from "./userSpec.ts";

const TOP_FACETS = 20;

const USER_COLUMNS = `
    u.id,
    u.avatar,
    u.first_name,
    u.last_name,
    u.age,
    u.nationality,
    (select json_group_array(h.name order by h.name)
     from user_hobbies uh
              join hobbies h on h.id = uh.hobby_id
     where uh.user_id = u.id) as hobbies
`;

const selectUserPage = db.prepare<[number, number], UserRow>(`
    SELECT ${USER_COLUMNS}
    FROM users u
    ORDER BY u.id
    LIMIT ? OFFSET ?
`);

const selectUserCount = db.prepare<[], { total: number }>(
    "SELECT COUNT(*) AS total FROM users",
);

function countUsers(): number {
    const total = selectUserCount.get()?.total;
    if (total === undefined) {
        throw new Error("Unable to count users.");
    }

    return total;
}

function countQueriedUsers(userQuery: UserQuery): number {
    const {where, params} = userSpec.buildUserFilter(userQuery);

    const statement = db.prepare<BindValue[], { total: number }>(`
        SELECT COUNT(*) AS total
        FROM users u
            ${where}
    `);

    const total = statement.get(...params)?.total;
    if (total === undefined) {
        throw new Error("Unable to count users.");
    }

    return total;
}

function findUsers(limit: number, offset: number): User[] {
    return selectUserPage.all(limit, offset).map(toUser);
}

function queryUsers(userQuery: UserQuery, limit: number, offset: number): User[] {
    const {where, params} = userSpec.buildUserFilter(userQuery);

    const statement = db.prepare<BindValue[], UserRow>(`
        SELECT ${USER_COLUMNS}
        FROM users u
            ${where} ${userSpec.buildUserOrderBy(userQuery)}
        LIMIT ? OFFSET ?
    `);

    return statement.all(...params, limit, offset).map(toUser);
}

function topHobbies(userFilter: UserFilter): ValueCount[] {
    const {where, params} = userSpec.buildUserFilter(userFilter);

    const statement = db.prepare<BindValue[], ValueCount>(`
        SELECT h.name AS value, COUNT(*) AS count
        FROM users u
                 JOIN user_hobbies uh ON uh.user_id = u.id
                 JOIN hobbies h ON h.id = uh.hobby_id
            ${where}
        GROUP BY h.name
        ORDER BY count DESC, h.name ASC
        LIMIT ${TOP_FACETS}
    `);

    return statement.all(...params);
}

function topNationalities(userFilter: UserFilter): ValueCount[] {
    const {where, params} = userSpec.buildUserFilter(userFilter);

    const statement = db.prepare<BindValue[], ValueCount>(`
        SELECT u.nationality AS value, COUNT(*) AS count
        FROM users u
            ${where}
        GROUP BY u.nationality
        ORDER BY count DESC, u.nationality ASC
        LIMIT ${TOP_FACETS}
    `);

    return statement.all(...params);
}

export default {countUsers, findUsers, countQueriedUsers, queryUsers, topHobbies, topNationalities};
