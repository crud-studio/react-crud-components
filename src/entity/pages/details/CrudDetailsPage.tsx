import React, {useCallback, useContext, useState} from "react";
import {useUpdateEffect} from "react-use";
import {RouteComponentProps, withRouter} from "react-router-dom";
import {BaseJpaRO, useCrudDelete, useItemDetailsState} from "@crud-studio/react-crud-core";
import {Entity} from "../../../models/entity";
import {MenuAction, TabInfo} from "../../../models/internal";
import {ActionDelete, ActionSave} from "../../../data/menuActions";
import {EntityContext} from "../../managers/EntityManager";
import DetailsPageHeading from "./DetailsPageHeading";
import EntityDetailsForm from "./EntityDetailsForm";
import CrudTableNestedEntity from "../table/CrudTableNestedEntity";
import KeyBindingManager from "../../../managers/KeyBindingManager";
import LoadingCenter from "../../../components/common/LoadingCenter";
import TabPanel from "../../../components/layouts/TabPanel";

interface IProps<EntityRO extends BaseJpaRO> extends RouteComponentProps {
  entity: Entity<EntityRO>;
}

const CrudDetailsPage = <EntityRO extends BaseJpaRO>({entity, history}: IProps<EntityRO>) => {
  const {getEntity, getEntityTableUrl, getEntityDetailsUrl} = useContext(EntityContext);

  const {itemId, item, loading, updateItem, saveItem, saving, hasChanges} = useItemDetailsState<EntityRO>(
      entity,
      entity.client.generateEmptyEntity,
      (id?: number) => getEntityDetailsUrl(entity, id)
  );

  const [actions] = useState<MenuAction[]>([
    // ...(entity.actions.update ? [{...ActionSave, visible: true}] : []),
    ...(entity.actions.delete ? [ActionDelete] : []),
  ]);

  const actionsHandler = (id: string): void => {
    switch (id) {
      case ActionSave.id:
        saveItem();
        break;
      case ActionDelete.id:
        deleteItem();
        break;
      default:
        console.log("actionsHandler no handler for - id: ", id);
        break;
    }
  };

  const getItemTabs = useCallback((): TabInfo[] => {
    return [
      {id: "details", labelKey: "pages.details"},
      ...(!!itemId
          ? entity.nestedEntities.map((nestedEntity) => {
            const nestedEntityEntity = getEntity(nestedEntity.entityName);
            return {
              id: nestedEntityEntity.name,
              labelKey: nestedEntityEntity.client.titleKey,
              lazy: true,
            };
          })
          : []),
    ];
  }, [entity, itemId]);

  const [tabs, setTabs] = useState<TabInfo[]>(getItemTabs());

  useUpdateEffect(() => {
    setTabs(getItemTabs());
  }, [itemId]);

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

        {loading && <LoadingCenter />}

        {item && (
            <React.Fragment key={item.id}>
              <DetailsPageHeading
                  item={item}
                  saving={saving}
                  hasChanges={hasChanges}
                  headingKey={entity.client.titleDetailsKey}
                  actions={actions}
                  actionsHandler={actionsHandler}
                  separator={false}
              />

              <TabPanel tabs={tabs}>
                <EntityDetailsForm entity={entity} item={item} loading={loading} updateItem={updateItem} />

                {!!itemId &&
                entity.nestedEntities.map((nestedEntity) => (
                    <CrudTableNestedEntity nestedEntity={nestedEntity} parentId={item.id} key={nestedEntity.entityName} />
                ))}

                <div />
              </TabPanel>
            </React.Fragment>
        )}
      </>
  );
};

export default withRouter(CrudDetailsPage);
