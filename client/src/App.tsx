import './App.css'
import Header from "./components/Header/Header.tsx";
import SearchBar from "./components/SearchBar/SearchBar.tsx";
import FilterPanel from "./components/FilterPanel/FilterPanel.tsx";

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
                <main>
                    <div>
                        <h2> Verified Operatives</h2>
                        <span>Matching case files</span>
                        <span>240 records found</span>
                    </div>
                    <div>
                        <div>
                            <svg></svg>
                            <h1>John Doe</h1>
                            <span>Polish</span>
                            <span>46 old</span>
                            <label>Diving</label>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    )
}

export default App
