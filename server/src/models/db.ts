export enum SortBy {
    ASC = "ASC",
    DESC = "DESC"
}

export type BindValue = string | number;

export type Filter = {
    where: string;
    params: BindValue[];
};
