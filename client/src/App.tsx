import './App.css'
import Header from "./components/Header/Header.tsx";
import SearchBar from "./components/SearchBar/SearchBar.tsx";
import FilterPanel from "./components/FilterPanel/FilterPanel.tsx";
import UserList from "./components/UserList/UserList.tsx";
import type {UserQuery} from "presight-server/dist/models/user.ts";
import {useState} from "react";
import {Tooltip} from "react-tooltip";

function App() {
    const [query, setQuery] = useState<UserQuery>({
        sortBy: {
            firstName: "ASC"
        }
    } as UserQuery);

    return (
        <div className={"wrapper-container"}>
            <Header/>
            <SearchBar setQuery={setQuery}/>
            <div className={"main-container"}>
                <FilterPanel query={query} setQuery={setQuery}/>
                <UserList {...query}/>
            </div>
            <Tooltip
                id="hobbies-tooltip"
                className="hobbies-tooltip"
                place="top"
            />
        </div>
    )
}

export default App;
