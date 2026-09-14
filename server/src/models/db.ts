export const SortBy = {
    ASC: "ASC",
    DESC: "DESC"
} as const;

export type SortBy = typeof SortBy[keyof typeof SortBy];

export type BindValue = string | number;

export type Filter = {
    where: string;
    params: BindValue[];
};
