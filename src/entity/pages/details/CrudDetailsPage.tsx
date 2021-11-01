import React, {useCallback, useMemo} from "react";
import {useUpdateEffect} from "react-use";
import {AbstractJpaRO, useCrudDelete, useItemDetailsState} from "@crud-studio/react-crud-core";
import {
  Entity,
  EntityComponentActionConfig,
  EntityComponentSummaryConfig,
  EntityCustomTabConfig,
  EntityGenericActionConfig,
  EntityGenericSummaryConfig,
  NestedEntity,
} from "../../../models/entity";
import {MenuAction, TabInfo} from "../../../models/internal";
import {ActionDelete, ActionSave} from "../../../data/menuActions";
import DetailsPageHeading from "./DetailsPageHeading";
import CrudTableNestedEntity from "../table/CrudTableNestedEntity";
import KeyBindingManager from "../../../managers/KeyBindingManager";
import LoadingCenter from "../../../components/common/LoadingCenter";
import TabPanel from "../../../components/layouts/TabPanel";
import {Box} from "@mui/material";
import useHasEntityActionType from "../../hooks/useHasEntityActionType";
import EntityDetailsForm from "./components/EntityDetailsForm";
import _ from "lodash";
import EntityGenericActionDialog from "./dialogs/EntityGenericActionDialog";
import EntityComponentActionDialog from "./dialogs/EntityComponentActionDialog";
import EntityClientUtils from "../../helpers/EntityClientUtils";
import EntityUtils from "../../helpers/EntityUtils";
import useGrants from "../../../contexts/grants/hooks/useGrants";
import useEntity from "../../hooks/useEntity";
import ConfirmationDialog from "../../../components/dialogs/ConfirmationDialog";
import {useNavigate} from "react-router-dom";
import EntitySummary from "./components/EntitySummary";
import NiceModal from "@ebay/nice-modal-react";

interface IProps<EntityRO extends AbstractJpaRO> {
  entity: Entity<EntityRO>;
  LoadingComponent?: React.ComponentType;
}

