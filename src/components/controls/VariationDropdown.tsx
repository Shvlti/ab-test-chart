import React from "react";

interface VariationDropdownProps {
  allVariations: string[];
  selectedVariations: string[];
  onVariationToggle: (variation: string) => void;
  onSelectAll: () => void;
  onSelectOne: () => void;
  isOpen: boolean;
  onToggle: () => void;
}

export const VariationDropdown: React.FC<VariationDropdownProps> = ({
  allVariations,
  selectedVariations,
  onVariationToggle,
  onSelectAll,
  onSelectOne,
  isOpen,
  onToggle,
}) => {
  return (
    <div className="control-group">
      <label className="control-label">
        <h3>Select Variations:</h3>
      </label>
      <div className="custom-dropdown">
        <button className="dropdown-toggle" onClick={onToggle}>
          {selectedVariations.length === allVariations.length
            ? "All Variations"
            : `${selectedVariations.length} selected`}{" "}
          ▼
        </button>

        {isOpen && (
          <div className="dropdown-menu">
            {allVariations.map((variation) => (
              <label key={variation} className="dropdown-option">
                <input
                  type="checkbox"
                  checked={selectedVariations.includes(variation)}
                  onChange={() => onVariationToggle(variation)}
                  disabled={
                    selectedVariations.length === 1 &&
                    selectedVariations.includes(variation)
                  }
                />
                <span>{variation}</span>
              </label>
            ))}
            <div className="dropdown-actions">
              <button className="dropdown-action-btn" onClick={onSelectAll}>
                Select All
              </button>
              <button className="dropdown-action-btn" onClick={onSelectOne}>
                Select One
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
