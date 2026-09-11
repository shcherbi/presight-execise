import "./UserCard.css"

function UserCard() {
    return (
        <article className="user-card">
            <img className="avatar"  alt="" loading="lazy" width={92} height={106} />
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
    );
}

export default UserCard