const CrudDetailsPage = <EntityRO extends AbstractJpaRO>({entity, LoadingComponent}: IProps<EntityRO>) => {
  const {getEntity, getEntityTableUrl, getEntityDetailsUrl} = useEntity();
  const {hasGrant} = useGrants();
  const navigate = useNavigate();

  const hasEntityActionDelete = useHasEntityActionType(entity, "DELETE");

  const {itemId, item, loading, setItem, refreshItem, updateItem, saveItem, saving, hasChanges} =
    useItemDetailsState<EntityRO>(entity, entity.client.generateEmptyEntity, (id?: number) =>
      getEntityDetailsUrl(entity, id)
    );

  const customActions = useMemo<(EntityGenericActionConfig<EntityRO> | EntityComponentActionConfig<EntityRO>)[]>(
    () =>
      (!!itemId &&
        item &&
        entity.client.customActions?.filter(
          (customAction) => hasGrant(customAction.grant) && (!customAction.isActive || customAction.isActive(item))
        )) ||
      [],
    [itemId, item, entity]
  );

  const actions = useMemo<MenuAction[]>(
    () => [
      ...(!!itemId && hasEntityActionDelete ? [ActionDelete] : []),
      ...customActions.map<MenuAction>((customAction) => customAction.menuAction),
    ],
    [itemId, hasEntityActionDelete, customActions]
  );

  const customActionHandler = useCallback(
    (id: string): void => {
      const customAction = _.find(customActions, (customAction) => customAction.menuAction.id === id);
      if (customAction) {
        if (EntityClientUtils.isEntityGenericActionConfig(customAction)) {
          NiceModal.show(EntityGenericActionDialog, {
            entity: entity,
            item: item,
            customAction: customAction,
            setItem: setItem,
            refreshItem: refreshItem,
          });
        } else if (EntityClientUtils.isEntityComponentActionConfig(customAction)) {
          NiceModal.show(EntityComponentActionDialog, {
            entity: entity,
            item: item,
            customAction: customAction,
            setItem: setItem,
            refreshItem: refreshItem,
          });
        }
      }
    },
    [customActions]
  );

  const actionsHandler = (actionId: string): void => {
    switch (actionId) {
      case ActionSave.id:
        saveItem();
        break;
      case ActionDelete.id:
        NiceModal.show(ConfirmationDialog, {
          modalTitleKey: "pages.delete",
          modalTextKey: "pages.confirm-delete-item",
          onConfirm: deleteItem,
        });
        break;
      default:
        customActionHandler(actionId);
        break;
    }
  };

  const customSummaries = useMemo<(EntityGenericSummaryConfig<EntityRO> | EntityComponentSummaryConfig<EntityRO>)[]>(
    () =>
      (!!itemId &&
        item &&
        entity.client.customSummaries?.filter(
          (customSummary) => hasGrant(customSummary.grant) && (!customSummary.isActive || customSummary.isActive(item))
        )) ||
      [],
    [itemId, item, entity]
  );

  const nestedEntities = useMemo<NestedEntity[]>(
    () =>
      (!!itemId &&
        entity.nestedEntities.filter((nestedEntity) => {
          const nestedEntityEntity = getEntity(nestedEntity.entityName);
          const grant = EntityUtils.getEntityActionGrant(nestedEntityEntity, "READ");
          return hasGrant(grant);
        })) ||
      [],
    [itemId, entity]
  );

  const customTabs = useMemo<EntityCustomTabConfig<EntityRO>[]>(
    () =>
      (!!itemId &&
        item &&
        entity.client.customTabs?.filter(
          (customTab) => hasGrant(customTab.grant) && (!customTab.isActive || customTab.isActive(item))
        )) ||
      [],
    [itemId, item, entity]
  );

  const tabs = useMemo<TabInfo[]>(
    () => [
      ...(entity.client.showDetailsTab
        ? [{id: "details", labelKey: "pages.details", icon: <entity.client.icon fontSize="small" />}]
        : []),
      ...nestedEntities.map((nestedEntity) => {
        const nestedEntityEntity = getEntity(nestedEntity.entityName);
        return {
          id: nestedEntityEntity.name,
          labelKey: nestedEntityEntity.client.titleKey,
          icon: <nestedEntityEntity.client.icon fontSize="small" />,
          lazy: true,
        };
      }),
      ...customTabs.map<TabInfo>((customTab) => ({
        id: customTab.id,
        labelKey: customTab.labelKey,
        icon: <customTab.icon fontSize="small" />,
        lazy: true,
      })),
    ],
    [entity, nestedEntities, customTabs]
  );

  const deleteState = useCrudDelete(entity, itemId);

  useUpdateEffect(() => {
    navigate(getEntityTableUrl(entity));
  }, [deleteState.result]);

  const deleteItem = useCallback((): void => {
    if (itemId > 0) {
      deleteState.executeRequest();
    } else {
      navigate(getEntityTableUrl(entity));
    }
  }, [itemId, entity]);

  return (
    <>
      <KeyBindingManager actions={actions} actionsHandler={actionsHandler} />

      {loading && !!LoadingComponent && <LoadingComponent />}
      {loading && !LoadingComponent && <LoadingCenter />}

      {item && (
        <Box sx={{height: "100%", display: "flex", flexDirection: "column"}} key={item.id}>
          <DetailsPageHeading
            item={item}
            saving={saving}
            hasChanges={hasChanges}
            headingKey={entity.client.titleDetailsKey}
            actions={actions}
            actionsHandler={actionsHandler}
          />

          <TabPanel
            tabs={tabs}
            sx={{flexGrow: 1, display: "flex", flexDirection: "column"}}
            sxTabContainer={{flexGrow: 1}}
            divider={
              <>
                {customSummaries.map((summaryConfig) => (
                  <EntitySummary
                    summaryConfig={summaryConfig}
                    entity={entity}
                    item={item}
                    refreshItem={refreshItem}
                    key={summaryConfig.id}
                  />
                ))}
              </>
            }
          >
            {entity.client.showDetailsTab && (
              <EntityDetailsForm
                entity={entity}
                item={item}
                loading={loading}
                updateItem={updateItem}
                key={item.uniqueKey}
              />
            )}

            {nestedEntities.map((nestedEntity) => (
              <CrudTableNestedEntity nestedEntity={nestedEntity} parentId={item.id} key={nestedEntity.entityName} />
            ))}

            {customTabs.map((tabConfig) => (
              <tabConfig.component
                entity={entity}
                item={item}
                setItem={setItem}
                refreshItem={refreshItem}
                updateItem={updateItem}
                key={tabConfig.id}
              />
            ))}
          </TabPanel>
        </Box>
      )}
    </>
  );
};
export default CrudDetailsPage;
