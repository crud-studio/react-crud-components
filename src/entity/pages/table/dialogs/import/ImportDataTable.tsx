import React, {useCallback} from "react";
import {FormattedMessage} from "react-intl";
import ImportDataTableRow from "./ImportDataTableRow";
import {PartialDeep} from "type-fest";
import {BaseJpaRO} from "@crud-studio/react-crud-core";
import {FormLabel, Table, TableBody, TableCell, TableHead, TableRow} from "@material-ui/core";
import {EntityColumn} from "../../../../../models/entity";

interface IProps<EntityRO extends BaseJpaRO> {
  columns: EntityColumn[];
  items: (PartialDeep<EntityRO> & {uuid: string})[];
  // updateItem: (item: PartialDeep<EntityRO> & {uuid: string}) => void;
  updateItem: (item: any) => void;
  // deleteItem: (item: PartialDeep<EntityRO> & {uuid: string}) => void;
  deleteItem: (item: any) => void;
}

const ImportDataTable = <EntityRO extends BaseJpaRO>({columns, items, updateItem, deleteItem}: IProps<EntityRO>) => {
  // const updateItemInternal = useCallback((item: PartialDeep<EntityRO> & {uuid: string}): void => {
  const updateItemInternal = useCallback(
    (item: any): void => {
      updateItem(item);
    },
    [updateItem]
  );

  // const deleteItemInternal = useCallback((item: PartialDeep<EntityRO> & {uuid: string}): void => {
  const deleteItemInternal = useCallback(
    (item: any): void => {
      deleteItem(item);
    },
    [deleteItem]
  );

  return (
    <Table size="small">
      <TableHead>
        <TableRow>
          {columns.map((column) => (
            <TableCell key={column.name}>
              <FormLabel required={column.required}>
                <FormattedMessage id={column.titleKey} />
              </FormLabel>
            </TableCell>
          ))}
          <TableCell />
        </TableRow>
      </TableHead>
      <TableBody>
        {items.map((item) => {
          return (
            <ImportDataTableRow
              columns={columns}
              item={item}
              updateItem={updateItemInternal}
              deleteItem={deleteItemInternal}
              key={item.uuid}
            />
          );
        })}
      </TableBody>
    </Table>
  );
};
export default ImportDataTable;
