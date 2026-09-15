import "./UserList.css"
import {useEffect, useState} from "react";
import type {Pagination, User, UserQuery} from "../../../../server/src/models/user.ts";
import {getPaginatedUsers} from "../../services/api.ts";
import {VirtuosoGrid} from "react-virtuoso";
import UserCard from "../UserCard/UserCard.tsx";

type UserListProps = {
    query: UserQuery;
};

function UserList({query}: UserListProps) {
    const [users, setUsers] = useState<User[]>([]);

    const [page, setPage] = useState(1);
    const [pagination, setPagination] = useState<Pagination>();

    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string>();
    const [retryCount, setRetryCount] = useState(0);

    useEffect(() => {
        let isStale = false;

        async function loadPage() {
            setIsLoading(true);
            setError(undefined);

            try {
                const paginatedUsers = await getPaginatedUsers({...query, page});
                if (!isStale) {
                    setPagination(paginatedUsers.pagination);
                    setUsers(users => page === 1
                        ? paginatedUsers.users
                        : [...users, ...paginatedUsers.users]
                    );
                }
            } catch (error) {
                if (!isStale) {
                    setError(error instanceof Error ? error.message : "Users could not be loaded.");
                }
            } finally {
                if (!isStale) {
                    setIsLoading(false);
                }
            }
        }

        void loadPage();
        return () => {
            isStale = true;
        };
    }, [query, page, retryCount]);

    function retry(): void {
        setRetryCount(count => count + 1);
    }

    return (
        <main className="user-container">
            <div className="users-heading">
                <div>
                    <span className="eyebrow">Verified operatives</span>
                    <h2>Matching case files</h2>
                </div>
                <p><strong>{pagination?.total ?? 0}</strong> records found</p>
            </div>
            <div className="users-list">
                <VirtuosoGrid
                    style={{height: "100%"}}
                    listClassName="user-cards"
                    data={users}
                    increaseViewportBy={{
                        top: 200,
                        bottom: 600
                    }}
                    computeItemKey={(_, user) => user.id}
                    endReached={() => {
                        if (pagination?.hasNextPage) {
                            setPage(pagination.page + 1);
                        }
                    }}
                    itemContent={(_, user) => (
                        <UserCard {...user}/>
                    )}
                    components={{
                        Footer: () => {
                            if (error) {
                                return (
                                    <div className="list-status" role="alert">
                                        <span>{error}</span>
                                        <button className="try-again" type="button" onClick={retry}>Try again</button>
                                    </div>
                                );
                            }

                            if (!isLoading && !error && users.length === 0) {
                                return (
                                    <div className="list-status">
                                        <p>No records match the current search and filters.</p>
                                    </div>
                                );
                            }

                            if (isLoading && users.length > 0) {
                                return <div className="list-footer" role="status">Loading more records...</div>;
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
