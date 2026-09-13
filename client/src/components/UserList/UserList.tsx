import "./UserList.css"
import UserCard from "../UserCard/UserCard.tsx";
import {useEffect, useState} from "react";
import type {PaginatedUsers, User, UserQuery} from "../../../../server/src/models/user.ts";
import {getPaginatedUsers} from "../../services/api.ts";

function UserList() {
    const [users, setUsers] = useState<PaginatedUsers>();

    useEffect(() => {
        async function loadPaginatedUsers() {
            const paginatedUsers: PaginatedUsers = await getPaginatedUsers({} as UserQuery);
            setUsers(paginatedUsers);
        }

        void loadPaginatedUsers();
    }, [])

    return (
        <main className="user-container">
            <div className="users-heading">
                <div>
                    <span className="eyebrow">Verified operatives</span>
                    <h2>Matching case files</h2>
                </div>
                <p><strong>{users?.pagination.total}</strong> records found</p>
            </div>
            <div className="users-list">
                <div className="user-cards">
                    {
                        users?.users.map((user: User) => (
                        <UserCard key={user.id} {...user}/>
                        ))
                    }
                </div>
            </div>
        </main>
    );
}

export default UserList;