import './App.css'
import Header from "./components/Header/Header.tsx";
import SearchBar from "./components/SearchBar/SearchBar.tsx";
import FilterPanel from "./components/FilterPanel/FilterPanel.tsx";
import UserList from "./components/UserList/UserList.tsx";
import {Tooltip} from "react-tooltip";
import {useUserQuery} from "./hooks/useUserQuery.ts";

function App() {
    const {query, setQuery} = useUserQuery();

    return (
        <div className={"wrapper-container"}>
            <Header/>
            <SearchBar query={query} setQuery={setQuery}/>
            <div className={"main-container"}>
                <FilterPanel query={query} setQuery={setQuery}/>
                <UserList key={JSON.stringify(query)} query={query}/>
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
