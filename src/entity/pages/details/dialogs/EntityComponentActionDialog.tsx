import React from "react";
import {FormattedMessage} from "react-intl";
import {AbstractJpaRO} from "@crud-studio/react-crud-core";
import {Dialog} from "@mui/material";
import {Entity, EntityComponentActionConfig} from "../../../../models/entity";
import DialogTitleEnhanced from "../../../../components/dialogs/DialogTitleEnhanced";
import NiceModal, {useModal} from "@ebay/nice-modal-react";

export type IProps<EntityRO> = {
  entity: Entity<any>;
  item: EntityRO;
  customAction: EntityComponentActionConfig<EntityRO>;
  setItem: (item: EntityRO & {uniqueKey?: string}) => void;
  refreshItem: () => void;
};

const EntityComponentActionDialog = NiceModal.create(
  <EntityRO extends AbstractJpaRO>({entity, item, customAction, setItem, refreshItem}: IProps<EntityRO>) => {
    const modal = useModal();

    const finishHandler = (): void => {
      modal.resolve();
      modal.hide();
    };

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
        <customAction.component
          entity={entity}
          item={item}
          customAction={customAction}
          setItem={setItem}
          refreshItem={refreshItem}
          finishAction={finishHandler}
        />
      </Dialog>
    );
  }
);
export default EntityComponentActionDialog;
