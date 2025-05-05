import { createContext, PropsWithChildren, useContext } from "react";
import { TUser, useMe } from "../../requests/queries";

interface IMeContext {
  me: TUser
}

const meContext = createContext<IMeContext | undefined>(undefined);

export const MeContextProvider = ({ children }: PropsWithChildren) => {
  const { me } = useMe();
  if (!me) return null;
  
  return <meContext.Provider value={{
    me
  }}>{children}</meContext.Provider>
}

export const useMeContext = () => {
  const context = useContext(meContext);

  if (!context) {
    throw new Error('MeContext should be used only with MeContextProvider');
  }

  return context;
}