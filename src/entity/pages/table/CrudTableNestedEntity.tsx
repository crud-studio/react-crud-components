import React, {FunctionComponent, useState} from "react";
import CrudTablePage from "./CrudTablePage";
import {Entity, EntityPredefinedValue, NestedEntity} from "../../../models/entity";
import useEntity from "../../contexts/entity/hooks/useEntity";

interface IProps {
  nestedEntity: NestedEntity;
  parentId: number;
}

const CrudTableNestedEntity: FunctionComponent<IProps> = ({nestedEntity, parentId}) => {
  const {getEntity} = useEntity();

  const [entity] = useState<Entity<any>>(getEntity(nestedEntity.entityName));

  const [predefinedValues] = useState<EntityPredefinedValue[]>([
    {name: nestedEntity.idColumnName, value: parentId},
    ...(nestedEntity.additionalColumns?.map<EntityPredefinedValue>((column) => {
      return {name: column.name, value: column.value};
    }) || []),
  ]);

  return (
    <CrudTablePage
      entity={entity}
      predefinedValues={predefinedValues}
      hiddenColumns={nestedEntity.hiddenColumns}
      compact={true}
    />
  );
};
export default CrudTableNestedEntity;
