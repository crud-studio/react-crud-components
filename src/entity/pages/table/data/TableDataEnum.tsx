import React, {useContext, useState} from "react";
import {FormattedMessage} from "react-intl";
import _ from "lodash";
import {BaseJpaRO} from "@crud-studio/react-crud-core";
import {IPropsEntityColumnData} from "../../../../models/props";
import {EntityContext} from "../../../managers/EntityManager";

const TableDataEnum = <EntityRO extends BaseJpaRO>({column, item}: IPropsEntityColumnData<EntityRO>) => {
  const {getEntityEnum} = useContext(EntityContext);

  const [data] = useState<any>(_.get(item, column.displayName || column.name));

  return (
    <>
      {!!data && column.subtype && (
        <FormattedMessage id={getEntityEnum[column.subtype]?.get(data)?.labelKey || "pages.na"} />
      )}
    </>
  );
};
export default TableDataEnum;
