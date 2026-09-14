import "./Header.css"

function Header() {
    return (
        <header className="header-container">
            <div className="header-logo-title-block">
                <img className="sherlock-image" src="detectiveprofile.svg" alt="Detective profile illustration"/>
                <div className="header-title-subtitle-block">
                    <span className="header-subtitle">Private & Confidential</span>
                    <h1 className="header-title">The Detective Registry</h1>
                </div>
            </div>
            <div className="header-editions">
                <span>EST. 1984</span>
            </div>
        </header>
    );
}

export default Header;
