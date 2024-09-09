import { createContext, useContext } from "react";
import { useToast } from "../components/hooks/use-toast";

export const ToastHandlerContext = createContext();

export const ToastHandlerProvider = ({ children }) => {
  const { toast } = useToast();

  const toastHandler = (msg, vari) => {
    toast({
      variant: vari ? "destructive" : "default",
      description: msg,
    });
  };

  return (
    <ToastHandlerContext.Provider value={toastHandler}>
      {children}
    </ToastHandlerContext.Provider>
  );
};

export function useToastHandler() {
  return useContext(ToastHandlerContext);
}
