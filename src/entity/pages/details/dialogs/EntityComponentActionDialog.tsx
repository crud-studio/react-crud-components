import React, {useContext} from "react";
import {FormattedMessage} from "react-intl";
import {BaseJpaRO} from "@crud-studio/react-crud-core";
import {Dialog} from "@material-ui/core";
import {Entity, EntityComponentActionConfig} from "../../../../models/entity";
import {ModalsContext} from "../../../../managers/ModalManager";
import DialogTitleEnhanced from "../../../../components/dialogs/DialogTitleEnhanced";

interface IProps<EntityRO> {
  modalId: string;
  entity: Entity<any>;
  item: EntityRO;
  customAction: EntityComponentActionConfig<EntityRO>;
  setItem: (item: EntityRO & {uniqueKey?: string}) => void;
  refreshItem: () => void;
}

const EntityComponentActionDialog = <EntityRO extends BaseJpaRO>({
  modalId,
  entity,
  item,
  customAction,
  setItem,
  refreshItem,
}: IProps<EntityRO>) => {
  const {isModalOpen, hideModalWrapper} = useContext(ModalsContext);

  return (
    <Dialog open={isModalOpen(modalId)} onClose={hideModalWrapper(modalId)} fullWidth maxWidth="md">
      <DialogTitleEnhanced onClose={hideModalWrapper(modalId)}>
        <FormattedMessage id={customAction.menuAction.labelKey} />
      </DialogTitleEnhanced>
      <customAction.component
        entity={entity}
        item={item}
        customAction={customAction}
        setItem={setItem}
        refreshItem={refreshItem}
        finishAction={hideModalWrapper(modalId)}
      />
    </Dialog>
  );
};
export default EntityComponentActionDialog;
