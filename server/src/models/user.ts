export type User = {
    id: number;
    avatar: string;
    first_name: string;
    last_name: string;
    age: number;
    nationality: string;
    hobbies: string[];
};

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