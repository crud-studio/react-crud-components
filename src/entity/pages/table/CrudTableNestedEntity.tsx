import React, {FunctionComponent, useContext, useState} from "react";
import CrudTablePage from "./CrudTablePage";
import {Entity, EntityPredefinedValue, NestedEntity} from "../../../models/entity";
import {EntityContext} from "../../managers/EntityManager";

interface IProps {
  nestedEntity: NestedEntity;
  parentId: number;
}

const CrudTableNestedEntity: FunctionComponent<IProps> = ({nestedEntity, parentId}) => {
  const {getEntity} = useContext(EntityContext);

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
