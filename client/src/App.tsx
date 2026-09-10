import './App.css'
import Header from "./components/Header/Header.tsx";
import SearchBar from "./components/SearchBar/SearchBar.tsx";

function App() {
    return (
        <>
            <Header/>
            <SearchBar/>
            {/*          <div>
            ACTIVE:
            <label>Diving X</label>
            <a>Remove All</a>
          </div>*/}
            <aside>
                <h2>
                    Refine Records
                </h2>
                <div>
                    <span>Hobbies</span>
                    <span>TOP 20</span>
                    <div>
                        <div>
                            <input type={"checkbox"} title={"Diving"}/> Diving
                        </div>
                        <div>
                            <input type={"checkbox"} title={"Diving"}/> Boxing
                        </div>
                    </div>
                </div>
                <div>
                    <span>Nationalities</span>
                    <span>TOP 20</span>
                    <div>
                        <div>
                            <input type={"checkbox"} title={"English"}/> English
                        </div>
                        <div>
                            <input type={"checkbox"} title={"Indus"}/> Indus
                        </div>
                    </div>
                </div>
            </aside>
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
        </>
    )
}

export default App
