import React, {FunctionComponent, ReactNode, useCallback, useState} from "react";
import {Card, Divider, Stack, Tooltip, Typography} from "@mui/material";
import {FormattedMessage} from "react-intl";
import {SxProps} from "@mui/system";
import {Theme} from "@mui/material/styles";
import {CopyToClipboard} from "../../helpers/ClipboardUtils";
import {useCallbackRef} from "../../hooks/useCallbackRef";
import {useSnackbar} from "notistack";

interface IProps {
  info: {labelKey: string; value: ReactNode; key: string}[];
  sx?: SxProps<Theme>;
}

const SummaryInfoCard: FunctionComponent<IProps> = ({info, sx}) => {
  return (
    <Card sx={{overflowX: "auto", py: 3, ...sx}}>
      <Stack direction="row" divider={<Divider orientation="vertical" flexItem />}>
        {info.map((i) => (
          <SummaryInfoValue labelKey={i.labelKey} value={i.value} key={i.key} />
        ))}
      </Stack>
    </Card>
  );
};

export default SummaryInfoCard;

const SummaryInfoValue: FunctionComponent<{labelKey: string; value: ReactNode}> = ({labelKey, value}) => {
  const {enqueueSnackbar} = useSnackbar();

  const [valueText, setValueText] = useState<string>("");

  const valueRef = useCallbackRef<HTMLElement>(null, (current) => setValueText(current?.innerText || ""));

  const onValueClick = useCallback(() => {
    CopyToClipboard.text(valueText, {
      onSuccess: () => enqueueSnackbar(<FormattedMessage id="pages.copy-to-clipboard-success" />, {variant: "success"}),
      onFailure: () => enqueueSnackbar(<FormattedMessage id="pages.copy-to-clipboard-failed" />, {variant: "error"}),
    });
  }, [valueText]);

  return (
    <Stack width={1} sx={{textAlign: "center", alignItems: "center", minWidth: 150, px: 2}}>
      <Typography variant="caption" noWrap sx={{mb: 0.5, color: "text.secondary", display: "block"}}>
        <FormattedMessage id={labelKey} />
      </Typography>
      <Tooltip title={valueText}>
        <Typography
          variant="subtitle1"
          ref={valueRef}
          noWrap
          onClick={onValueClick}
          sx={{display: "inline-flex", maxWidth: "100%", cursor: "pointer"}}
        >
          {value}
        </Typography>
      </Tooltip>
    </Stack>
  );
};
