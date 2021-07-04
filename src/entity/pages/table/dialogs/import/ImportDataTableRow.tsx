import React, {useCallback, useState} from "react";
import {useDebounce, useUnmount} from "react-use";
import {useFormContext} from "react-hook-form";
import _ from "lodash";
import {PartialDeep} from "type-fest";
import {BaseJpaRO} from "@crud-studio/react-crud-core";
import {FormControl, IconButton, TableCell, TableRow} from "@material-ui/core";
import {ClearOutlined} from "@material-ui/icons";
import {EntityColumn} from "../../../../../models/entity";
import EntityUtils from "../../../../helpers/EntityUtils";
import EntityFieldInput from "../../../../inputs/field/EntityFieldInput";
import EntityFieldComponentError from "../../../../inputs/field/EntityFieldComponentError";

interface IProps<EntityRO extends BaseJpaRO> {
  columns: EntityColumn[];
  item: PartialDeep<EntityRO> & {uuid: string};
  updateItem: (item: PartialDeep<EntityRO> & {uuid: string}) => void;
  deleteItem: (item: PartialDeep<EntityRO> & {uuid: string}) => void;
}

const ImportDataTableRow = <EntityRO extends BaseJpaRO>({columns, item, updateItem, deleteItem}: IProps<EntityRO>) => {
  const {
    formState: {errors},
  } = useFormContext();

  const [itemUpdate, setItemUpdate] = useState<(PartialDeep<EntityRO> & {uuid: string}) | undefined>(undefined);

  const updateItemInternal = useCallback(
    (newValue: PartialDeep<EntityRO>) => {
      setItemUpdate((itemUpdate) => {
        return {
          ...itemUpdate,
          ...newValue,
          uuid: item.uuid,
        };
      });
    },
    [setItemUpdate]
  );

  const [, cancel] = useDebounce(
    () => {
      if (itemUpdate) {
        updateItem(itemUpdate);
      }
    },
    500,
    [itemUpdate]
  );

  useUnmount(() => {
    cancel();
  });

  return (
    <TableRow>
      {columns.map((column) => {
        const inputName = `${item.uuid}_${column.name}`;
        const error = errors[inputName];
        const hasError = !!error;
        return (
          <TableCell key={inputName}>
            <FormControl size="small" variant="outlined" error={hasError} sx={{display: "block"}}>
              <EntityFieldInput
                entityField={column}
                name={inputName}
                defaultValue={EntityUtils.getItemFieldDefaultValue(column, item)}
                onValueChanged={(value) => {
                  const newValue = _.set({}, column.name, value) as PartialDeep<EntityRO>;
                  updateItemInternal(newValue);
                }}
              />

              <EntityFieldComponentError error={error?.message} />
            </FormControl>
          </TableCell>
        );
      })}
      {/*We set width to 1px so td takes minimum space.*/}
      <TableCell sx={{width: "1px"}}>
        <IconButton color="secondary" size="small" onClick={() => deleteItem(item)}>
          <ClearOutlined />
        </IconButton>
      </TableCell>
    </TableRow>
  );
};
export default React.memo(ImportDataTableRow);
