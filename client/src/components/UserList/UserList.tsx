import "./UserList.css"
import {useEffect, useRef, useState} from "react";
import type {PaginatedUsers, Pagination, User, UserQuery} from "../../../../server/src/models/user.ts";
import {getPaginatedUsers} from "../../services/api.ts";
import {VirtuosoGrid} from "react-virtuoso";
import UserCard from "../UserCard/UserCard.tsx";

function UserList(query: UserQuery) {
    const [users, setUsers] = useState<User[]>([]);
    const [pagination, setPagination] = useState<Pagination>();
    const [isLoadingMoreLabelVisible, setLoadingMoreLabelVisible] = useState<boolean>(false);
    const loadingMoreRef = useRef<boolean>(false);

    async function loadFirstPage(query: UserQuery) {
        const paginatedUsers: PaginatedUsers = await getPaginatedUsers(query);
        setUsers(paginatedUsers.users);
        setPagination(paginatedUsers.pagination);
    }

    useEffect(() => {
        void loadFirstPage(query)
    }, [query]);

    async function loadNextPage(query: UserQuery) {
        // Return if a request is already in progress or there are no more pages.
        if (loadingMoreRef.current || !pagination?.hasNextPage) {
            return;
        }

        loadingMoreRef.current = true;
        setLoadingMoreLabelVisible(true);

        try {
            const paginatedUsers: PaginatedUsers = await getPaginatedUsers({
                    ...query,
                    page: pagination.page + 1,
                    limit: pagination.limit
                }
            );

            setUsers((currentUsers) => [
                ...currentUsers,
                ...paginatedUsers.users
            ])

            setPagination(paginatedUsers.pagination)
        } finally {
            loadingMoreRef.current = false;
            setLoadingMoreLabelVisible(false);
        }
    }

    return (
        <main className="user-container">
            <div className="users-heading">
                <div>
                    <span className="eyebrow">Verified operatives</span>
                    <h2>Matching case files</h2>
                </div>
                <p><strong>{pagination?.total}</strong> records found</p>
            </div>
            <div className="users-list">
                <VirtuosoGrid
                    style={{height: "100%"}}
                    listClassName="user-cards"
                    data={users}
                    computeItemKey={(_, user) => user.id}
                    increaseViewportBy={{
                        top: 200,
                        bottom: 600
                    }}
                    endReached={() => loadNextPage(query)}
                    itemContent={(_, user) => (
                        <UserCard {...user}/>
                    )}
                    components={{
                        Footer: () => {
                            if (isLoadingMoreLabelVisible) {
                                return <div>Loading more users…</div>;
                            }
                            return null;
                        }
                    }}
                />
            </div>
        </main>
    );
}

export default UserList;
