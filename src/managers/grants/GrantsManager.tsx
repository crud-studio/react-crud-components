import React, {FunctionComponent, PropsWithChildren, useCallback} from "react";

interface IGrantContext {
  grants: string[];
  hasGrant: (grant?: string) => boolean;
}

export const GrantContext = React.createContext<IGrantContext>(undefined!);

interface IProps extends PropsWithChildren<any> {
  grants: string[];
}

const GrantsManager: FunctionComponent<IProps> = ({grants, children}) => {
  const hasGrant = useCallback(
    (grant?: string): boolean => {
      return !grant || grants.includes(grant);
    },
    [grants]
  );

  return (
    <GrantContext.Provider
      value={{
        grants,
        hasGrant,
      }}
    >
      {children}
    </GrantContext.Provider>
  );
};

export default GrantsManager;
