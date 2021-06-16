import React, {useCallback, useContext, useState} from "react";
import _ from "lodash";
import {FormattedMessage} from "react-intl";
import {useUpdateEffect} from "react-use";
import UpdateManyDialog from "./dialogs/UpdateManyDialog";
import ImportManyDialog from "./dialogs/import/ImportManyDialog";
import TablePage from "./TablePage";
import {RouteComponentProps, withRouter} from "react-router-dom";
import {BaseJpaRO, FilterField, UpdatePackUtils, useCrudDeleteMany} from "@crud-studio/react-crud-core";
import {Entity, EntityPredefinedValue} from "../../../models/entity";
import {ModalsContext} from "../../../managers/ModalManager";
import {MenuAction} from "../../../models/internal";
import NotificationManager from "../../../components/notifications/NotificationManager";
import ConfirmationDialog from "../../../components/dialogs/ConfirmationDialog";
import {EntityContext} from "../../managers/EntityManager";
import {ActionCreate, ActionDelete, ActionImport, ActionOpenNewTab, ActionUpdate} from "../../../data/menuActions";

interface IProps<EntityRO extends BaseJpaRO> extends RouteComponentProps {
  entity: Entity<EntityRO>;
  predefinedValues?: EntityPredefinedValue[];
  hiddenColumns?: string[];
  compact?: boolean;
}

const CrudTablePage = <EntityRO extends BaseJpaRO>({
  entity,
  predefinedValues,
  hiddenColumns,
  compact = false,
  history,
}: IProps<EntityRO>) => {
  const {getEntityCreateUrl, getEntityDetailsUrl} = useContext(EntityContext);

  const {showModal, getModalKey} = useContext(ModalsContext);
  const [updateManyModalId] = useState<string>(_.uniqueId("updateMany_"));
  const [confirmDeleteModalId] = useState<string>(_.uniqueId("confirmDelete_"));
  const [importManyModalId] = useState<string>(_.uniqueId("importMany_"));

  const [refreshItems, setRefreshItems] = useState<number>(0);
  const [selectedItems, setSelectedItems] = useState<EntityRO[]>([]);

  const [buttons] = useState<MenuAction[]>([
    ...(entity.actions.create ? [ActionCreate] : []),
    ...(entity.actions.create ? [ActionImport] : []),
  ]);

  const buttonsHandler = (buttonId: string): void => {
    switch (buttonId) {
      case ActionCreate.id:
        createItem();
        break;
      case ActionImport.id:
        showModal(importManyModalId);
        break;
      default:
        console.log("buttonsHandler no handler for - button id: ", buttonId);
        break;
    }
  };

  const [filterFields] = useState<FilterField[]>([
    ...(entity.api.customFilterFields || []),
    ...(predefinedValues?.map<FilterField>((predefinedValue) => {
      return {fieldName: predefinedValue.name, values: [predefinedValue.value], operation: "Equal"};
    }) || []),
  ]);

  const [aggregatedHiddenColumns] = useState<string[]>([
    ...(hiddenColumns || []),
    ...(predefinedValues?.map<string>((predefinedValue) => predefinedValue.name) || []),
  ]);

  const [updateMany] = useState<boolean>(
    entity.actions.update && _.some(entity.columns, (column) => column.updatableMany)
  );

  const actions = [
    ...(updateMany ? [ActionUpdate] : []),
    ...(entity.actions.delete ? [ActionDelete] : []),
    ActionOpenNewTab,
  ];

  const actionsHandler = (selectedItems: EntityRO[], actionId: string): void => {
    if (!selectedItems || !selectedItems.length) {
      NotificationManager.info(<FormattedMessage id="pages.no-selected-items" />);
      return;
    }
    setSelectedItems(selectedItems);

    switch (actionId) {
      case ActionUpdate.id:
        showModal(updateManyModalId);
        break;
      case ActionDelete.id:
        showModal(confirmDeleteModalId);
        break;
      case ActionOpenNewTab.id:
        selectedItems.forEach((selectedItem) =>
          window.open(getEntityDetailsUrl(entity, selectedItem.id))
        );
        break;
      default:
        console.log("actionsHandler no handler for - action id: ", actionId);
        break;
    }
  };

  const createItem = useCallback((): void => {
    const queryStringParams: {[key: string]: string} = {};

    if (predefinedValues && !_.isEmpty(predefinedValues)) {
      const updatePackId = UpdatePackUtils.addUpdatePack(
        _.reduce(
          predefinedValues,
          function (updatePack: object, predefinedValue: EntityPredefinedValue) {
            return _.set(updatePack, predefinedValue.name, predefinedValue.value);
          },
          {}
        )
      );
      queryStringParams[UpdatePackUtils.getUpdatePackUrlParam()] = updatePackId;
    }

    history.push(
      getEntityCreateUrl(entity, {
        queryStringParams: queryStringParams,
      })
    );
  }, [predefinedValues]);

  const deleteState = useCrudDeleteMany(
    entity,
    selectedItems?.map((x) => x.id)
  );

  useUpdateEffect(() => {
    if (deleteState?.successful?.length) {
      setRefreshItems((refreshItems) => refreshItems + 1);
    }
    if (deleteState?.failed?.length) {
      if (deleteState?.successful?.length) {
        NotificationManager.warning(<FormattedMessage id="pages.some-items-failed-to-delete" />);
      } else {
        NotificationManager.warning(<FormattedMessage id="pages.all-items-failed-to-delete" />);
      }
    }
  }, [deleteState.successful, deleteState.failed]);

  const deleteSelectedItems = (): void => {
    if (!selectedItems || !selectedItems.length) {
      return;
    }
    deleteState.executeRequest();
  };

  const onClickItem = (item: EntityRO): void => {
    history.push(getEntityDetailsUrl(entity, item.id));
  };

  return (
    <>
      <UpdateManyDialog
        modalId={updateManyModalId}
        entity={entity}
        items={selectedItems}
        onUpdateSuccess={() => setRefreshItems((refreshItems) => refreshItems + 1)}
        key={getModalKey(updateManyModalId)}
      />
      <ConfirmationDialog
        modalId={confirmDeleteModalId}
        modalTitleKey="pages.delete"
        modalTextKey="pages.confirm-delete-selected-items"
        onConfirm={deleteSelectedItems}
        key={getModalKey(confirmDeleteModalId)}
      />
      <ImportManyDialog
        modalId={importManyModalId}
        entity={entity}
        predefinedValues={predefinedValues || []}
        onImportSuccess={() => setRefreshItems((refreshItems) => refreshItems + 1)}
        key={getModalKey(importManyModalId)}
      />

      <TablePage
        entity={entity}
        filterFields={filterFields}
        hiddenColumns={aggregatedHiddenColumns}
        refreshItems={refreshItems}
        compact={compact}
        buttons={buttons}
        buttonsHandler={buttonsHandler}
        actions={actions}
        actionsHandler={actionsHandler}
        onClickItem={onClickItem}
      />
    </>
  );
};

export default withRouter(CrudTablePage);
