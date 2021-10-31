import React, {useCallback, useState} from "react";
import {FormattedMessage} from "react-intl";
import _ from "lodash";
import {FormProvider, useForm} from "react-hook-form";
import {useUpdateEffect} from "react-use";
import {AbstractJpaRO} from "@crud-studio/react-crud-core";
import {Button, Dialog, DialogActions, DialogContent, DialogContentText, Stack} from "@mui/material";
import {Entity, EntityGenericActionConfig} from "../../../../models/entity";
import DialogTitleEnhanced from "../../../../components/dialogs/DialogTitleEnhanced";
import EntityUtils from "../../../helpers/EntityUtils";
import EntityFieldComponent from "../../../inputs/field/EntityFieldComponent";
import useCustomActionRequest from "../api/useCustomActionRequest";
import {v4 as uuidv4} from "uuid";
import useEntity from "../../../hooks/useEntity";
import useModals from "../../../../contexts/modals/hooks/useModals";
import {LoadingButton} from "@mui/lab";
import {useNavigate} from "react-router-dom";

interface IProps<EntityRO extends AbstractJpaRO> {
  modalId: string;
  entity: Entity<any>;
  item: EntityRO;
  customAction: EntityGenericActionConfig<any>;
  setItem: (item: any & {uniqueKey?: string}) => void;
  refreshItem: () => void;
}

const EntityGenericActionDialog = <EntityRO extends AbstractJpaRO>({
  modalId,
  entity,
  item,
  customAction,
  setItem,
  refreshItem,
  ...rest
}: IProps<EntityRO>) => {
  const {isModalOpen, hideModal, hideModalWrapper} = useModals();
  const {getEntityTableUrl} = useEntity();
  const navigate = useNavigate();

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

  const actionState = useCustomActionRequest(entity, customAction.api, item.id, actionData);

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
          navigate(getEntityTableUrl(entity));
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
        {customAction.menuAction.descriptionKey && (
          <DialogContentText sx={{mb: 2}}>
            <FormattedMessage id={customAction.menuAction.descriptionKey} />
          </DialogContentText>
        )}
        <FormProvider {...methods}>
          <form onSubmit={onSubmit}>
            <Stack spacing={{xs: 2, md: 3}}>
              {customAction.fields.map((entityField) => (
                <EntityFieldComponent
                  entityField={entityField}
                  defaultValue={_.get(actionData, entityField.name)}
                  onValueChanged={(value) => {
                    onValueChanged(value, entityField.name);
                  }}
                  key={entityField.name}
                />
              ))}
            </Stack>
          </form>
        </FormProvider>
      </DialogContent>
      <DialogActions>
        <Button variant="outlined" color="primary" onClick={hideModalWrapper(modalId)}>
          <FormattedMessage id="pages.cancel" />
        </Button>
        <LoadingButton variant="contained" color="primary" onClick={onSubmit} loading={actionState.loading}>
          <FormattedMessage id="pages.submit" />
        </LoadingButton>
      </DialogActions>
    </Dialog>
  );
};
export default EntityGenericActionDialog;
