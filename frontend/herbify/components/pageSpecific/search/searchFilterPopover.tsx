import React, { FunctionComponent } from "react";
import { Checkbox, FormControlLabel, Popover, Button } from "@mui/material";

// Define PropTypes for FilterFormControlLabel
interface FilterFormControlLabelProps {
  label: string;
  value: string;
  checked: boolean;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export const FilterFormControlLabel: FunctionComponent<FilterFormControlLabelProps> = ({
  label,
  value,
  checked,
  onChange
}) => {
  return (
    <FormControlLabel
      control={
        <Checkbox
          checked={checked}
          onChange={onChange}
          value={value}
        />
      }
      label={label}
    />
  );
};

// Define PropTypes for FilterPopover
interface FilterPopoverProps {
  filterAnchorEl: null | HTMLElement;
  handleCloseFilter: () => void;
  selectedFilters: string[];
  handleFilterOptionChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  applyFilters: () => void;
  filterOptions: string[]; // Add a prop for filter options
}

export const FilterPopover: FunctionComponent<FilterPopoverProps> = ({
  filterAnchorEl,
  handleCloseFilter,
  selectedFilters,
  handleFilterOptionChange,
  applyFilters,
  filterOptions // Receive filter options as a prop
}) => {
  return (
    <Popover
      open={Boolean(filterAnchorEl)}
      anchorEl={filterAnchorEl}
      onClose={handleCloseFilter}
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "right",
      }}
      transformOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
    >
      <div style={{ padding: "16px" }}>
        {filterOptions.map((option) => (
          <FilterFormControlLabel
            key={option}
            label={option}
            value={option}
            checked={selectedFilters.includes(option)}
            onChange={handleFilterOptionChange}
          />
        ))}
      </div>
      <Button onClick={applyFilters}>Apply Filters</Button>
    </Popover>
  );
};
