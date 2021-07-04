import React, {useState} from "react";
import _ from "lodash";
import {BaseJpaRO} from "@crud-studio/react-crud-core";
import {IPropsEntityColumnData} from "../../../../models/props";
import EntityUtils from "../../../helpers/EntityUtils";

const TableDataNumber = <EntityRO extends BaseJpaRO>({column, item}: IPropsEntityColumnData<EntityRO>) => {
  const [data] = useState<any>(_.get(item, EntityUtils.getColumnDisplayFieldName(column)));

  return <>{data}</>;
};
export default TableDataNumber;
