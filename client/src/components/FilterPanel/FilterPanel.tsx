import "./FilterPanel.css"
import {useEffect, useState} from "react";
import {getFilterOptions} from "../../services/api.ts";
import FilterOption from "../FilterOption/FilterOption.tsx";
import type {FilterOptions, UserFilter} from "../../../../server/src/models/user.ts";

function FilterPanel() {
    const [filterOptions, setFilterOptions] = useState<FilterOptions>({
        hobbies: [],
        nationalities: []
    });

    useEffect(() => {
        async function loadFilterOptions() {
            const options: FilterOptions = await getFilterOptions({} as UserFilter);
            setFilterOptions(options);
        }

        void loadFilterOptions();
    }, [])

    return (
        <aside className="filter-panel-container">
            <div className="filter-panel-title">
                <h2>
                    Refine Records
                </h2>
                <button>Clear all</button>
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
                                              count={valueCount.count}/>
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
                                              count={valueCount.count}/>
                            ))
                        }
                    </div>
                </div>
            </div>
        </aside>
    );
}

export default FilterPanel;