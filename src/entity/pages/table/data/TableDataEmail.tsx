import React, {useCallback, useState} from "react";
import _ from "lodash";
import {BaseJpaRO} from "@crud-studio/react-crud-core";
import {IPropsEntityColumnData} from "../../../../models/props";
import EntityUtils from "../../../helpers/EntityUtils";
import {Link} from "@material-ui/core";
import UrlActionUtils from "../../../../helpers/UrlActionUtils";
import {EMAIL_REGEX} from "../../../../constants/regex";
import NotificationManager from "../../../../components/notifications/NotificationManager";
import {FormattedMessage} from "react-intl";

const TableDataEmail = <EntityRO extends BaseJpaRO>({column, item}: IPropsEntityColumnData<EntityRO>) => {
  const [data] = useState<any>(_.get(item, EntityUtils.getColumnDisplayFieldName(column)));

  const sendEmail = useCallback(
    (e: React.MouseEvent): void => {
      e.stopPropagation();

      if (!data || !EMAIL_REGEX.test(data)) {
        NotificationManager.warning(<FormattedMessage id="pages.email-invalid" />);
        return;
      }

      UrlActionUtils.sendEmail(data);
    },
    [data]
  );

  return (
    <>
      {!!data && (
        <Link color="secondary" onClick={sendEmail}>
          {data}
        </Link>
      )}
    </>
  );
};
export default TableDataEmail;
