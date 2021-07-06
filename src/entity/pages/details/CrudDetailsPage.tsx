import React, {useCallback, useContext, useMemo, useState} from "react";
import {useUpdateEffect} from "react-use";
import {RouteComponentProps, withRouter} from "react-router-dom";
import {BaseJpaRO, useCrudDelete, useItemDetailsState} from "@crud-studio/react-crud-core";
import {
  Entity,
  EntityComponentActionConfig,
  EntityCustomTabConfig,
  EntityGenericActionConfig,
  NestedEntity,
} from "../../../models/entity";
import {MenuAction, TabInfo} from "../../../models/internal";
import {ActionDelete, ActionSave} from "../../../data/menuActions";
import {EntityContext} from "../../managers/EntityManager";
import DetailsPageHeading from "./DetailsPageHeading";
import CrudTableNestedEntity from "../table/CrudTableNestedEntity";
import KeyBindingManager from "../../../managers/KeyBindingManager";
import LoadingCenter from "../../../components/common/LoadingCenter";
import TabPanel from "../../../components/layouts/TabPanel";
import {Box} from "@material-ui/core";
import useHasEntityActionType from "../../hooks/useHasEntityActionType";
import EntityDetailsForm from "./components/EntityDetailsForm";
import {GrantContext} from "../../../managers/grants/GrantsManager";
import _ from "lodash";
import {ModalsContext} from "../../../managers/ModalManager";
import EntityGenericActionDialog from "./dialogs/EntityGenericActionDialog";
import EntityUtils from "../../helpers/EntityUtils";
import EntityComponentActionDialog from "./dialogs/EntityComponentActionDialog";

interface IProps<EntityRO extends BaseJpaRO> extends RouteComponentProps {
  entity: Entity<EntityRO>;
}

const CrudDetailsPage = <EntityRO extends BaseJpaRO>({entity, history}: IProps<EntityRO>) => {
  const {showModal, getModalKey} = useContext(ModalsContext);
  const [genericActionModalId] = useState<string>(_.uniqueId("genericAction_"));
  const [componentActionModalId] = useState<string>(_.uniqueId("componentAction_"));

  const {getEntity, getEntityTableUrl, getEntityDetailsUrl} = useContext(EntityContext);
  const {hasGrant} = useContext(GrantContext);

  const hasEntityActionDelete = useHasEntityActionType(entity, "DELETE");

  const {itemId, item, loading, setItem, refreshItem, updateItem, saveItem, saving, hasChanges} =
    useItemDetailsState<EntityRO>(entity, entity.client.generateEmptyEntity, (id?: number) =>
      getEntityDetailsUrl(entity, id)
    );

  const [selectedGenericAction, setSelectedGenericAction] = useState<EntityGenericActionConfig<EntityRO> | undefined>(
    undefined
  );
  const [selectedComponentAction, setSelectedComponentAction] = useState<
    EntityComponentActionConfig<EntityRO> | undefined
  >(undefined);

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
        if (EntityUtils.isEntityGenericActionConfig(customAction)) {
          setSelectedGenericAction(customAction);
          showModal(genericActionModalId);
        } else if (EntityUtils.isEntityComponentActionConfig(customAction)) {
          setSelectedComponentAction(customAction);
          showModal(componentActionModalId);
        }
      }
    },
    [entity]
  );

  const actionsHandler = (id: string): void => {
    switch (id) {
      case ActionSave.id:
        saveItem();
        break;
      case ActionDelete.id:
        deleteItem();
        break;
      default:
        customActionHandler(id);
        break;
    }
  };

  const nestedEntities = useMemo<NestedEntity[]>(
    () => (!!itemId && entity.nestedEntities.filter((nestedEntity) => hasGrant(nestedEntity.grant))) || [],
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
      {id: "details", labelKey: "pages.details"},
      ...nestedEntities.map((nestedEntity) => {
        const nestedEntityEntity = getEntity(nestedEntity.entityName);
        return {
          id: nestedEntityEntity.name,
          labelKey: nestedEntityEntity.client.titleKey,
          lazy: true,
        };
      }),
      ...customTabs.map<TabInfo>((customTab) => ({
        id: customTab.id,
        labelKey: customTab.labelKey,
        lazy: true,
      })),
    ],
    [itemId, entity, customTabs]
  );

  const deleteState = useCrudDelete(entity, itemId);

  useUpdateEffect(() => {
    history.push(getEntityTableUrl(entity));
  }, [deleteState.result]);

  const deleteItem = useCallback((): void => {
    if (itemId > 0) {
      deleteState.executeRequest();
    } else {
      history.push(getEntityTableUrl(entity));
    }
  }, [itemId, entity]);

  return (
    <>
      <KeyBindingManager actions={actions} actionsHandler={actionsHandler} />

      {!!selectedGenericAction && item && (
        <EntityGenericActionDialog
          modalId={genericActionModalId}
          entity={entity}
          item={item}
          customAction={selectedGenericAction}
          setItem={setItem}
          refreshItem={refreshItem}
          key={getModalKey(genericActionModalId)}
        />
      )}
      {!!selectedComponentAction && item && (
        <EntityComponentActionDialog
          modalId={componentActionModalId}
          entity={entity}
          item={item}
          customAction={selectedComponentAction}
          setItem={setItem}
          refreshItem={refreshItem}
          key={getModalKey(genericActionModalId)}
        />
      )}

      {loading && <LoadingCenter />}

      {item && (
        <Box sx={{height: "100%", display: "flex", flexDirection: "column"}} key={item.id}>
          <DetailsPageHeading
            item={item}
            saving={saving}
            hasChanges={hasChanges}
            headingKey={entity.client.titleDetailsKey}
            actions={actions}
            actionsHandler={actionsHandler}
            separator={false}
          />

          <TabPanel
            tabs={tabs}
            sx={{flexGrow: 1, display: "flex", flexDirection: "column"}}
            sxTabContainer={{flexGrow: 1}}
          >
            <EntityDetailsForm
              entity={entity}
              item={item}
              loading={loading}
              updateItem={updateItem}
              key={item.uniqueKey}
            />

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
            <div />
          </TabPanel>
        </Box>
      )}
    </>
  );
};

export default withRouter(CrudDetailsPage);
