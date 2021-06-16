import {useCallback, useState} from "react";
import {useUpdateEffect} from "react-use";
import {FilterField} from "@crud-studio/react-crud-core";
import {Entity} from "../../models/entity";
import {entityColumnTypes} from "../column-types/entityColumnTypes";

const useSearchFilterFields = (entity: Entity<any>, search: string | null | undefined): FilterField[] => {
  const getFilterFields = useCallback((): FilterField[] => {
    if (search) {
      return [
        {
          operation: "Or",
          children: entity.columns
            .filter((column) => column.searchable && entityColumnTypes[column.type].isSearchable(column, search))
            .map((column) => entityColumnTypes[column.type].getSearchFilterField(column, search)),
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
