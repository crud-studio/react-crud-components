import React, {useCallback, useState} from "react";
import {useIntl} from "react-intl";
import _ from "lodash";
import {AbstractJpaRO} from "@crud-studio/react-crud-core";
import {IPropsEntityColumnData} from "../../../../models/props";
import {EntityColumn} from "../../../../models/entity";
import EntityUtils from "../../../helpers/EntityUtils";
import useEntity from "../../../contexts/entity/hooks/useEntity";

const TableDataEnumList = <EntityRO extends AbstractJpaRO>({column, item}: IPropsEntityColumnData<EntityRO>) => {
  const intl = useIntl();
  const {getEntityEnum} = useEntity();

  const getData = useCallback((item: EntityRO, column: EntityColumn): string => {
    const displayValue = _.get(item, EntityUtils.getColumnDisplayFieldName(column));
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
