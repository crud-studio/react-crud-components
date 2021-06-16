import React, {useState} from "react";
import _ from "lodash";
import {BaseJpaRO} from "@crud-studio/react-crud-core";
import {IPropsEntityColumnData} from "../../../../models/props";

const TableDataTextArea = <EntityRO extends BaseJpaRO>({column, item}: IPropsEntityColumnData<EntityRO>) => {
  const [data] = useState<any>(_.get(item, column.displayName || column.name));

  return <>{data}</>;
};
export default TableDataTextArea;
