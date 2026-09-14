import "./UserCard.css"
import type {User} from "../../../../server/src/models/user.ts";

function UserCard(user: User) {
    return (
        <article className="user-card">
            <img className="avatar" src={import.meta.env.VITE_API_URI + user.avatar}
                 loading="lazy" width={92} height={106}/>
            <div className="user-details">
                <h3>{user.first_name + ' ' + user.last_name}</h3>
                <div className="user-meta">
                    <span>{user.nationality}</span><i aria-hidden="true"></i><span>{user.age} years</span>
                </div>
                <div className="hobby-row">
                    {
                        user.hobbies.slice(0, 2).map((hobbie: string) => (
                            <span key={hobbie}>{hobbie}</span>
                        ))
                    }
                    {user.hobbies.length > 2 ? (
                        <span
                            className="more-hobbies"
                            data-tooltip-id="hobbies-tooltip"
                            data-tooltip-content={user.hobbies.slice(2).join(", ")}
                        >
                            +{user.hobbies.length - 2}
                        </span>
                    ) : null}
                </div>
            </div>
        </article>
    );
}

export default UserCard;
