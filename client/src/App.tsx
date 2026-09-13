import './App.css'
import Header from "./components/Header/Header.tsx";
import SearchBar from "./components/SearchBar/SearchBar.tsx";
import FilterPanel from "./components/FilterPanel/FilterPanel.tsx";
import UserList from "./components/UserList/UserList.tsx";
import type {UserQuery} from "presight-server/dist/models/user.ts";

function App() {
    return (
        <div className={"wrapper-container"}>
            <Header/>
            <SearchBar/>
            <div className={"main-container"}>
                <FilterPanel/>
                <UserList {...{} as UserQuery}/>
            </div>
        </div>
    )
}

export default App
