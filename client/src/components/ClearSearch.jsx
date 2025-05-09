import React from "react";
import { ReactComponent as Cross } from "../Assets/Icon/cross_for_search.svg";
export const ClearSearch = ({ clearSearch, number, className }) => {
  return (
    <Cross
      style={{
        position: "absolute",
        width: "10px",
        height: "10px",
        cursor: "pointer",
      }}
      onClick={clearSearch}
      className={className ? className : number ? "for_search_number" : "for_search_all"}
    />
  );
};
