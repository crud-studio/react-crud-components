import React, {ReactNode, useMemo} from "react";
import _ from "lodash";
import {AbstractJpaRO} from "@crud-studio/react-crud-core";
import {Entity, EntityGenericSummaryConfig} from "../../../../models/entity";
import SummaryInfoCard from "../../../../components/cards/SummaryInfoCard";
import TableData from "../../table/data/TableData";
import {v4 as uuidv4} from "uuid";

interface IProps<EntityRO extends AbstractJpaRO> {
  summaryConfig: EntityGenericSummaryConfig<EntityRO>;
  entity: Entity<EntityRO>;
  item: EntityRO;
  refreshItem: () => void;
}

const EntitySummaryGeneric = <EntityRO extends AbstractJpaRO>({
  summaryConfig,
  entity,
  item,
  refreshItem,
}: IProps<EntityRO>) => {
  const info = useMemo<{labelKey: string; value: ReactNode; key: string}[]>(
    () =>
      summaryConfig.columns.map<{labelKey: string; value: ReactNode; key: string}>((summaryColumn) => {
        const entityColumn = _.find(entity.columns, (c) => c.name === summaryColumn.name);
        if (!entityColumn) {
          return {
            labelKey: "pages.na",
            value: <></>,
            key: "na",
          };
        }
        return {
          labelKey: entityColumn.titleKey || "",
          value: <TableData column={entityColumn} item={item} />,
          key: uuidv4(),
        };
      }),
    [summaryConfig, entity, item]
  );

  return <SummaryInfoCard info={info} />;
};
export default EntitySummaryGeneric;
