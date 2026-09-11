import "./SearchBar.css"

function SearchBar() {
    return (
        <section className="search-bar-container">
            <div className="search">
                <input type="search" placeholder="Search first or last name..."/>
            </div>
            <div className="sort-controls">
                <span>SORT BY</span>
                <select id="sortBy">
                    <option value="firstName">First name</option>
                    <option value="lastName">Last name</option>
                    <option value="age">Age</option>
                    <option value="nationality">Nationality</option>
                </select>
                <button>↑ A–Z</button>
            </div>
        </section>
    );
}

export default SearchBar;