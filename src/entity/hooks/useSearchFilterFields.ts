import {useCallback, useState} from "react";
import {useUpdateEffect} from "react-use";
import {FilterField} from "@crud-studio/react-crud-core";
import {Entity} from "../../models/entity";
import useGrants from "../../contexts/grants/hooks/useGrants";
import useEntity from "../contexts/entity/hooks/useEntity";

const useSearchFilterFields = (entity: Entity<any>, search: string | undefined): FilterField[] => {
  const {isColumnSearchable, getColumnSearchFilterField, getColumnGrant} = useEntity();
  const {hasGrant} = useGrants();

  const getFilterFields = useCallback((): FilterField[] => {
    if (search) {
      return [
        {
          operation: "Or",
          children: entity.columns
            .filter((column) => isColumnSearchable(column, search) && hasGrant(getColumnGrant(column)))
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
