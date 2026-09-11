import "./UserList.css"
import UserCard from "../UserCard/UserCard.tsx";

function UserList() {
    return (
        <main className="user-container">
            <div className="users-heading">
                <div>
                    <span className="eyebrow">Verified operatives</span>
                    <h2 id="users-title">Matching case files</h2>
                </div>
                <p><strong>240</strong> records found</p>
            </div>
            <div className="users-list">
                <div className="user-cards">
                    <UserCard/>
                </div>
            </div>
        </main>
    );
}

export default UserList;