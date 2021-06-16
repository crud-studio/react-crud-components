import React, {useState} from "react";
import {FormattedMessage} from "react-intl";
import _ from "lodash";
import {BaseJpaRO} from "@crud-studio/react-crud-core";
import {IPropsEntityColumnData} from "../../../../models/props";

const TableDataBoolean = <EntityRO extends BaseJpaRO>({column, item}: IPropsEntityColumnData<EntityRO>) => {
  const [data] = useState<any>(_.get(item, column.displayName || column.name));

  return <FormattedMessage id={!!data ? "pages.yes" : "pages.no"} />;
};
export default TableDataBoolean;
