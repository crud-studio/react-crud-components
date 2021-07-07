import React, {FunctionComponent, useCallback} from "react";
import {Controller, useFormContext} from "react-hook-form";
import {Box, IconButton, OutlinedInput} from "@material-ui/core";
import {IPropsEntityColumnInputType} from "../../../../models/props";
import {FormattedMessage, useIntl} from "react-intl";
import {EMAIL_REGEX} from "../../../../constants/regex";
import {ForwardToInbox, OpenInNewOutlined} from "@material-ui/icons";
import NotificationManager from "../../../../components/notifications/NotificationManager";
import UrlActionUtils from "../../../../helpers/UrlActionUtils";

const EntityFieldInputEmail: FunctionComponent<IPropsEntityColumnInputType> = ({
  entityField,
  name,
  disabled,
  defaultValue,
  onValueChanged,
}) => {
  const intl = useIntl();
  const methods = useFormContext();

  const sendEmail = useCallback((): void => {
    const email = methods.getValues<string>(name);
    if (!email || !EMAIL_REGEX.test(email)) {
      NotificationManager.warning(<FormattedMessage id="pages.email-invalid" />);
      return;
    }

    UrlActionUtils.sendEmail(email);
  }, [name]);

  return (
    <Box sx={{display: "flex", flexDirection: "row"}}>
      <Controller
        name={name}
        rules={{
          required: entityField.required ? intl.formatMessage({id: "pages.required-field"}) : false,
          pattern: {value: EMAIL_REGEX, message: intl.formatMessage({id: "pages.email-invalid"})},
        }}
        control={methods.control}
        defaultValue={defaultValue || null}
        render={({field}) => {
          return (
            <OutlinedInput
              type="email"
              defaultValue={defaultValue || ""}
              onChange={(e) => {
                const inputValue = e.target.value;
                field?.onChange(inputValue);
                onValueChanged(inputValue);
              }}
              disabled={disabled}
              autoComplete="off"
              inputProps={{
                maxLength: 100,
              }}
              ref={field?.ref}
              fullWidth
            />
          );
        }}
      />
      <IconButton color="primary" size="small" onClick={sendEmail}>
        <ForwardToInbox />
      </IconButton>
    </Box>
  );
};
export default EntityFieldInputEmail;
