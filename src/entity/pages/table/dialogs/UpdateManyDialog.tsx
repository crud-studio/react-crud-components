import React, {useCallback, useContext, useState} from "react";
import {FormattedMessage} from "react-intl";
import _ from "lodash";
import {FormProvider, useForm} from "react-hook-form";
import {useUpdateEffect} from "react-use";
import {PartialDeep} from "type-fest";
import {BaseJpaRO, useCrudUpdateMany} from "@crud-studio/react-crud-core";
import {Box, Button, Checkbox, Dialog, DialogActions, DialogContent} from "@material-ui/core";
import EntityColumnComponent from "../../details/EntityColumnComponent";
import EntityColumnComponentLabel from "../../details/EntityColumnComponentLabel";
import {Entity, EntityColumn} from "../../../../models/entity";
import {ModalsContext} from "../../../../managers/ModalManager";
import NotificationManager from "../../../../components/notifications/NotificationManager";
import DialogTitleEnhanced from "../../../../components/dialogs/DialogTitleEnhanced";
import StatusButton from "../../../../components/buttons/StatusButton";
import EntityUtils from "../../../helpers/EntityUtils";

interface IProps<EntityRO extends BaseJpaRO> {
  modalId: string;
  entity: Entity<EntityRO>;
  items: EntityRO[];
  onUpdateSuccess?: () => void;
}

const UpdateManyDialog = <EntityRO extends BaseJpaRO>({modalId, entity, items, onUpdateSuccess}: IProps<EntityRO>) => {
  const {isModalOpen, hideModal, hideModalWrapper} = useContext(ModalsContext);

  const methods = useForm();

  const [columnNamesToUpdate, setColumnNamesToUpdate] = useState<string[]>([]);

  const getDefaultItemData = (): PartialDeep<EntityRO> => {
    let itemData: PartialDeep<EntityRO> = {} as PartialDeep<EntityRO>;
    entity.columns
      .filter((column) => column.updatableMany)
      .forEach((column) => {
        _.set(itemData, column.name, EntityUtils.getItemsColumnDefaultValue(column, items));
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
    entity.columns
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
            {entity.columns
              .filter((column) => column.updatableMany)
              .map((column) => (
                <Box sx={{display: "flex", flexDirection: "row", mb: 2}} key={column.name}>
                  <Box sx={{display: "flex", flexDirection: "column"}}>
                    <EntityColumnComponentLabel>&nbsp;</EntityColumnComponentLabel>
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
                    <EntityColumnComponent
                      column={{...column, required: column.required && columnNamesToUpdate.includes(column.name)}}
                      defaultValue={_.get(itemData, column.name)}
                      onValueChanged={(value) => {
                        onValueChanged(value, column.name);
                      }}
                    />
                  </Box>
                </Box>
              ))}
          </form>
        </FormProvider>
      </DialogContent>
      <DialogActions>
        <Button variant="outlined" color="primary" onClick={hideModalWrapper(modalId)}>
          <FormattedMessage id="pages.cancel" />
        </Button>{" "}
        <StatusButton color="primary" onClick={onSubmit} loading={updateState.loading}>
          <FormattedMessage id="pages.submit" />
        </StatusButton>
      </DialogActions>
    </Dialog>
  );
};
export default UpdateManyDialog;
