import {useContext} from "react";
import {IOrderByContext, OrderByContext} from "../contexts/OrderByContext";

const useOrderBy = (): IOrderByContext => {
  const context = useContext(OrderByContext);

  if (!context) throw new Error("OrderByContext must be used inside OrderByManager");

  return context;
};
export default useOrderBy;
