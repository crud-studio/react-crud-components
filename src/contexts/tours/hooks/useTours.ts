import {useContext} from "react";
import {ToursContext, ToursContextProps} from "../ToursContext";

const useTours = (): ToursContextProps => {
  const context = useContext(ToursContext);

  if (!context) throw new Error("ToursContext must be used inside ToursProvider");

  return context;
};
export default useTours;
