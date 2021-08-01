import React, {useCallback, useState} from "react";
import _ from "lodash";
import {AbstractJpaRO} from "@crud-studio/react-crud-core";
import {IPropsEntityColumnData} from "../../../../models/props";
import {EntityColumn} from "../../../../models/entity";
import EntityUtils from "../../../helpers/EntityUtils";
import {Link} from "@material-ui/core";
import useEntity from "../../../hooks/useEntity";

const TableDataEntityList = <EntityRO extends AbstractJpaRO>({column, item}: IPropsEntityColumnData<EntityRO>) => {
  const {getEntity, getEntityDetailsUrl} = useEntity();

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
        <Link color="primary" underline="hover" onClick={openEntityNewTab}>
          {data}
        </Link>
      )}
    </>
  );
};
export default TableDataEntityList;
