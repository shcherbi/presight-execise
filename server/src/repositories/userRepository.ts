import {db} from "../config/database.ts";
import type {User} from "../models/user.ts";

type UserRow = Omit<User, "hobbies"> & { hobbies: string | null };

const selectUserPage = db.prepare<[number, number], UserRow>(`
    SELECT u.id,
           u.avatar,
           u.first_name,
           u.last_name,
           u.age,
           u.nationality,
           (select json_group_array(h.name order by h.name)
            from user_hobbies uh
                     join hobbies h on h.id = uh.hobby_id
            where uh.user_id = u.id) as hobbies
    FROM users u
    ORDER BY u.id
    LIMIT ? OFFSET ?
`);

const selectUserCount = db.prepare<[], { total: number }>(
    "SELECT COUNT(*) AS total FROM users",
);

export function countUsers(): number {
    const total = selectUserCount.get()?.total;
    if (total === undefined) {
        throw new Error("Unable to count users.");
    }

    return total;
}

export function findUsers(limit: number, offset: number): User[] {
    return selectUserPage.all(limit, offset).map(userRow => {
        if (userRow.hobbies === null || userRow.hobbies === undefined){
            return {
                ...userRow,
                hobbies: []
            };
        }
        return {
            ...userRow,
            hobbies: JSON.parse(userRow.hobbies) as string[]
        };
    })
}
