import "./FilterPanel.css"
import {type Dispatch, type SetStateAction, useEffect, useRef, useState} from "react";
import {getFilterOptions} from "../../services/api.ts";
import FilterOption from "../FilterOption/FilterOption.tsx";
import type {FilterOptions, UserFilter, UserQuery, ValueCount} from "../../../../server/src/models/user.ts";

type FilterPanelProps = {
    query: UserQuery,
    setQuery: Dispatch<SetStateAction<UserQuery>>
};


function FilterPanel({query, setQuery}: FilterPanelProps) {
    const [filterOptions, setFilterOptions] = useState<FilterOptions>({
        hobbies: [],
        nationalities: []
    });

    const selectedHobbies = query.hobbies ?? [];
    const selectedNationalities = query.nationalities ?? [];

    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string>();
    const [retryCount, setRetryCount] = useState(0);

    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const openDrawerButtonRef = useRef<HTMLButtonElement>(null);
    const closeDrawerButtonRef = useRef<HTMLButtonElement>(null);

    function closePanel(): void {
        setIsDrawerOpen(false);
        requestAnimationFrame(() => openDrawerButtonRef.current?.focus());
    }

    useEffect(() => {
        if (!isDrawerOpen) {
            return;
        }

        function closeOnEscape(event: KeyboardEvent): void {
            if (event.key === "Escape") {
                closePanel();
            }
        }

        document.addEventListener("keydown", closeOnEscape);
        closeDrawerButtonRef.current?.focus();
        return () => document.removeEventListener("keydown", closeOnEscape);
    }, [isDrawerOpen]);

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
        setQuery(prevQuery => {
            const currentFilterValues = prevQuery[filter] ?? [];
            const nextFilterValues = currentFilterValues.includes(filterValue)
                ? currentFilterValues.filter(currentValue => currentValue !== filterValue)
                : [...currentFilterValues, filterValue];

            return filter === "hobbies"
                ? {...prevQuery, hobbies: nextFilterValues}
                : {...prevQuery, nationalities: nextFilterValues};
        });
    }

    return (
        <>
            <button ref={openDrawerButtonRef} className="filter-panel-toggle" type="button"
                    aria-expanded={isDrawerOpen} aria-controls="filter-panel" onClick={() => setIsDrawerOpen(true)}>
                <span className="filter-panel-toggle-icon" aria-hidden="true"><i/><i/><i/></span>
                Filters
            </button>
            <button className={`filter-panel-backdrop${isDrawerOpen ? " is-open" : ""}`} type="button"
                    aria-label="Close filters" onClick={closePanel}/>
            <aside id="filter-panel" className={`filter-panel-container${isDrawerOpen ? " is-open" : ""}`}>
            <div className="filter-panel-title">
                <h2>Refine Records</h2>
                <div className="filter-panel-actions">
                    <button type="button" onClick={() => {
                        setQuery(currentQuery => ({
                            ...currentQuery,
                            hobbies: [],
                            nationalities: []
                        }));
                    }}>Clear all
                    </button>
                    <button ref={closeDrawerButtonRef} className="filter-panel-close" type="button"
                            aria-label="Close filters" onClick={closePanel}>Close
                    </button>
                </div>
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
        </>
    );
}

export default FilterPanel;
