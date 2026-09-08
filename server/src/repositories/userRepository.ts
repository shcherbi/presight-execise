import {db} from "../config/database.ts";
import {type BindValue} from "../models/db.ts";
import type {User, UserQuery, UserRow} from "../models/user.ts";
import {toUser} from "../mapper/user.ts";
import userSpec from "./userSpec.ts";

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

export default {countUsers, findUsers, countQueriedUsers, queryUsers};
