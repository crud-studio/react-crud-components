import React, {useCallback, useContext, useState} from "react";
import {FormattedMessage, useIntl} from "react-intl";
import _ from "lodash";
import {BaseJpaRO} from "@crud-studio/react-crud-core";
import {IPropsEntityColumnData} from "../../../../models/props";
import {EntityContext} from "../../../managers/EntityManager";
import {EntityColumn} from "../../../../models/entity";

const TableDataEnumList = <EntityRO extends BaseJpaRO>({column, item}: IPropsEntityColumnData<EntityRO>) => {
  const intl = useIntl();
  const {getEntityEnum} = useContext(EntityContext);

  const getData = useCallback((item: EntityRO, column: EntityColumn): string => {
    const displayValue = _.get(item, column.displayName || column.name);
    if (!displayValue || !_.isArray(displayValue) || _.isEmpty(displayValue)) {
      return "";
    }

    const entityEnum = getEntityEnum(column.subtype);
    return displayValue
      .map<string>((item) => intl.formatMessage({id: entityEnum?.get(item)?.labelKey || "pages.na"}))
      .join(", ");
  }, []);

  const [data] = useState<string>(getData(item, column));

  return <>{data}</>;
};
export default TableDataEnumList;
