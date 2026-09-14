import "./SearchBar.css"
import {type Dispatch, type SetStateAction, useEffect, useState} from "react";
import type {UserQuery} from "presight-server/dist/models/user.ts";

type SearchBarProps = {
    setQuery: Dispatch<SetStateAction<UserQuery>>;
};

function SearchBar({setQuery}: SearchBarProps) {
    const [searchValue, setSearchValue] = useState<string>("");

    useEffect(() => {
        const timeoutId = setTimeout(() => {
            setQuery((query: UserQuery) => ({
                ...query,
                name: searchValue
            }));
        }, 400)

        return () => {
            clearTimeout(timeoutId);
        }
    }, [searchValue])

    return (
        <section className="search-bar-container">
            <div className="search">
                <input onChange={(event) => setSearchValue(event.target.value)}
                       value={searchValue}
                       type="search" placeholder="Search first or last name..."/>
            </div>
            <div className="sort-controls">
                <span>SORT BY</span>
                <select id="sortBy">
                    <option value="firstName">First name</option>
                    <option value="lastName">Last name</option>
                    <option value="age">Age</option>
                    <option value="nationality">Nationality</option>
                </select>
                <button>↑</button>
            </div>
        </section>
    );
}

export default SearchBar;