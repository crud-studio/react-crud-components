import React, {useCallback, useState} from "react";
import _ from "lodash";
import {AbstractJpaRO} from "@crud-studio/react-crud-core";
import {IPropsEntityColumnData} from "../../../../models/props";
import EntityUtils from "../../../helpers/EntityUtils";
import {Link} from "@mui/material";
import useEntity from "../../../contexts/entity/hooks/useEntity";

const TableDataEntity = <EntityRO extends AbstractJpaRO>({column, item}: IPropsEntityColumnData<EntityRO>) => {
  const {getEntity, getEntityDetailsUrl} = useEntity();

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
        <Link color="primary" underline="hover" noWrap onClick={openEntityNewTab}>
          {data}
        </Link>
      )}
    </>
  );
};
export default TableDataEntity;
