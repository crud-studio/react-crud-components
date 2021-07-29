import React, {useMemo} from "react";
import {BaseJpaRO} from "@crud-studio/react-crud-core";
import {Entity, EntityComponentSummaryConfig, EntityGenericSummaryConfig} from "../../../../models/entity";
import EntityClientUtils from "../../../helpers/EntityClientUtils";
import EntitySummaryGeneric from "./EntitySummaryGeneric";
import {Box} from "@material-ui/core";

interface IProps<EntityRO extends BaseJpaRO> {
  summaryConfig: EntityGenericSummaryConfig<EntityRO> | EntityComponentSummaryConfig<EntityRO>;
  entity: Entity<EntityRO>;
  item: EntityRO;
  refreshItem: () => void;
}

const EntitySummary = <EntityRO extends BaseJpaRO>({summaryConfig, entity, item, refreshItem}: IProps<EntityRO>) => {
  const summaryConfigGeneric = useMemo<EntityGenericSummaryConfig<EntityRO> | undefined>(
    () => (EntityClientUtils.isEntityGenericSummaryConfig(summaryConfig) ? summaryConfig : undefined),
    [summaryConfig]
  );

  const summaryConfigComponent = useMemo<EntityComponentSummaryConfig<EntityRO> | undefined>(
    () => (EntityClientUtils.isEntityComponentSummaryConfig(summaryConfig) ? summaryConfig : undefined),
    [summaryConfig]
  );

  return (
    <Box sx={{mb: 3}}>
      {summaryConfigGeneric && (
        <EntitySummaryGeneric
          summaryConfig={summaryConfigGeneric}
          entity={entity}
          item={item}
          refreshItem={refreshItem}
        />
      )}

      {summaryConfigComponent && (
        <summaryConfigComponent.component entity={entity} item={item} refreshItem={refreshItem} />
      )}
    </Box>
  );
};
export default EntitySummary;
