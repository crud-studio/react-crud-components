import {useMemo, useState} from "react";
import {Entity, EntityActionConfig, EntityActionType} from "../../models/entity";
import useGrants from "../../managers/grants/hooks/useGrants";

const useHasEntityActionType = (entity: Entity<any>, entityActionType: EntityActionType) => {
  const {hasGrant} = useGrants();
  const actionConfig = useMemo<EntityActionConfig | undefined>(
    () => entity.actions.get(entityActionType),
    [entity, entityActionType]
  );

  const [hasEntityActionType] = useState<boolean>(!!actionConfig?.active && hasGrant(actionConfig?.grant));
  return hasEntityActionType;
};
export default useHasEntityActionType;
