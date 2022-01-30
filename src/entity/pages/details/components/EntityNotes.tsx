import React from "react";
import {AbstractJpaRO} from "@crud-studio/react-crud-core";
import {Card} from "@mui/material";
import {Entity} from "../../../../models/entity";
import NotesWindow from "../../../../components/notes/NotesWindow";

interface IProps<EntityRO extends AbstractJpaRO> {
  entity: Entity<EntityRO>;
  item: EntityRO;
}

const EntityNotes = <EntityRO extends AbstractJpaRO>({entity, item}: IProps<EntityRO>) => {
  return (
    <Card sx={{height: "100%", display: "flex"}}>
      <NotesWindow targetType={entity.api.type} targetId={item.id} />
    </Card>
  );
};
export default EntityNotes;
