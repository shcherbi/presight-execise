import "./Header.css"

function Header() {
    return (
        <header className={"header-container"}>
            <div>
                <span className={"header-subtitle"}>Private & Confidential</span>
                <h1 className={"header-title"}>The Detective Registry</h1>
            </div>
            <div className={"header-editions"}>
                <span>EST. 1984</span>
            </div>
        </header>
    );
}

export default Header;