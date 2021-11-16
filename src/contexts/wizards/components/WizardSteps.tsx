import React, {FunctionComponent, ReactNode, useMemo} from "react";
import {WizardStepConfig} from "../WizardsContext";
import useWizardStepStatus from "../hooks/useWizardStepStatus";
import {FormattedMessage} from "react-intl";
import {Avatar, IconButton, List, ListItem, ListItemAvatar, ListItemButton, ListItemText, Theme} from "@mui/material";
import {
  Add as AddIcon,
  Check as CheckIcon,
  KeyboardArrowRight as KeyboardArrowRightIcon,
  Remove as RemoveIcon,
} from "@mui/icons-material";
import {useTheme} from "@mui/material/styles";
import {SxProps} from "@mui/system";

interface WizardStepsProps {
  steps: WizardStepConfig[];
  selectedStepId?: string;
  setSelectedStepId: (wizardStepId: string) => void;
  sx?: SxProps<Theme>;
}

const WizardSteps: FunctionComponent<WizardStepsProps> = ({steps, selectedStepId, setSelectedStepId, sx}) => {
  return (
    <List sx={sx}>
      {steps.map((wizardStepConfig) => {
        return (
          <WizardStepRowView
            wizardStepConfig={wizardStepConfig}
            selected={wizardStepConfig.id === selectedStepId}
            setSelectedStepId={setSelectedStepId}
            key={wizardStepConfig.id}
          />
        );
      })}
    </List>
  );
};
export default WizardSteps;

interface WizardStepRowViewProps {
  wizardStepConfig: WizardStepConfig;
  selected: boolean;
  setSelectedStepId: (wizardStepId: string) => void;
}

const WizardStepRowView: FunctionComponent<WizardStepRowViewProps> = ({
  wizardStepConfig,
  selected,
  setSelectedStepId,
}) => {
  const theme = useTheme();
  const wizardStepStatus = useWizardStepStatus(wizardStepConfig.id);

  const color = useMemo<string>(() => {
    switch (wizardStepStatus?.status) {
      default:
      case "New":
        return theme.palette.grey[500_48];
      case "Skipped":
        return theme.palette.warning.main;
      case "Completed":
        return theme.palette.success.main;
    }
  }, [wizardStepStatus]);

  const icon = useMemo<ReactNode>(() => {
    switch (wizardStepStatus?.status) {
      default:
      case "New":
        return <AddIcon />;
      case "Skipped":
        return <RemoveIcon />;
      case "Completed":
        return <CheckIcon />;
    }
  }, [wizardStepStatus]);

  return (
    <ListItem
      onClick={() => setSelectedStepId(wizardStepConfig.id)}
      selected={selected}
      disablePadding={true}
      secondaryAction={
        <IconButton edge="end" aria-label="select">
          <KeyboardArrowRightIcon />
        </IconButton>
      }
      sx={{cursor: "pointer"}}
    >
      <ListItemButton>
        <ListItemAvatar>
          <Avatar sx={{backgroundColor: color, color: theme.palette.background.paper}}>{icon}</Avatar>
        </ListItemAvatar>

        <ListItemText
          primary={<FormattedMessage id={wizardStepConfig.titleKey} />}
          secondary={<FormattedMessage id="pages.number-of-minutes" values={{minutes: wizardStepConfig.minutes}} />}
        />
      </ListItemButton>
    </ListItem>
  );
};
