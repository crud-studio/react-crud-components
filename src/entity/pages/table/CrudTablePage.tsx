import React, {useCallback, useMemo, useState} from "react";
import _ from "lodash";
import {FormattedMessage} from "react-intl";
import {useUpdateEffect} from "react-use";
import UpdateManyDialog from "./dialogs/UpdateManyDialog";
import ImportManyDialog from "./dialogs/import/ImportManyDialog";
import TablePage from "./TablePage";
import {AbstractJpaRO, FilterField, UpdatePackUtils, useCrudDeleteMany} from "@crud-studio/react-crud-core";
import {
  Entity,
  EntityComponentActionConfigMany,
  EntityGenericActionConfigMany,
  EntityPredefinedValue,
} from "../../../models/entity";
import {MenuAction} from "../../../models/internal";
import ConfirmationDialog from "../../../components/dialogs/ConfirmationDialog";
import {ActionCreate, ActionDelete, ActionImport, ActionOpenNewTab, ActionUpdate} from "../../../data/menuActions";
import useHasEntityActionType from "../../hooks/useHasEntityActionType";
import EntityComponentActionManyDialog from "./dialogs/EntityComponentActionManyDialog";
import EntityGenericActionManyDialog from "./dialogs/EntityGenericActionManyDialog";
import EntityClientUtils from "../../helpers/EntityClientUtils";
import useGrants from "../../../contexts/grants/hooks/useGrants";
import useEntity from "../../hooks/useEntity";
import useModals from "../../../contexts/modals/hooks/useModals";
import {useNavigate} from "react-router-dom";
import {useSnackbar} from "notistack";

interface IProps<EntityRO extends AbstractJpaRO> {
  entity: Entity<EntityRO>;
  predefinedValues?: EntityPredefinedValue[];
  hiddenColumns?: string[];
  compact?: boolean;
}

const CrudTablePage = <EntityRO extends AbstractJpaRO>({
  entity,
  predefinedValues,
  hiddenColumns,
  compact = false,
}: IProps<EntityRO>) => {
  const {tableRowHeight, getEntityCreateUrl, getEntityDetailsUrl, getColumnGrant} = useEntity();
  const {hasGrant} = useGrants();
  const navigate = useNavigate();
  const {enqueueSnackbar} = useSnackbar();

  const {showModal, getModalKey} = useModals();
  const [updateManyModalId] = useState<string>(_.uniqueId("updateMany_"));
  const [confirmDeleteModalId] = useState<string>(_.uniqueId("confirmDelete_"));
  const [importManyModalId] = useState<string>(_.uniqueId("importMany_"));
  const [genericActionModalId] = useState<string>(_.uniqueId("genericAction_"));
  const [componentActionModalId] = useState<string>(_.uniqueId("componentAction_"));

  const hasEntityActionCreate = useHasEntityActionType(entity, "CREATE");
  const hasEntityActionUpdate = useHasEntityActionType(entity, "UPDATE");
  const hasEntityActionDelete = useHasEntityActionType(entity, "DELETE");

  const [refreshItemsState, setRefreshItemsState] = useState<number>(0);
  const refreshItems = useCallback((): void => {
    setRefreshItemsState((refreshItemsState) => refreshItemsState + 1);
  }, [setRefreshItemsState]);

  const [selectedItems, setSelectedItems] = useState<EntityRO[]>([]);

  const [buttons] = useState<MenuAction[]>([
    ...(hasEntityActionCreate ? [ActionCreate] : []),
    ...(hasEntityActionCreate ? [ActionImport] : []),
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
    ...entity.columns.filter((column) => !hasGrant(getColumnGrant(column))).map<string>((column) => column.name),
  ]);

  const [updateMany] = useState<boolean>(
    hasEntityActionUpdate &&
      _.some(entity.columns, (column) => column.updatableMany && hasGrant(getColumnGrant(column)))
  );

  const [selectedGenericAction, setSelectedGenericAction] = useState<
    EntityGenericActionConfigMany<EntityRO> | undefined
  >(undefined);
  const [selectedComponentAction, setSelectedComponentAction] = useState<
    EntityComponentActionConfigMany<EntityRO> | undefined
  >(undefined);

  const customActions = useMemo<
    (EntityGenericActionConfigMany<EntityRO> | EntityComponentActionConfigMany<EntityRO>)[]
  >(() => entity.client.customActionsMany?.filter((customAction) => hasGrant(customAction.grant)) || [], [entity]);

  const actions = useMemo<MenuAction[]>(
    () => [
      ...(updateMany ? [ActionUpdate] : []),
      ...(hasEntityActionDelete ? [ActionDelete] : []),
      ActionOpenNewTab,
      ...customActions.map<MenuAction>((customAction) => customAction.menuAction),
    ],
    [updateMany, hasEntityActionDelete, customActions]
  );

  const customActionHandler = useCallback(
    (id: string): void => {
      const customAction = _.find(customActions, (customAction) => customAction.menuAction.id === id);
      if (customAction) {
        if (EntityClientUtils.isEntityGenericActionConfigMany(customAction)) {
          setSelectedGenericAction(customAction);
          showModal(genericActionModalId);
        } else if (EntityClientUtils.isEntityComponentActionConfigMany(customAction)) {
          setSelectedComponentAction(customAction);
          showModal(componentActionModalId);
        }
      }
    },
    [customActions]
  );

  const actionsHandler = (selectedItems: EntityRO[], actionId: string): void => {
    if (!selectedItems || !selectedItems.length) {
      enqueueSnackbar(<FormattedMessage id="pages.no-selected-items" />, {variant: "info"});
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
        selectedItems.forEach((selectedItem) => window.open(getEntityDetailsUrl(entity, selectedItem.id)));
        break;
      default:
        customActionHandler(actionId);
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

    navigate(
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
      refreshItems();
    }
    if (deleteState?.failed?.length) {
      if (deleteState?.successful?.length) {
        enqueueSnackbar(<FormattedMessage id="pages.some-items-failed-to-delete" />, {variant: "warning"});
      } else {
        enqueueSnackbar(<FormattedMessage id="pages.all-items-failed-to-delete" />, {variant: "warning"});
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
    navigate(getEntityDetailsUrl(entity, item.id));
  };

  return (
    <>
      <UpdateManyDialog
        modalId={updateManyModalId}
        entity={entity}
        items={selectedItems}
        onUpdateSuccess={refreshItems}
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
        onImportSuccess={refreshItems}
        key={getModalKey(importManyModalId)}
      />
      {!!selectedGenericAction && (
        <EntityGenericActionManyDialog
          modalId={genericActionModalId}
          entity={entity}
          items={selectedItems}
          customAction={selectedGenericAction}
          refreshItems={refreshItems}
          key={getModalKey(genericActionModalId)}
        />
      )}
      {!!selectedComponentAction && (
        <EntityComponentActionManyDialog
          modalId={componentActionModalId}
          entity={entity}
          items={selectedItems}
          customAction={selectedComponentAction}
          refreshItems={refreshItems}
          key={getModalKey(genericActionModalId)}
        />
      )}

      <TablePage
        entity={entity}
        filterFields={filterFields}
        hiddenColumns={aggregatedHiddenColumns}
        rowHeight={tableRowHeight}
        refreshItems={refreshItemsState}
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

export default CrudTablePage;
