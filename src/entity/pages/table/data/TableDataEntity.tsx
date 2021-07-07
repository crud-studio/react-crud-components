import React, {useCallback, useContext, useState} from "react";
import _ from "lodash";
import {BaseJpaRO} from "@crud-studio/react-crud-core";
import {IPropsEntityColumnData} from "../../../../models/props";
import {EntityContext} from "../../../managers/EntityManager";
import EntityUtils from "../../../helpers/EntityUtils";
import {Link} from "@material-ui/core";

const TableDataEntity = <EntityRO extends BaseJpaRO>({column, item}: IPropsEntityColumnData<EntityRO>) => {
  const {getEntity, getEntityDetailsUrl} = useContext(EntityContext);

  const [data] = useState<any>(_.get(item, EntityUtils.getColumnDisplayFieldName(column)));

  const openEntityNewTab = useCallback(
    (e: React.MouseEvent): void => {
      e.stopPropagation();

      const value = _.get(item, column.name);
      if (!value) {
        return;
      }

      const entity = getEntity(column.subtype);
      window.open(getEntityDetailsUrl(entity, value));
    },
    [item, column]
  );

  return (
    <>
      {!!data && (
        <Link color="secondary" onClick={openEntityNewTab}>
          {data}
        </Link>
      )}
    </>
  );
};
export default TableDataEntity;
