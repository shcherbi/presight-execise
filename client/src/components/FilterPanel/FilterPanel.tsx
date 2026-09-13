import "./FilterPanel.css"
import {useEffect, useState} from "react";
import type {FilterOptions} from "presight-server/dist/models/user.ts";
import {getFilterOptions} from "../../services/api.ts";
import FilterOption from "../FilterOption/FilterOption.tsx";

function FilterPanel() {
    const [filterOptions, setFilterOptions] = useState<FilterOptions>({
        hobbies: [],
        nationalities: []
    });

    useEffect(() => {
        async function loadFilterOptions() {
            const options = await getFilterOptions({});
            setFilterOptions(options);
        }

        void loadFilterOptions();
    })

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
                    <div>
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
                    <div>
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