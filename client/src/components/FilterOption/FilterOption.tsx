import "./FilterOption.css"
import type {ValueCount} from "../../../../server/src/models/user.ts";

type FilterOptionProps = ValueCount & {
    onSelect: () => void;
    selected: boolean;
}

function FilterOption({value, count, onSelect, selected}: FilterOptionProps) {
    return (
        <div className="filter-checkbox">
            <label>
                <input
                    type="checkbox"
                    checked={selected}
                    onChange={onSelect}
                />
                {value}
            </label>
            <strong>{count}</strong>
        </div>
    );
}

export default FilterOption;
