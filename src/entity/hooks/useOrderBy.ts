import {useContext} from "react";
import {FiltersContext} from "../managers/FilterManager";
import {OrderByContext} from "../managers/OrderByManager";

const useOrderBy = () => {
  const context = useContext(OrderByContext);

  if (!context) throw new Error("OrderBy context must be use inside OrderByManager");

  return context;
};
export default useOrderBy;
