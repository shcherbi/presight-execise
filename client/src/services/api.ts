import type {FilterOptions, UserFilter, UserQuery} from "../../../server/src/models/user.ts";

const BASE_URI: string = import.meta.env.VITE_API_URI;

async function post<T>(path: string, body: unknown): Promise<T> {
    const res = await fetch(`${BASE_URI}${path}`, {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(body)
    });

    if (!res.ok) {
        throw new Error(`${path}: ${res.status} ${await res.text()}`);
    }
    return res.json();
}

export const getUsersPaginated = (userQuery: UserQuery) =>
    post<UserQuery>("/api/users/query", userQuery);


export const getFilterOptions = (userFilter: UserFilter) =>
    post<FilterOptions>("/api/users/filter-options", userFilter);

