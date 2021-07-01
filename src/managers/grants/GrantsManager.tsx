import React, {FunctionComponent, PropsWithChildren, useCallback} from "react";

interface IGrantContext {
  hasGrant: (grant: string) => boolean;
}

export const GrantContext = React.createContext<IGrantContext>(undefined!);

interface IProps extends PropsWithChildren<any> {
  grants: string[];
}

const GrantsManager: FunctionComponent<IProps> = ({grants, children}) => {
  const hasGrant = useCallback(
    (grant: string): boolean => {
      return grants.includes(grant);
    },
    [grants]
  );

  return (
    <GrantContext.Provider
      value={{
        hasGrant,
      }}
    >
      {children}
    </GrantContext.Provider>
  );
};

export default GrantsManager;
