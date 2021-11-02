import {useContext} from "react";
import {FiltersContext, IFiltersContext} from "../contexts/FilterContext";

const useFilters = (): IFiltersContext => {
  const context = useContext(FiltersContext);

  if (!context) throw new Error("FiltersContext must be used inside FilterManager");

  return context;
};
export default useFilters;
