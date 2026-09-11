import "./FilterPanel.css"

function FilterPanel() {
    return (
        <aside className="filter-panel-container">
            <div className="filter-panel-title">
            <h2>
                Refine Records
            </h2>
            <button>Clear all</button>
            </div>

            <div className="filter-section">
                <div className="filter-heading">
                    <h3>Hobbies</h3>
                    <span>TOP 20</span>
                </div>
                <div>
                    <div className="filter-checkbox">
                        <label><input type="checkbox" title="Diving"/> Diving</label>
                        <strong>20</strong>
                    </div>
                    <div className="filter-checkbox">
                        <label><input type="checkbox" title="Diving"/> Boxing</label>
                        <strong>10</strong>
                    </div>
                </div>
            </div>
            <div className="filter-section">
                <div className="filter-heading">
                    <h3>Nationalities</h3>
                    <span>TOP 20</span>
                </div>
                <div>
                    <div className="filter-checkbox">
                        <label><input type="checkbox" title="English"/> English</label>
                        <strong>20</strong>
                    </div>
                    <div className="filter-checkbox">
                        <label><input type="checkbox" title="Indus"/> Indus</label>
                        <strong>10</strong>
                    </div>
                </div>
            </div>
        </aside>
    );
}

export default FilterPanel;