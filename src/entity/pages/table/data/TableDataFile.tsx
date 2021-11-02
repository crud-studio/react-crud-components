import React, {useCallback, useState} from "react";
import _ from "lodash";
import {AbstractJpaRO, MinimalMediaFileRO} from "@crud-studio/react-crud-core";
import {IPropsEntityColumnData} from "../../../../models/props";
import EntityUtils from "../../../helpers/EntityUtils";
import {Link} from "@mui/material";
import {FormattedMessage} from "react-intl";
import MediaFileViewerDialog from "../../../../components/file-viewer/MediaFileViewerDialog";
import NiceModal from "@ebay/nice-modal-react";

const TableDataFile = <EntityRO extends AbstractJpaRO>({column, item}: IPropsEntityColumnData<EntityRO>) => {
  const [data] = useState<MinimalMediaFileRO | undefined>(_.get(item, EntityUtils.getColumnDisplayFieldName(column)));

  const previewFile = useCallback(
    (e: React.MouseEvent): void => {
      e.stopPropagation();

      if (!data) {
        return;
      }

      NiceModal.show(MediaFileViewerDialog, {
        mediaFile: data,
      });
    },
    [data]
  );

  return (
    <>
      {!!data && (
        <Link color="primary" underline="hover" noWrap onClick={previewFile}>
          {data.name || <FormattedMessage id="pages.preview" />}
        </Link>
      )}
    </>
  );
};
export default TableDataFile;
