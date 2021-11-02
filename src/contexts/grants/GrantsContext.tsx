import React, {FunctionComponent, PropsWithChildren, useCallback} from "react";

interface IGrantsContext {
  grants: string[];
  hasGrant: (grant?: string) => boolean;
}

const GrantsContext = React.createContext<IGrantsContext>(undefined!);

interface IProps extends PropsWithChildren<any> {
  grants: string[];
}

const GrantsProvider: FunctionComponent<IProps> = ({grants, children}) => {
  const hasGrant = useCallback(
    (grant?: string): boolean => {
      return !grant || grants.includes(grant);
    },
    [grants]
  );

  return (
    <GrantsContext.Provider
      value={{
        grants,
        hasGrant,
      }}
    >
      {children}
    </GrantsContext.Provider>
  );
};

export {IGrantsContext, GrantsContext, GrantsProvider};
