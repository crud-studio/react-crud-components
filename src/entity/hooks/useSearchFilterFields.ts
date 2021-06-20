import {useCallback, useContext, useState} from "react";
import {useUpdateEffect} from "react-use";
import {FilterField} from "@crud-studio/react-crud-core";
import {Entity} from "../../models/entity";
import {EntityContext} from "../managers/EntityManager";

const useSearchFilterFields = (entity: Entity<any>, search: string | undefined): FilterField[] => {
  const {isColumnSearchable, getColumnSearchFilterField} = useContext(EntityContext);

  const getFilterFields = useCallback((): FilterField[] => {
    if (search) {
      return [
        {
          operation: "Or",
          children: entity.columns
            .filter((column) => isColumnSearchable(column, search))
            .map((column) => getColumnSearchFilterField(column, search)),
        },
      ];
    } else {
      return [];
    }
  }, [entity, search]);

  const [filterFields, setFilterFields] = useState<any[]>(getFilterFields());

  useUpdateEffect(() => {
    setFilterFields(getFilterFields());
  }, [entity, search]);

  return filterFields;
};

export default useSearchFilterFields;
