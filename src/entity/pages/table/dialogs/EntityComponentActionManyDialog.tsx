import React from "react";
import {FormattedMessage} from "react-intl";
import {BaseJpaRO} from "@crud-studio/react-crud-core";
import {Dialog} from "@material-ui/core";
import {Entity, EntityComponentActionConfigMany} from "../../../../models/entity";
import DialogTitleEnhanced from "../../../../components/dialogs/DialogTitleEnhanced";
import useModals from "../../../../managers/modals/hooks/useModals";

interface IProps<EntityRO> {
  modalId: string;
  entity: Entity<any>;
  items: EntityRO[];
  customAction: EntityComponentActionConfigMany<EntityRO>;
  refreshItems: () => void;
}

const EntityComponentActionManyDialog = <EntityRO extends BaseJpaRO>({
  modalId,
  entity,
  items,
  customAction,
  refreshItems,
}: IProps<EntityRO>) => {
  const {isModalOpen, hideModalWrapper} = useModals();

  return (
    <Dialog open={isModalOpen(modalId)} onClose={hideModalWrapper(modalId)} fullWidth maxWidth="md">
      <DialogTitleEnhanced onClose={hideModalWrapper(modalId)}>
        <FormattedMessage id={customAction.menuAction.labelKey} />
      </DialogTitleEnhanced>
      <customAction.component
        entity={entity}
        items={items}
        customAction={customAction}
        refreshItems={refreshItems}
        finishAction={hideModalWrapper(modalId)}
      />
    </Dialog>
  );
};
export default EntityComponentActionManyDialog;
