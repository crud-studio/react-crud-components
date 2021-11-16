import {Box, Button, Popover, Typography} from "@mui/material";
import React, {FunctionComponent, useEffect, useState} from "react";
import {FormattedMessage} from "react-intl";
import {WizardStepConfig} from "../WizardsContext";
import Confetti from "../../../components/common/Confetti";

interface WizardStepCompletedPopoverProps {
  wizardStepConfig?: WizardStepConfig;
  anchorEl: null | Element | ((element: Element) => Element);
}

const WizardStepCompletedPopover: FunctionComponent<WizardStepCompletedPopoverProps> = ({
  wizardStepConfig,
  anchorEl,
}) => {
  const [show, setShow] = useState<boolean>(false);

  useEffect(() => {
    if (wizardStepConfig) {
      setShow(!!wizardStepConfig);
    }
  }, [wizardStepConfig]);

  return (
    <>
      <Confetti startConfetti={wizardStepConfig} />

      <Popover
        open={show}
        anchorEl={anchorEl}
        anchorOrigin={{horizontal: "center", vertical: "bottom"}}
        transformOrigin={{horizontal: "center", vertical: "top"}}
        onBackdropClick={() => setShow(false)}
      >
        <Box sx={{textAlign: "center", p: 3}}>
          <Box
            component="img"
            sx={{
              maxHeight: 150,
              display: "inline-block",
              mb: 2,
            }}
            alt="Selected wizard step"
            src={wizardStepConfig?.imageUrl}
          />

          <Typography variant="h6">
            <FormattedMessage id={wizardStepConfig?.titleKey || "pages.not-available"} />
          </Typography>

          <Typography variant="body2" sx={{mb: 2, color: (theme) => theme.palette.success.dark}}>
            <FormattedMessage id="pages.completed-step" />
          </Typography>

          <Box>
            <Button color="primary" variant="contained" onClick={() => setShow(false)}>
              <FormattedMessage id="pages.yay" />
            </Button>
          </Box>
        </Box>
      </Popover>
    </>
  );
};
export default WizardStepCompletedPopover;
