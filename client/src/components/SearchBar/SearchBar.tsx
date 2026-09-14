import "./SearchBar.css"
import {type Dispatch, type SetStateAction, useEffect, useState} from "react";
import type {UserQuery} from "../../../../server/src/models/user.ts";
import {SortBy} from "../../../../server/src/models/db.ts";

type SearchBarProps = {
    setQuery: Dispatch<SetStateAction<UserQuery>>;
};

function SearchBar({setQuery}: SearchBarProps) {
    const [searchValue, setSearchValue] = useState<string>("");
    const [sortKey, setSortKey] = useState<"firstName" | "lastName" | "age" | "nationality">("firstName");
    const [sortDirection, setSortDirection] = useState<SortBy>(SortBy.ASC);

    useEffect(() => {
        const timeoutId = setTimeout(() => {
            setQuery((query: UserQuery) => ({
                ...query,
                name: searchValue,
                sortBy: {
                    [sortKey]: sortDirection
                }
            }));
        }, 1000)

        return () => {
            clearTimeout(timeoutId);
        }
    }, [searchValue]);

    useEffect(() => {
        setQuery((query: UserQuery) => ({
            ...query,
            sortBy: {
                [sortKey]: sortDirection
            }
        }));
    },[sortKey, sortDirection]);

    return (
        <section className="search-bar-container">
            <div className="search">
                <input onChange={(event) => setSearchValue(event.target.value)}
                       value={searchValue}
                       type="search" placeholder="Search first or last name..."/>
            </div>
            <div className="sort-controls">
                <span>SORT BY</span>
                <select id="sortBy" onChange={event => {
                    setSortKey(event.target.value as typeof sortKey);
                }}>
                    <option value="firstName">First name</option>
                    <option value="lastName">Last name</option>
                    <option value="age">Age</option>
                    <option value="nationality">Nationality</option>
                </select>
                <button onClick={() => {
                    setSortDirection(sortDirection === SortBy.ASC ? SortBy.DESC : SortBy.ASC)
                }}>{sortDirection === SortBy.ASC ? "↑" : "↓"}</button>
            </div>
        </section>
    );
}

export default SearchBar;