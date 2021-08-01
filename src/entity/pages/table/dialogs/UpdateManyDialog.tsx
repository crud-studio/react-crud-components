import React, {useCallback, useMemo, useState} from "react";
import {FormattedMessage} from "react-intl";
import _ from "lodash";
import {FormProvider, useForm} from "react-hook-form";
import {useUpdateEffect} from "react-use";
import {PartialDeep} from "type-fest";
import {AbstractJpaRO, useCrudUpdateMany} from "@crud-studio/react-crud-core";
import {Box, Button, Checkbox, Dialog, DialogActions, DialogContent, Stack} from "@material-ui/core";
import {Entity, EntityColumn} from "../../../../models/entity";
import NotificationManager from "../../../../components/notifications/NotificationManager";
import DialogTitleEnhanced from "../../../../components/dialogs/DialogTitleEnhanced";
import EntityUtils from "../../../helpers/EntityUtils";
import EntityFieldComponent from "../../../inputs/field/EntityFieldComponent";
import EntityFieldComponentLabel from "../../../inputs/field/EntityFieldComponentLabel";
import useGrants from "../../../../managers/grants/hooks/useGrants";
import useEntity from "../../../hooks/useEntity";
import useModals from "../../../../managers/modals/hooks/useModals";
import {LoadingButton} from "@material-ui/lab";

interface IProps<EntityRO extends AbstractJpaRO> {
  modalId: string;
  entity: Entity<EntityRO>;
  items: EntityRO[];
  onUpdateSuccess?: () => void;
}

const UpdateManyDialog = <EntityRO extends AbstractJpaRO>({
  modalId,
  entity,
  items,
  onUpdateSuccess,
}: IProps<EntityRO>) => {
  const {isModalOpen, hideModal, hideModalWrapper} = useModals();
  const {getColumnGrant} = useEntity();
  const {hasGrant} = useGrants();

  const methods = useForm();

  const [columnNamesToUpdate, setColumnNamesToUpdate] = useState<string[]>([]);

  const entityColumns = useMemo<EntityColumn[]>(
    () => entity.columns.filter((column) => column.updatableMany && hasGrant(getColumnGrant(column))),
    [entity]
  );

  const getDefaultItemData = (): PartialDeep<EntityRO> => {
    let itemData: PartialDeep<EntityRO> = {} as PartialDeep<EntityRO>;
    entityColumns.forEach((column) => {
      _.set(itemData, column.name, EntityUtils.getItemsFieldDefaultValue(column, items));
    });
    return itemData;
  };

  const [itemData, setItemData] = useState<PartialDeep<EntityRO>>(getDefaultItemData());

  const onColumnCheck = useCallback(
    (column: EntityColumn): void => {
      setColumnNamesToUpdate((columnNamesToUpdate) => {
        if (columnNamesToUpdate.includes(column.name)) {
          return columnNamesToUpdate.filter((x) => x !== column.name);
        } else {
          return [...columnNamesToUpdate, column.name];
        }
      });
    },
    [setColumnNamesToUpdate]
  );

  const onValueChanged = useCallback(
    (value: any, columnName: string): void => {
      setColumnNamesToUpdate((columnNamesToUpdate) => {
        if (columnNamesToUpdate.includes(columnName)) {
          return columnNamesToUpdate;
        } else {
          return [...columnNamesToUpdate, columnName];
        }
      });

      setItemData((itemData) => {
        return _.set(
          {
            ...itemData,
          },
          columnName,
          value
        );
      });
    },
    [setColumnNamesToUpdate, setItemData]
  );

  const [updateItems, setUpdateItems] = useState<PartialDeep<EntityRO>[] | undefined>(undefined);
  const updateState = useCrudUpdateMany<PartialDeep<EntityRO>, EntityRO>(entity, updateItems);

  useUpdateEffect(() => {
    if (updateItems && !updateState.loading) {
      updateState.executeRequest();
    }
  }, [updateItems]);

  useUpdateEffect(() => {
    if (updateState?.successful?.length) {
      hideModal(modalId);

      if (onUpdateSuccess) {
        onUpdateSuccess();
      }
    }
    if (updateState?.failed?.length) {
      if (updateState?.successful?.length) {
        NotificationManager.warning(<FormattedMessage id="pages.some-items-failed-to-update" />);
      } else {
        NotificationManager.warning(<FormattedMessage id="pages.all-items-failed-to-update" />);
      }
    }
  }, [updateState.successful, updateState.failed]);

  const onSubmit = methods.handleSubmit((data): void => {
    if (!columnNamesToUpdate.length) {
      hideModal(modalId);
      return;
    }

    let updateData: PartialDeep<EntityRO> = {} as PartialDeep<EntityRO>;
    entityColumns
      .filter((column) => columnNamesToUpdate.includes(column.name))
      .forEach((column) => {
        _.set(updateData, column.name, _.get(itemData, column.name));
      });

    setUpdateItems(
      items.map((item) => {
        return {
          ...updateData,
          id: item.id,
        };
      })
    );
  });

  return (
    <Dialog open={isModalOpen(modalId)} onClose={hideModalWrapper(modalId)} fullWidth maxWidth="md">
      <DialogTitleEnhanced onClose={hideModalWrapper(modalId)}>
        <FormattedMessage id="pages.update-selected-items" />
        {` (${items.length})`}
      </DialogTitleEnhanced>
      <DialogContent>
        <FormProvider {...methods}>
          <form onSubmit={onSubmit}>
            <Stack spacing={{xs: 2, md: 3}}>
              {entityColumns.map((column) => (
                <Box sx={{display: "flex", flexDirection: "row"}} key={column.name}>
                  <Box sx={{display: "flex", flexDirection: "column"}}>
                    <EntityFieldComponentLabel entityField={column} required={false}>
                      &nbsp;
                    </EntityFieldComponentLabel>
                    <Box
                      sx={{flexGrow: 1, display: "flex", justifyContent: "center"}}
                      onClick={(event) => {
                        onColumnCheck(column);
                        event.stopPropagation();
                      }}
                    >
                      <Checkbox
                        checked={columnNamesToUpdate.includes(column.name)}
                        size="small"
                        onChange={() => {}}
                        sx={{mr: 1}}
                      />
                    </Box>
                  </Box>

                  <Box sx={{flexGrow: 1}}>
                    <EntityFieldComponent
                      entityField={{...column, required: column.required && columnNamesToUpdate.includes(column.name)}}
                      defaultValue={_.get(itemData, column.name)}
                      onValueChanged={(value) => {
                        onValueChanged(value, column.name);
                      }}
                    />
                  </Box>
                </Box>
              ))}
            </Stack>
          </form>
        </FormProvider>
      </DialogContent>
      <DialogActions>
        <Button variant="outlined" color="primary" onClick={hideModalWrapper(modalId)}>
          <FormattedMessage id="pages.cancel" />
        </Button>{" "}
        <LoadingButton variant="contained" color="primary" onClick={onSubmit} loading={updateState.loading}>
          <FormattedMessage id="pages.submit" />
        </LoadingButton>
      </DialogActions>
    </Dialog>
  );
};
export default UpdateManyDialog;
