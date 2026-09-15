import "./FilterPanel.css"
import {type Dispatch, type SetStateAction, useEffect, useState} from "react";
import {getFilterOptions} from "../../services/api.ts";
import FilterOption from "../FilterOption/FilterOption.tsx";
import type {FilterOptions, UserFilter, UserQuery, ValueCount} from "../../../../server/src/models/user.ts";

type FilterPanelProps = {
    setQuery: Dispatch<SetStateAction<UserQuery>>,
    query: UserQuery
};


function FilterPanel({setQuery, query}: FilterPanelProps) {
    const [filterOptions, setFilterOptions] = useState<FilterOptions>({
        hobbies: [],
        nationalities: []
    });
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string>();
    const [retryCount, setRetryCount] = useState(0);
    const selectedHobbies = query.hobbies ?? [];
    const selectedNationalities = query.nationalities ?? [];

    useEffect(() => {
        let isStale = false;

        async function loadFilterOptions() {
            const userFilter: UserFilter = {
                name: query.name,
                hobbies: query.hobbies,
                nationalities: query.nationalities,
            };

            setIsLoading(true);
            setError(undefined);

            try {
                const options = await getFilterOptions(userFilter);
                if (!isStale) {
                    setFilterOptions(options);
                }
            } catch {
                if (!isStale) {
                    setError("Filter options could not be loaded.");
                }
            } finally {
                if (!isStale) {
                    setIsLoading(false);
                }
            }
        }

        void loadFilterOptions();
        return () => {
            isStale = true;
        };
    }, [query.name, query.hobbies, query.nationalities, retryCount]);

    function filterOptionSortingFunction(a: ValueCount, b: ValueCount): number{
        return Number(selectedHobbies.includes(b.value)) - Number(selectedHobbies.includes(a.value));
    }

    function updateFilter(filter: "hobbies" | "nationalities", filterValue: string): void {
        setQuery(currentQuery => {
            const currentFilterValues = currentQuery[filter] ?? [];
            const nextFilterValues = currentFilterValues.includes(filterValue)
                ? currentFilterValues.filter(currentValue => currentValue !== filterValue)
                : [...currentFilterValues, filterValue];

            return filter === "hobbies"
                ? {...currentQuery, hobbies: nextFilterValues}
                : {...currentQuery, nationalities: nextFilterValues};
        });
    }

    return (
        <aside className="filter-panel-container">
            <div className="filter-panel-title">
                <h2>Refine Records</h2>
                <button type="button" onClick={() => {
                    setQuery(currentQuery => ({
                        ...currentQuery,
                        hobbies: [],
                        nationalities: []
                    }));
                }}>Clear all
                </button>
            </div>
            <div className="filter-section-container">
                {isLoading && !filterOptions.hobbies.length && !filterOptions.nationalities.length
                    ? <p className="filter-status" role="status">Loading filter options...</p>
                    : null}
                {error ? (
                    <div className="filter-status error-state" role="alert">
                        <p>{error}</p>
                        <button className="try-again" type="button"
                                onClick={() => setRetryCount(count => count + 1)}>Try again
                        </button>
                    </div>
                ) : null}
                <div className="filter-section">
                    <div className="filter-heading">
                        <h3>Hobbies</h3>
                        <span>TOP 20</span>
                    </div>
                    <div className="filter-checkboxes">
                        {filterOptions.hobbies.toSorted(filterOptionSortingFunction)
                            .map(valueCount => (
                                <FilterOption key={valueCount.value}
                                              value={valueCount.value}
                                              count={valueCount.count}
                                              selected={selectedHobbies.includes(valueCount.value)}
                                              onSelect={() => updateFilter("hobbies", valueCount.value)}
                                />
                            ))}
                    </div>
                </div>
                <div className="filter-section">
                    <div className="filter-heading">
                        <h3>Nationalities</h3>
                        <span>TOP 20</span>
                    </div>
                    <div className="filter-checkboxes">
                        {filterOptions.nationalities.toSorted(filterOptionSortingFunction)
                            .map(valueCount => (
                                <FilterOption key={valueCount.value}
                                              value={valueCount.value}
                                              count={valueCount.count}
                                              selected={selectedNationalities.includes(valueCount.value)}
                                              onSelect={() => updateFilter("nationalities", valueCount.value)}
                                />
                            ))}
                    </div>
                </div>
            </div>
        </aside>
    );
}

export default FilterPanel;
