import React, {FunctionComponent, useCallback, useRef, useState} from "react";
import {Document, Page, pdfjs} from "react-pdf";
import {IPropsFileViewerDriver} from "../../../models/props";
import AutoSizer from "react-virtualized-auto-sizer";
import {FormattedMessage, useIntl} from "react-intl";
import {Box, Pagination, Typography} from "@mui/material";
import PasswordDialog from "../../dialogs/PasswordDialog";
import NiceModal from "@ebay/nice-modal-react";

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

interface IProps extends IPropsFileViewerDriver {}

const PdfViewer: FunctionComponent<IProps> = ({fileData}) => {
  const intl = useIntl();

  const [numPages, setNumPages] = useState<number | undefined>(undefined);
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [passwordDismissed, setPasswordDismissed] = useState<boolean>(false);
  const passwordCallback = useRef<((password: string) => void) | null>(null);

  const onDocumentLoadSuccess = useCallback(
    ({numPages}): void => {
      setNumPages(numPages);
    },
    [setNumPages]
  );

  const onPasswordSubmitted = useCallback((password): void => {
    if (passwordCallback && passwordCallback.current && password) {
      passwordCallback.current(password);
    }
  }, []);

  const onPasswordDismissed = useCallback((): void => {
    setPasswordDismissed(true);
  }, [setPasswordDismissed]);

  const onPasswordProtected = useCallback((callback): void => {
    passwordCallback.current = callback;

    NiceModal.show(PasswordDialog, {
      modalTitleKey: "pages.password-protected-pdf",
      modalTextKey: "pages.insert-pdf-password",
      onPassword: onPasswordSubmitted,
      onPasswordDismissed: onPasswordDismissed,
    });
  }, []);

  return (
    <Box>
      <Box sx={{textAlign: "center", mb: 2}}>
        <Pagination
          page={pageNumber}
          count={numPages || 0}
          size="large"
          variant="outlined"
          shape="rounded"
          showFirstButton
          showLastButton
          onChange={(event, page) => setPageNumber(page)}
          sx={{display: "inline-block"}}
        />
      </Box>

      {passwordDismissed && (
        <Typography variant="body2">
          <FormattedMessage id="error.cannot-open-pdf-password" />
        </Typography>
      )}

      {fileData && !passwordDismissed && (
        <AutoSizer disableHeight={true}>
          {({width}) => (
            <Document
              file={fileData}
              onLoadSuccess={onDocumentLoadSuccess}
              onPassword={onPasswordProtected}
              error={intl.formatMessage({id: "error.failed-load-pdf-file"})}
              externalLinkTarget="_blank"
            >
              <Page
                pageNumber={pageNumber}
                width={width}
                error={intl.formatMessage({id: "error.failed-load-pdf-page"})}
              />
            </Document>
          )}
        </AutoSizer>
      )}
    </Box>
  );
};
export default PdfViewer;
