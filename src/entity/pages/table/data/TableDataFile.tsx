import React, {useCallback, useState} from "react";
import _ from "lodash";
import {AbstractJpaRO, MinimalMediaFileRO} from "@crud-studio/react-crud-core";
import {IPropsEntityColumnData} from "../../../../models/props";
import EntityUtils from "../../../helpers/EntityUtils";
import {Link, Portal} from "@material-ui/core";
import {FormattedMessage} from "react-intl";
import useModals from "../../../../managers/modals/hooks/useModals";
import MediaFileViewerDialog from "../../../../components/file-viewer/MediaFileViewerDialog";
import PropagationStopper from "../../../../components/common/PropagationStopper";

const TableDataFile = <EntityRO extends AbstractJpaRO>({column, item}: IPropsEntityColumnData<EntityRO>) => {
  const {showModal, getModalKey} = useModals();
  const [previewModalId] = useState<string>(_.uniqueId("preview"));

  const [data] = useState<MinimalMediaFileRO | undefined>(_.get(item, EntityUtils.getColumnDisplayFieldName(column)));

  const previewFile = useCallback(
    (e: React.MouseEvent): void => {
      e.stopPropagation();

      if (!data) {
        return;
      }

      showModal(previewModalId);
    },
    [data]
  );

  return (
    <>
      {!!data && (
        <>
          <Portal>
            <PropagationStopper>
              <MediaFileViewerDialog modalId={previewModalId} mediaFile={data} key={getModalKey(previewModalId)} />
            </PropagationStopper>
          </Portal>

          <Link color="primary" underline="hover" onClick={previewFile}>
            {data.name || <FormattedMessage id="pages.preview" />}
          </Link>
        </>
      )}
    </>
  );
};
export default TableDataFile;
