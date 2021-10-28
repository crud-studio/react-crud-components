import {MenuAction} from "../models/internal";
import {
  AddOutlined,
  ArchiveOutlined,
  ClearOutlined,
  CloudUploadOutlined,
  ContentCopyOutlined,
  DeleteOutlined,
  EditOutlined,
  InfoOutlined,
  OpenInBrowserOutlined,
  OpenInNewOutlined,
  RemoveRedEyeOutlined,
  RestoreOutlined,
  SaveOutlined,
  SendOutlined,
  ShareOutlined,
} from "@mui/icons-material";

export const ActionSend: MenuAction = {
  id: "send",
  labelKey: "pages.send",
  icon: SendOutlined,
};
export const ActionSave: MenuAction = {
  id: "save",
  labelKey: "pages.save",
  icon: SaveOutlined,
  keyBinding: "s",
};
export const ActionPreview: MenuAction = {
  id: "preview",
  labelKey: "pages.preview",
  icon: RemoveRedEyeOutlined,
  keyBinding: "p",
};
export const ActionOpen: MenuAction = {
  id: "open",
  labelKey: "pages.open",
  icon: OpenInBrowserOutlined,
};
export const ActionOpenNewTab: MenuAction = {
  id: "openNewTab",
  labelKey: "pages.open-in-new-tab",
  icon: OpenInNewOutlined,
  keyBinding: "o",
};
export const ActionShare: MenuAction = {
  id: "share",
  labelKey: "pages.share",
  icon: ShareOutlined,
};
export const ActionDelete: MenuAction = {
  id: "delete",
  labelKey: "pages.delete",
  icon: DeleteOutlined,
};
export const ActionCreate: MenuAction = {
  id: "create",
  labelKey: "pages.create",
  icon: AddOutlined,
};
export const ActionImport: MenuAction = {
  id: "import",
  labelKey: "pages.import",
  icon: CloudUploadOutlined,
};
export const ActionArchive: MenuAction = {
  id: "archive",
  labelKey: "pages.archive",
  icon: ArchiveOutlined,
};
export const ActionCancel: MenuAction = {
  id: "cancel",
  labelKey: "pages.cancel",
  icon: ClearOutlined,
};
export const ActionUpdate: MenuAction = {
  id: "update",
  labelKey: "pages.update",
  icon: EditOutlined,
};
export const ActionRemove: MenuAction = {
  id: "remove",
  labelKey: "pages.remove",
  icon: DeleteOutlined,
};
export const ActionRestore: MenuAction = {
  id: "restore",
  labelKey: "pages.restore",
  icon: RestoreOutlined,
};
export const ActionDuplicate: MenuAction = {
  id: "duplicate",
  labelKey: "pages.duplicate",
  icon: ContentCopyOutlined,
};
export const ActionMoreInfo: MenuAction = {
  id: "moreInfo",
  labelKey: "pages.more-info",
  icon: InfoOutlined,
};
