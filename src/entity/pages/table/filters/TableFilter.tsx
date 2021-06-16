import React, {FunctionComponent, useState} from "react";
import {EntityColumn, EntityColumnTypeConfig} from "../../../../models/entity";
import {entityColumnTypes} from "../../../column-types/entityColumnTypes";

interface IProps {
  column: EntityColumn;
}

const TableFilter: FunctionComponent<IProps> = ({column}) => {
  const [inputConfig] = useState<EntityColumnTypeConfig>(entityColumnTypes[column.type]);

  return <inputConfig.filterComponent column={column} />;
};
export default TableFilter;
