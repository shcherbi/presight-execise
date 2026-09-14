import "./FilterPanel.css"
import {type Dispatch, type SetStateAction, useEffect, useState} from "react";
import {getFilterOptions} from "../../services/api.ts";
import FilterOption from "../FilterOption/FilterOption.tsx";
import type {FilterOptions, UserFilter, UserQuery} from "../../../../server/src/models/user.ts";

type FilterPanelProps = {
    setQuery: Dispatch<SetStateAction<UserQuery>>,
    query: UserQuery
};

function FilterPanel({setQuery, query}: FilterPanelProps) {
    const [filterOptions, setFilterOptions] = useState<FilterOptions>({
        hobbies: [],
        nationalities: []
    });

    useEffect(() => {
        async function loadFilterOptions() {
            const userFilter: UserFilter = {
                name: query.name,
                hobbies: query.hobbies,
                nationalities: query.nationalities,
            };

            const options = await getFilterOptions(userFilter);
            setFilterOptions(options);
        }

        void loadFilterOptions();
    }, [query]);

    const [selectedHobbiesFilterOption, setSelectedHobbiesFilterOption] = useState<string[]>([]);
    const [selectedNationalitiesOption, setSelectedNationalitiesOption] = useState<string[]>([]);

    useEffect(() => {
        setQuery((query: UserQuery) => (
            {
                ...query,
                hobbies: selectedHobbiesFilterOption,
                nationalities: selectedNationalitiesOption
            }
        ))
    }, [selectedHobbiesFilterOption, selectedNationalitiesOption]);

    return (
        <aside className="filter-panel-container">
            <div className="filter-panel-title">
                <h2>
                    Refine Records
                </h2>
                <button onClick={() => {
                    setSelectedHobbiesFilterOption([]);
                    setSelectedNationalitiesOption([]);
                }}>Clear all
                </button>
            </div>
            <div className="filter-section-container">
                <div className="filter-section">
                    <div className="filter-heading">
                        <h3>Hobbies</h3>
                        <span>TOP 20</span>
                    </div>
                    <div className="filter-checkboxes">
                        {
                            filterOptions.hobbies.map(valueCount => (
                                <FilterOption key={valueCount.value}
                                              value={valueCount.value}
                                              count={valueCount.count}
                                              selected={selectedHobbiesFilterOption.includes(valueCount.value)}
                                              onSelect={setSelectedHobbiesFilterOption}
                                />
                            ))
                        }
                    </div>
                </div>
                <div className="filter-section">
                    <div className="filter-heading">
                        <h3>Nationalities</h3>
                        <span>TOP 20</span>
                    </div>
                    <div className="filter-checkboxes">
                        {
                            filterOptions.nationalities.map(valueCount => (
                                <FilterOption key={valueCount.value}
                                              value={valueCount.value}
                                              count={valueCount.count}
                                              selected={selectedNationalitiesOption.includes(valueCount.value)}
                                              onSelect={setSelectedNationalitiesOption}
                                />
                            ))
                        }
                    </div>
                </div>
            </div>
        </aside>
    );
}

export default FilterPanel;
