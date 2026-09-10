import './App.css'
import Header from "./components/Header/Header.tsx";
import SearchBar from "./components/SearchBar/SearchBar.tsx";
import FilterPanel from "./components/FilterPanel/FilterPanel.tsx";
import UserList from "./components/UserList/UserList.tsx";

function App() {
    return (
        <div className={"wrapper-container"}>
            <Header/>
            <SearchBar/>
            {/*          <div>
            ACTIVE:
            <label>Diving X</label>
            <a>Remove All</a>
          </div>*/}
            <div className={"main-container"}>
                <FilterPanel/>
                <UserList/>
            </div>
        </div>
    )
}

export default App
