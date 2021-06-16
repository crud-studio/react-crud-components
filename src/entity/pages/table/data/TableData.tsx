import React, {useState} from "react";
import {BaseJpaRO} from "@crud-studio/react-crud-core";
import {Typography} from "@material-ui/core";
import {EntityColumn, EntityColumnTypeConfig} from "../../../../models/entity";
import {entityColumnTypes} from "../../../column-types/entityColumnTypes";

interface IProps<EntityRO extends BaseJpaRO> {
  column: EntityColumn;
  item: EntityRO;
}

const TableData = <EntityRO extends BaseJpaRO>({column, item}: IProps<EntityRO>) => {
  const [inputConfig] = useState<EntityColumnTypeConfig>(entityColumnTypes[column.type]);

  return (
    <Typography noWrap variant="body2">
      <inputConfig.dataComponent column={column} item={item} />
    </Typography>
  );
};
export default TableData;
