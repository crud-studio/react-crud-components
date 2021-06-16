import React, {useState} from "react";
import _ from "lodash";
import {BaseJpaRO} from "@crud-studio/react-crud-core";
import {FormattedDate} from "react-intl";
import {IPropsEntityColumnData} from "../../../../models/props";

const TableDataDate = <EntityRO extends BaseJpaRO>({column, item}: IPropsEntityColumnData<EntityRO>) => {
  const [data] = useState<any>(_.get(item, column.displayName || column.name));

  return <>{!!data && <FormattedDate value={data} />}</>;
};
export default TableDataDate;
