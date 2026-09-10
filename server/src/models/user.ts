import type {SortBy} from "./db.ts";

export type User = {
    id: number;
    avatar: string;
    first_name: string;
    last_name: string;
    age: number;
    nationality: string;
    hobbies: string[];
};

export type UserFilter = {
    name?: string;
    nationalities?: string[];
    hobbies?: string[];
};

export type UserQuery = UserFilter & {
    page: number;
    limit: number;
    sortBy?: {
        firstName?: SortBy;
        lastName?: SortBy;
        age?: SortBy;
        nationality?: SortBy;
    }
};

export type ValueCount = {
    value: string;
    count: number;
};

export type UserAggregation = {
    hobbies: ValueCount[];
    nationalities: ValueCount[];
};

export type UserRow = Omit<User, "hobbies"> & { hobbies: string | null };

export type PaginatedUsers = {
    users: User[];
    pagination: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
        hasNextPage: boolean;
    };
};