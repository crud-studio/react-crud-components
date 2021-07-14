import {useContext} from "react";
import {FiltersContext} from "../managers/FilterManager";

const useFilters = () => {
  const context = useContext(FiltersContext);

  if (!context) throw new Error("Filters context must be use inside FilterManager");

  return context;
};
export default useFilters;
