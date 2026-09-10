import "./UserList.css"

function UserList() {
    return (
        <main className={"user-container"}>
            <div className="users-heading">
                <div>
                    <span className="eyebrow">Verified operatives</span>
                    <h2 id="users-title">Matching case files</h2>
                </div>
                <p><strong>240</strong> records found</p>
            </div>
            <div className={"users-list"}>
                <article className={"user-card"}>
                    <svg className={"avatar"}></svg>
                    <div className="user-details">
                        <h3>John Doe</h3>
                        <div className="user-meta">
                            <span>Polish</span><i aria-hidden="true"></i><span>46 years</span>
                        </div>
                        <div className="hobby-row">
                            <span>Diving</span>
                            <span>Boxing</span>
                            <span className="more-hobbies" title="Climbing, Photography, Sailing, Entomology">+4</span>
                        </div>
                    </div>
                </article>
            </div>
        </main>
    );
}

export default UserList;