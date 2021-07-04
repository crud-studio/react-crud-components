import React, {useCallback, useContext, useState} from "react";
import _ from "lodash";
import {BaseJpaRO} from "@crud-studio/react-crud-core";
import {IPropsEntityColumnData} from "../../../../models/props";
import {EntityContext} from "../../../managers/EntityManager";
import {EntityColumn} from "../../../../models/entity";
import EntityUtils from "../../../helpers/EntityUtils";

const TableDataEntityList = <EntityRO extends BaseJpaRO>({column, item}: IPropsEntityColumnData<EntityRO>) => {
  const {getEntity, getEntityDetailsUrl} = useContext(EntityContext);

  const getData = useCallback((item: EntityRO, column: EntityColumn): string => {
    const displayValue = _.get(item, EntityUtils.getColumnDisplayFieldName(column));
    if (!displayValue || !_.isArray(displayValue) || _.isEmpty(displayValue)) {
      return "";
    }

    const entity = getEntity(column.subtype);
    return displayValue.map<string>((item) => entity.client.generateLabel(item)).join(", ");
  }, []);

  const [data] = useState<string>(getData(item, column));

  const openEntityNewTab = useCallback(
    (e: React.MouseEvent): void => {
      e.stopPropagation();

      const value = _.get(item, column.name);
      if (!value || !_.isArray(value) || _.isEmpty(value)) {
        return;
      }

      const entity = getEntity(column.subtype);
      value.forEach((id) => window.open(getEntityDetailsUrl(entity, id)));
    },
    [item, column]
  );

  return (
    <>
      {!!data && (
        <a className="text-primary text-decoration-underline" onClick={openEntityNewTab}>
          {data}
        </a>
      )}
    </>
  );
};
export default TableDataEntityList;
