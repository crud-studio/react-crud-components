import React, {FunctionComponent, ReactNode, useCallback, useState} from "react";
import {Box, Card, Divider, Stack, Tooltip, Typography} from "@material-ui/core";
import {FormattedMessage} from "react-intl";
import {SxProps} from "@material-ui/system";
import {Theme} from "@material-ui/core/styles";
import {CopyToClipboard} from "../../helpers/ClipboardUtils";
import {useCallbackRef} from "../../hooks/useCallbackRef";

interface IProps {
  info: {labelKey: string; value: ReactNode}[];
  sx?: SxProps<Theme>;
}

const SummaryInfoCard: FunctionComponent<IProps> = ({info, sx}) => {
  return (
    <Card sx={{overflowX: "auto", py: 3, ...sx}}>
      <Stack direction="row" divider={<Divider orientation="vertical" flexItem />}>
        {info.map((i, index) => (
          <SummaryInfoValue labelKey={i.labelKey} value={i.value} key={index} />
        ))}
      </Stack>
    </Card>
  );
};

export default SummaryInfoCard;

const SummaryInfoValue: FunctionComponent<{labelKey: string; value: ReactNode}> = ({labelKey, value}) => {
  const [valueText, setValueText] = useState<string>("");

  const valueRef = useCallbackRef<HTMLElement>(null, (current) => setValueText(current?.innerText || ""));

  const onValueClick = useCallback(() => {
    CopyToClipboard.text(valueText);
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
