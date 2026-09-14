import "./FilterOption.css"
import type {ValueCount} from "../../../../server/src/models/user.ts";
import type {Dispatch, SetStateAction} from "react";

type FilterOptionProps = ValueCount & {
    onSelect: Dispatch<SetStateAction<string[]>>;
}

function FilterOption({value, count, onSelect}: FilterOptionProps) {
    return (
        <div className="filter-checkbox">
            <label><input onChange={event => onSelect((values) => {
                const selectedCheckbox: string = event.target.value;
                    if (values.includes(selectedCheckbox)) {
                        return values.filter(currentValue => currentValue !== selectedCheckbox)
                    } else {
                        return [
                            ...values,
                            selectedCheckbox
                        ]
                    }
                }
            )} type="checkbox" value={value}/> {value}</label>
            <strong>{count}</strong>
        </div>
    );
}

export default FilterOption;