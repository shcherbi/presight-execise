export const SORT_BY = {
    ASC: "ASC",
    DESC: "DESC"
} as const;

export type SortBy = typeof SORT_BY[keyof typeof SORT_BY];

export type BindValue = string | number;

export type Filter = {
    where: string;
    params: BindValue[];
};
