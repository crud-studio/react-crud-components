import React, {useMemo} from "react";
import {AbstractJpaRO} from "@crud-studio/react-crud-core";
import {Entity, EntityComponentSummaryConfig, EntityGenericSummaryConfig} from "../../../../models/entity";
import EntityClientUtils from "../../../helpers/EntityClientUtils";
import EntitySummaryGeneric from "./EntitySummaryGeneric";
import {Box} from "@mui/material";

interface IProps<EntityRO extends AbstractJpaRO> {
  summaryConfig: EntityGenericSummaryConfig<EntityRO> | EntityComponentSummaryConfig<EntityRO>;
  entity: Entity<EntityRO>;
  item: EntityRO;
  refreshItem: () => void;
}

const EntitySummary = <EntityRO extends AbstractJpaRO>({
  summaryConfig,
  entity,
  item,
  refreshItem,
}: IProps<EntityRO>) => {
  const summaryConfigGeneric = useMemo<EntityGenericSummaryConfig<EntityRO> | undefined>(
    () => (EntityClientUtils.isEntityGenericSummaryConfig(summaryConfig) ? summaryConfig : undefined),
    [summaryConfig]
  );

  const summaryConfigComponent = useMemo<EntityComponentSummaryConfig<EntityRO> | undefined>(
    () => (EntityClientUtils.isEntityComponentSummaryConfig(summaryConfig) ? summaryConfig : undefined),
    [summaryConfig]
  );

  return (
    <Box sx={{mb: 4}}>
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
