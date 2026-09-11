import "./SearchBar.css"

function SearchBar() {
    return (
        <section className="search-bar-container">
            <div className="search">
                <input type="text" placeholder="Search first or last name..."/>
            </div>
            <div className="sort-controls">
                <span>SORT BY</span>
                <select>
                    <option>First name</option>
                    <option>Last name</option>
                    <option>Age</option>
                    <option>Nationality</option>
                </select>
                <button>ASC/DESC</button>
            </div>
        </section>
    );
}

export default SearchBar;