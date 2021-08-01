import React, {useState} from "react";
import {AbstractJpaRO} from "@crud-studio/react-crud-core";
import {EntityColumn, EntityColumnTypeConfig} from "../../../../models/entity";
import {entityColumnTypes} from "../../../column-types/entityColumnTypes";

interface IProps<EntityRO extends AbstractJpaRO> {
  column: EntityColumn;
  item: EntityRO;
}

const TableData = <EntityRO extends AbstractJpaRO>({column, item}: IProps<EntityRO>) => {
  const [inputConfig] = useState<EntityColumnTypeConfig>(entityColumnTypes[column.type]);

  return <inputConfig.dataComponent column={column} item={item} />;
};
export default TableData;
