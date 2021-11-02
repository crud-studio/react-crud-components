import React, {useCallback, useState} from "react";
import _ from "lodash";
import {AbstractJpaRO} from "@crud-studio/react-crud-core";
import {IPropsEntityColumnData} from "../../../../models/props";
import EntityUtils from "../../../helpers/EntityUtils";
import {Link} from "@mui/material";
import UrlActionUtils from "../../../../helpers/UrlActionUtils";
import {EMAIL_REGEX} from "../../../../constants/regex";
import {FormattedMessage} from "react-intl";
import {useSnackbar} from "notistack";

const TableDataEmail = <EntityRO extends AbstractJpaRO>({column, item}: IPropsEntityColumnData<EntityRO>) => {
  const {enqueueSnackbar} = useSnackbar();

  const [data] = useState<any>(_.get(item, EntityUtils.getColumnDisplayFieldName(column)));

  const sendEmail = useCallback(
    (e: React.MouseEvent): void => {
      e.stopPropagation();

      if (!data || !EMAIL_REGEX.test(data)) {
        enqueueSnackbar(<FormattedMessage id="pages.email-invalid" />, {variant: "warning"});
        return;
      }

      UrlActionUtils.sendEmail(data);
    },
    [data]
  );

  return (
    <>
      {!!data && (
        <Link color="primary" underline="hover" noWrap onClick={sendEmail}>
          {data}
        </Link>
      )}
    </>
  );
};
export default TableDataEmail;
