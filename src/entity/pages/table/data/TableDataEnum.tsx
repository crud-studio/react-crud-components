import React, {useCallback, useContext, useState} from "react";
import {useIntl} from "react-intl";
import _ from "lodash";
import {BaseJpaRO} from "@crud-studio/react-crud-core";
import {IPropsEntityColumnData} from "../../../../models/props";
import {EntityContext} from "../../../managers/EntityManager";
import {EntityColumn} from "../../../../models/entity";
import EntityUtils from "../../../helpers/EntityUtils";

const TableDataEnum = <EntityRO extends BaseJpaRO>({column, item}: IPropsEntityColumnData<EntityRO>) => {
  const intl = useIntl();
  const {getEntityEnum} = useContext(EntityContext);

  const getData = useCallback((item: EntityRO, column: EntityColumn): string => {
    const displayValue = _.get(item, EntityUtils.getColumnDisplayFieldName(column));
    if (!displayValue) {
      return "";
    }
    return intl.formatMessage({id: getEntityEnum(column.subtype)?.get(displayValue)?.labelKey || "pages.na"});
  }, []);

  const [data] = useState<string>(getData(item, column));

  return <>{data}</>;
};
export default TableDataEnum;
