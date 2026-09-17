import {
    type Dispatch,
    type SetStateAction,
    useCallback
} from "react";

import {
    type inferParserType,
    parseAsNativeArrayOf,
    parseAsString,
    parseAsStringLiteral,
    useQueryStates
} from "nuqs";

import type {UserQuery} from "../../../server/src/models/user.ts";
import {SORT_BY} from "../../../server/src/models/db.ts";
import {SORT_FIELDS} from "../shared/constants/sorting.ts";
import type {SortField} from "../shared/types/sorting.ts";

const DEFAULT_SORT_FIELD: SortField = "firstName";
const DEFAULT_SORT_DIRECTION = SORT_BY.ASC;

const queryParams = {
    name: parseAsString.withDefault(""),
    sort: parseAsStringLiteral(SORT_FIELDS).withDefault(DEFAULT_SORT_FIELD),
    direction: parseAsStringLiteral([SORT_BY.ASC, SORT_BY.DESC]).withDefault(DEFAULT_SORT_DIRECTION),
    hobby: parseAsNativeArrayOf(parseAsString).withDefault([]),
    nationality: parseAsNativeArrayOf(parseAsString).withDefault([])
};

type UrlQuery = inferParserType<typeof queryParams>;

function isNumeric(value: any) {
    return !isNaN(value) && Number.isFinite(parseFloat(value));
}

function normalizeFilterValues(values: string[]): string[] {
    return [...new Set(
        values
            .map(value => value.trim())
            .filter(value => !isNumeric(value) && value.length > 0 && value.length <= 100)
    )].slice(0, 100);
}

function toUserQuery(urlQuery: UrlQuery): UserQuery {
    const name = urlQuery.name.trim();
    const query: UserQuery = {
        page: 1,
        limit: 20,
        sortBy: {[urlQuery.sort]: urlQuery.direction},
        hobbies: normalizeFilterValues(urlQuery.hobby),
        nationalities: normalizeFilterValues(urlQuery.nationality)
    };

    if (name.length > 0 && name.length <= 200) {
        query.name = name;
    }

    return query;
}

export function useUserQuery(): {
    query: UserQuery;
    setQuery: Dispatch<SetStateAction<UserQuery>>;
} {
    const [urlQuery, setUrlQuery] = useQueryStates(queryParams, {history: "push"});

    const setQuery = useCallback<Dispatch<SetStateAction<UserQuery>>>(
        queryUpdate => {
            void setUrlQuery(prevUrlState => {
                const prevUserQuery = toUserQuery(prevUrlState);

                // Either object or updater function can be passed
                const updatedUserQuery: UserQuery = typeof queryUpdate === "function"
                    ? queryUpdate(prevUserQuery)
                    : queryUpdate;

                const updatedSortField: SortField =
                    SORT_FIELDS.find((field: SortField) => updatedUserQuery.sortBy?.[field] !== undefined)
                    ?? DEFAULT_SORT_FIELD;

                const updatedUrlState = {
                    name: updatedUserQuery.name?.trim() || null,
                    sort: updatedSortField,
                    direction:
                        updatedUserQuery.sortBy?.[updatedSortField]
                        ?? DEFAULT_SORT_DIRECTION,
                    hobby: normalizeFilterValues(updatedUserQuery.hobbies ?? []),
                    nationality: normalizeFilterValues(
                        updatedUserQuery.nationalities ?? []
                    )
                };

                return updatedUrlState;
            });
        },
        [setUrlQuery]
    );

    const query: UserQuery = toUserQuery(urlQuery);
    return {
        query,
        setQuery
    };
}
