import React, {useState} from "react";
import _ from "lodash";
import {AbstractJpaRO} from "@crud-studio/react-crud-core";
import {FormattedDate} from "react-intl";
import {IPropsEntityColumnData} from "../../../../models/props";
import EntityUtils from "../../../helpers/EntityUtils";

const TableDataDate = <EntityRO extends AbstractJpaRO>({column, item}: IPropsEntityColumnData<EntityRO>) => {
  const [data] = useState<any>(_.get(item, EntityUtils.getColumnDisplayFieldName(column)));

  return <>{!!data && <FormattedDate value={data} />}</>;
};
export default TableDataDate;
