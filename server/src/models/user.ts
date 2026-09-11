import {z} from "zod";

import {SortBy} from "./db.ts";

export const MAX_LIMIT = 100;
const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 20;

const positiveInt = (max: number) =>
    z.union([z.number(), z.string().regex(/^\d+$/).transform(Number)])
        .pipe(z.int().positive().max(max));

export const paginationSchema = z.object({
    page: positiveInt(Number.MAX_SAFE_INTEGER).default(DEFAULT_PAGE),
    limit: positiveInt(MAX_LIMIT).default(DEFAULT_LIMIT),
});

export const userFilterSchema = z.object({
    name: z.string().max(200).optional(),
    nationalities: z.array(z.string().min(1).max(100)).max(100).optional(),
    hobbies: z.array(z.string().min(1).max(100)).max(100).optional(),
});

const sortDirection = z.enum(SortBy);

export const userQuerySchema = userFilterSchema.extend({
    ...paginationSchema.shape,
    sortBy: z.object({
        firstName: sortDirection.optional(),
        lastName: sortDirection.optional(),
        age: sortDirection.optional(),
        nationality: sortDirection.optional(),
    }).optional(),
});

export type User = {
    id: number;
    avatar: string;
    first_name: string;
    last_name: string;
    age: number;
    nationality: string;
    hobbies: string[];
};

export type UserFilter = z.infer<typeof userFilterSchema>;
export type UserQuery = z.infer<typeof userQuerySchema>;

export type ValueCount = {
    value: string;
    count: number;
};

export type FilterOptions = {
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
