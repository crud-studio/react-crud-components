import React, {useCallback, useMemo, useState} from "react";
import {FormattedMessage} from "react-intl";
import _ from "lodash";
import {FormProvider, useForm} from "react-hook-form";
import {useUpdateEffect} from "react-use";
import {AbstractJpaRO} from "@crud-studio/react-crud-core";
import {Button, Dialog, DialogActions, DialogContent, DialogContentText, Stack} from "@mui/material";
import {Entity, EntityGenericActionConfigMany} from "../../../../models/entity";
import DialogTitleEnhanced from "../../../../components/dialogs/DialogTitleEnhanced";
import EntityUtils from "../../../helpers/EntityUtils";
import EntityFieldComponent from "../../../inputs/field/EntityFieldComponent";
import useCustomActionRequest from "../../details/api/useCustomActionRequest";
import {LoadingButton} from "@mui/lab";
import NiceModal, {useModal} from "@ebay/nice-modal-react";

export type EntityGenericActionManyDialogProps<EntityRO extends AbstractJpaRO> = {
  entity: Entity<any>;
  items: EntityRO[];
  customAction: EntityGenericActionConfigMany<EntityRO>;
  refreshItems: () => void;
};

const EntityGenericActionManyDialog = NiceModal.create(
  <EntityRO extends AbstractJpaRO>({
    entity,
    items,
    customAction,
    refreshItems,
  }: EntityGenericActionManyDialogProps<EntityRO>) => {
    const modal = useModal();

    const methods = useForm();

    const getDefaultActionData = (): object => {
      let actionData: object = {};
      customAction.fields?.forEach((entityField) => {
        _.set(actionData, entityField.name, EntityUtils.getItemsFieldDefaultValue(entityField, items));
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

    const itemIds = useMemo<number[]>(() => items.map<number>((item) => item.id), [items]);
    const actionState = useCustomActionRequest(entity, customAction.api, itemIds, actionData);

    useUpdateEffect(() => {
      if (actionState.result) {
        switch (customAction.resultBehavior) {
          case "RefreshEntity":
            refreshItems();
            break;
          case "None":
          default:
            break;
        }

        modal.resolve();
        modal.hide();
      }
    }, [actionState.result]);

    const onSubmit = methods.handleSubmit((data): void => {
      if (!actionState.loading) {
        actionState.executeRequest();
      }
    });

    return (
      <Dialog
        open={modal.visible}
        onClose={() => modal.hide()}
        TransitionProps={{
          onExited: () => modal.remove(),
        }}
        fullWidth
        maxWidth="md"
      >
        <DialogTitleEnhanced onClose={modal.hide}>
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
          <Button variant="outlined" color="primary" onClick={modal.hide}>
            <FormattedMessage id="pages.cancel" />
          </Button>
          <LoadingButton variant="contained" color="primary" onClick={onSubmit} loading={actionState.loading}>
            <FormattedMessage id="pages.submit" />
          </LoadingButton>
        </DialogActions>
      </Dialog>
    );
  }
);
export default EntityGenericActionManyDialog;
