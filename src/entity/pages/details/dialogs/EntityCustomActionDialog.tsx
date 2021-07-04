import React, {useCallback, useContext, useState} from "react";
import {FormattedMessage} from "react-intl";
import _ from "lodash";
import {FormProvider, useForm} from "react-hook-form";
import {useUpdateEffect} from "react-use";
import {BaseJpaRO} from "@crud-studio/react-crud-core";
import {Button, Dialog, DialogActions, DialogContent} from "@material-ui/core";
import {Entity, EntityCustomActionConfig} from "../../../../models/entity";
import {ModalsContext} from "../../../../managers/ModalManager";
import DialogTitleEnhanced from "../../../../components/dialogs/DialogTitleEnhanced";
import StatusButton from "../../../../components/buttons/StatusButton";
import EntityUtils from "../../../helpers/EntityUtils";
import EntityFieldComponent from "../../../inputs/field/EntityFieldComponent";
import useCustomActionRequest from "../api/useCustomActionRequest";
import {RouteComponentProps, withRouter} from "react-router-dom";
import {EntityContext} from "../../../managers/EntityManager";
import {v4 as uuidv4} from "uuid";

interface IProps<EntityRO extends BaseJpaRO> extends RouteComponentProps {
  modalId: string;
  entity: Entity<EntityRO>;
  item: EntityRO;
  customAction: EntityCustomActionConfig;
  setItem: (item: EntityRO & {uniqueKey?: string}) => void;
  refreshItem: () => void;
}

const EntityCustomActionDialog = <EntityRO extends BaseJpaRO>({
  modalId,
  entity,
  item,
  customAction,
  setItem,
  refreshItem,
  ...rest
}: IProps<EntityRO>) => {
  const {isModalOpen, hideModal, hideModalWrapper} = useContext(ModalsContext);
  const {getEntityTableUrl} = useContext(EntityContext);

  const methods = useForm();

  const getDefaultActionData = (): object => {
    let actionData: object = {};
    customAction.fields?.forEach((entityField) => {
      _.set(actionData, entityField.name, EntityUtils.getItemFieldDefaultValue(entityField, item));
    });
    return actionData;
  };

  const [actionData, setActionData] = useState<object>(getDefaultActionData());

  const onValueChanged = useCallback(
    (value: any, fieldName: string): void => {
      setActionData((actionData) => {
        return _.set(
          {
            ...actionData,
          },
          fieldName,
          value
        );
      });
    },
    [setActionData]
  );

  const actionState = useCustomActionRequest(entity, customAction, item.id, actionData);

  useUpdateEffect(() => {
    if (actionState.result) {
      hideModal(modalId);

      switch (customAction.resultBehavior) {
        case "UpdateEntityFromResult":
          setItem(_.merge({uniqueKey: uuidv4()}, actionState.result));
          break;
        case "RefreshEntity":
          refreshItem();
          break;
        case "LeaveEntity":
          rest.history.push(getEntityTableUrl(entity));
          break;
        case "None":
        default:
          break;
      }
    }
  }, [actionState.result]);

  const onSubmit = methods.handleSubmit((data): void => {
    if (!actionState.loading) {
      actionState.executeRequest();
    }
  });

  return (
    <Dialog open={isModalOpen(modalId)} onClose={hideModalWrapper(modalId)} fullWidth maxWidth="md">
      <DialogTitleEnhanced onClose={hideModalWrapper(modalId)}>
        <FormattedMessage id={customAction.menuAction.labelKey} />
      </DialogTitleEnhanced>
      <DialogContent>
        <FormProvider {...methods}>
          <form onSubmit={onSubmit}>
            {customAction.fields.map((entityField) => (
              <EntityFieldComponent
                entityField={entityField}
                defaultValue={_.get(actionData, entityField.name)}
                onValueChanged={(value) => {
                  onValueChanged(value, entityField.name);
                }}
                sx={{mb: 2}}
                key={entityField.name}
              />
            ))}
          </form>
        </FormProvider>
      </DialogContent>
      <DialogActions>
        <Button variant="outlined" color="primary" onClick={hideModalWrapper(modalId)}>
          <FormattedMessage id="pages.cancel" />
        </Button>{" "}
        <StatusButton color="primary" onClick={onSubmit} loading={actionState.loading}>
          <FormattedMessage id="pages.submit" />
        </StatusButton>
      </DialogActions>
    </Dialog>
  );
};
export default withRouter(EntityCustomActionDialog);
