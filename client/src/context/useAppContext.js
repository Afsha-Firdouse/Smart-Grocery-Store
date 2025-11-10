import { useContext } from "react";
import AppContext from "./AppContext.jsx";

export const useAppContext = () => {
  return useContext(AppContext);
};
