import "./FilterOption.css"
import type {ValueCount} from "../../../../server/src/models/user.ts";

function FilterOption({value, count}: ValueCount) {
    return (
        <div className="filter-checkbox">
            <label><input type="checkbox" title="Diving"/> {value}</label>
            <strong>{count}</strong>
        </div>
    );
}

export default FilterOption;