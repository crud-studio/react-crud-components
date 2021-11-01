import React from "react";
import {FormattedMessage} from "react-intl";
import {AbstractJpaRO} from "@crud-studio/react-crud-core";
import {Dialog} from "@mui/material";
import {Entity, EntityComponentActionConfigMany} from "../../../../models/entity";
import DialogTitleEnhanced from "../../../../components/dialogs/DialogTitleEnhanced";
import NiceModal, {muiDialog, useModal} from "@ebay/nice-modal-react";

export type EntityComponentActionManyDialogProps<EntityRO> = {
  entity: Entity<any>;
  items: EntityRO[];
  customAction: EntityComponentActionConfigMany<EntityRO>;
  refreshItems: () => void;
};

const EntityComponentActionManyDialog = NiceModal.create(
  <EntityRO extends AbstractJpaRO>({
    entity,
    items,
    customAction,
    refreshItems,
  }: EntityComponentActionManyDialogProps<EntityRO>) => {
    const modal = useModal();

    const finishHandler = (): void => {
      modal.resolve();
      modal.hide();
    };

    return (
      <Dialog {...muiDialog(modal)} fullWidth maxWidth="md">
        <DialogTitleEnhanced onClose={modal.hide}>
          <FormattedMessage id={customAction.menuAction.labelKey} />
        </DialogTitleEnhanced>
        <customAction.component
          entity={entity}
          items={items}
          customAction={customAction}
          refreshItems={refreshItems}
          finishAction={finishHandler}
        />
      </Dialog>
    );
  }
);
export default EntityComponentActionManyDialog;
