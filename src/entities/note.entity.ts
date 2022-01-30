import {ForumOutlined} from "@mui/icons-material";
import {NoteRO} from "../entity/contexts/notes/NotesContext";
import {Entity, EntityActionConfig, EntityActionType} from "../models/entity";

export const noteEntity: Entity<NoteRO> = {
  name: "Note",
  api: {
    type: "Note",
    path: "/secure/note",
    cacheName: "notes",
    defaultOrders: [{by: "id", descending: true}],
  },
  actions: new Map<EntityActionType, EntityActionConfig>([]),
  columns: [],
  nestedEntities: [],
  client: {
    titleKey: "pages.notes",
    titleDetailsKey: "pages.note-details",
    icon: ForumOutlined,
    showDetailsTab: true,
    generateEmptyEntity: () => {
      return {
        id: 0,
        creationTime: 0,
        lastUpdateTime: 0,
        content: "",
        targetType: "",
        targetId: "",
      };
    },
    generateLabel: (item) => {
      return `${item.id}`;
    },
  },
};
