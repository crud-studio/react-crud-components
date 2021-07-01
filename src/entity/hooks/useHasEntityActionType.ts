import {useContext, useMemo, useState} from "react";
import {Entity, EntityActionType} from "../../models/entity";
import {GrantContext} from "../../managers/grants/GrantsManager";

const useHasEntityActionType = (entity: Entity<any>, entityActionType: EntityActionType) => {
  const {hasGrant} = useContext(GrantContext);
  const actionConfig = useMemo(() => entity.actions.get(entityActionType), [entity, entityActionType]);

  const [hasEntityActionType] = useState<boolean>(!!actionConfig?.active && hasGrant(actionConfig?.grant));
  return hasEntityActionType;
};
export default useHasEntityActionType;
