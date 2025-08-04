import React from "react";
import css from "./SearchBox.module.css";

interface SearchBoxProps {
  onChange: (value: string) => void;
}

const SearchBox: React.FC<SearchBoxProps> = ({ onChange }) => (
  <input
    className={css.input}
    type="text"
    placeholder="Search notes"
    onChange={(e) => onChange(e.target.value)}
  />
);

export default SearchBox;
