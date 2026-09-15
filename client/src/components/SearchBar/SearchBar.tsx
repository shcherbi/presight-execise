import "./SearchBar.css"
import {type Dispatch, type SetStateAction, useEffect, useState} from "react";
import type {UserQuery} from "../../../../server/src/models/user.ts";
import {SORT_BY, type SortBy} from "../../../../server/src/models/db.ts";
import {SORT_FIELDS} from "../../shared/constants/sorting.ts";
import type {SortField} from "../../shared/types/sorting.ts";


type SearchBarProps = {
    setQuery: Dispatch<SetStateAction<UserQuery>>;
    query: UserQuery;
};


function SearchBar({setQuery, query}: SearchBarProps) {
    const [searchValue, setSearchValue] = useState(query.name ?? "");
    const sortKey: SortField = SORT_FIELDS.find(field => query.sortBy?.[field] !== undefined) ?? "firstName";
    const sortDirection: SortBy = query.sortBy?.[sortKey] ?? SORT_BY.ASC;

    useEffect(() => {
        const timeoutId = setTimeout(() => {
            const name = searchValue.trim();
            setQuery(currentQuery => (currentQuery.name ?? "") === name
                ? currentQuery
                : {...currentQuery, name: name || undefined});
        }, 500);

        return () => clearTimeout(timeoutId);
    }, [searchValue, setQuery]);

    return (
        <section className="search-bar-container">
            <div className="search">
                <input id="name-search" onChange={(event) => setSearchValue(event.target.value)}
                       value={searchValue}
                       type="search" placeholder="Search first or last name..."/>
            </div>
            <div className="sort-controls">
                <span>SORT BY</span>
                <select id="sortBy" value={sortKey} onChange={event => {
                    const nextSortKey = event.target.value as SortField;
                    setQuery(currentQuery => ({
                        ...currentQuery,
                        sortBy: {[nextSortKey]: sortDirection}
                    }));
                }}>
                    <option value="firstName">First name</option>
                    <option value="lastName">Last name</option>
                    <option value="age">Age</option>
                    <option value="nationality">Nationality</option>
                </select>
                <button type="button" aria-label={`Sort ${sortDirection === SORT_BY.ASC ? "descending" : "ascending"}`} onClick={() => {
                    const nextDirection = sortDirection === SORT_BY.ASC ? SORT_BY.DESC : SORT_BY.ASC;
                    setQuery(currentQuery => ({
                        ...currentQuery,
                        sortBy: {[sortKey]: nextDirection}
                    }));
                }}>{sortDirection === SORT_BY.ASC ? "↑" : "↓"}</button>
            </div>
        </section>
    );
}

export default SearchBar;
