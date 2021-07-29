import React, {FunctionComponent, ReactNode, useCallback, useRef} from "react";
import {Box, Card, Divider, Stack, Tooltip, Typography} from "@material-ui/core";
import {FormattedMessage} from "react-intl";
import {SxProps} from "@material-ui/system";
import {Theme} from "@material-ui/core/styles";
import {CopyToClipboard} from "../../helpers/ClipboardUtils";

interface IProps {
  info: {labelKey: string; value: ReactNode}[];
  sx?: SxProps<Theme>;
}

const SummaryInfoCard: FunctionComponent<IProps> = ({info, sx}) => {
  const valueRef = useRef<HTMLElement>();

  const onValueClick = useCallback((value: ReactNode) => {
    CopyToClipboard.text(valueRef.current?.innerText || "");
  }, []);

  return (
    <Card sx={{overflowX: "auto", py: 3, ...sx}}>
      <Stack direction="row" divider={<Divider orientation="vertical" flexItem />}>
        {info.map((i, index) => (
          <Stack width={1} sx={{textAlign: "center", minWidth: 150, px: 2}} key={index}>
            <Typography variant="caption" noWrap sx={{mb: 0.5, color: "text.secondary", display: "block"}}>
              <FormattedMessage id={i.labelKey} />
            </Typography>
            <Typography variant="subtitle1" noWrap>
              <Tooltip title={<>{i.value}</>}>
                <Box component="span" ref={valueRef} onClick={() => onValueClick(i.value)} sx={{cursor: "pointer"}}>
                  {i.value}
                </Box>
              </Tooltip>
            </Typography>
          </Stack>
        ))}
      </Stack>
    </Card>
  );
};

export default SummaryInfoCard;
