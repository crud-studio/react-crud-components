import React, {FunctionComponent, PropsWithChildren, useCallback} from "react";

interface IGrantsContext {
  loggedIn: boolean;
  loggedInType: string;
  loggedInId?: number;
  grants: string[];
  hasGrant: (grant?: string) => boolean;
}

const GrantsContext = React.createContext<IGrantsContext>(undefined!);

interface IProps extends PropsWithChildren<any> {
  loggedIn: boolean;
  loggedInType: string;
  loggedInId?: number;
  grants: string[];
}

const GrantsProvider: FunctionComponent<IProps> = ({grants, loggedIn, loggedInType, loggedInId, children}) => {
  const hasGrant = useCallback(
    (grant?: string): boolean => {
      return !grant || grants.includes(grant);
    },
    [grants]
  );

  return (
    <GrantsContext.Provider
      value={{
        loggedIn,
        loggedInType,
        loggedInId,
        grants,
        hasGrant,
      }}
    >
      {children}
    </GrantsContext.Provider>
  );
};

export {IGrantsContext, GrantsContext, GrantsProvider};
