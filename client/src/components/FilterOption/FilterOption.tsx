import "./FilterOption.css"
import type {ValueCount} from "../../../../server/src/models/user.ts";
import type {Dispatch, SetStateAction} from "react";

type FilterOptionProps = ValueCount & {
    onSelect: Dispatch<SetStateAction<string[]>>;
    selected: boolean;
}

function FilterOption({value, count, onSelect, selected}: FilterOptionProps) {
    return (
        <div className="filter-checkbox">
            <label>
                <input
                    type="checkbox"
                    checked={selected}
                    onChange={() => onSelect(values =>
                        selected
                            ? values.filter(currentValue => currentValue !== value)
                            : [...values, value]
                    )}
                />
                {value}
            </label>
            <strong>{count}</strong>
        </div>
    );
}

export default FilterOption;
