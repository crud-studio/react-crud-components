import React, {useEffect} from "react";
import {FormattedMessage} from "react-intl";
import {PartialDeep} from "type-fest";
import {useUpdateEffect} from "react-use";
import _ from "lodash";
import {BaseJpaRO, useCrudCreateMany} from "@crud-studio/react-crud-core";
import {Button, DialogActions, DialogContent} from "@material-ui/core";
import {Entity} from "../../../../../models/entity";
import CardTitle from "../../../../../components/common/CardTitle";
import CardSubTitle from "../../../../../components/common/CardSubTitle";
import {Player} from "@lottiefiles/react-lottie-player";
import successLottie from "../../../../../data/lotties/successLottie";
import uploadLottie from "../../../../../data/lotties/uploadLottie";

interface IProps<EntityRO extends BaseJpaRO> {
  entity: Entity<EntityRO>;
  items: PartialDeep<EntityRO>[];
  onUploadSuccess: (items: EntityRO[]) => void;
  onUploadCompleted: () => void;
}

const ImportDataUploadView = <EntityRO extends BaseJpaRO>({
  entity,
  items,
  onUploadSuccess,
  onUploadCompleted,
}: IProps<EntityRO>) => {
  const {
    successful,
    failed,
    executed,
    executeRequest: executeCreate,
  } = useCrudCreateMany<EntityRO, EntityRO>(entity, items);

  useEffect(() => {
    if (!!items.length) {
      executeCreate();
    }
  }, [items]);

  useUpdateEffect(() => {
    if (successful && !_.isEmpty(successful)) {
      onUploadSuccess(successful);
    }
  }, [successful]);

  return (
    <>
      <DialogContent sx={{textAlign: "center"}}>
        {!executed && (
          <>
            <CardTitle sx={{mb: 0}}>
              <FormattedMessage id="pages.uploading-data-now" />
            </CardTitle>
            <CardSubTitle>
              <FormattedMessage id="pages.process-may-take-several-minutes" />
            </CardSubTitle>

            <Player
              autoplay
              loop
              src={uploadLottie}
              style={{height: "200px", width: "200px"}}
              rendererSettings={{
                preserveAspectRatio: "xMidYMid slice",
              }}
            />
          </>
        )}

        {executed && !!successful?.length && (
          <>
            <CardTitle sx={{mb: 0}}>
              <FormattedMessage
                id="pages.data-imported-successfully"
                values={{
                  successCount: successful.length,
                  totalCount: successful.length + (failed?.length || 0),
                }}
              />
            </CardTitle>
            <CardSubTitle>&nbsp;</CardSubTitle>

            <Player
              autoplay
              loop
              src={successLottie}
              style={{height: "200px", width: "200px"}}
              rendererSettings={{
                preserveAspectRatio: "xMidYMid slice",
              }}
            />
          </>
        )}

        {executed && !successful?.length && (
          <CardTitle sx={{mb: 0}}>
            <FormattedMessage id="pages.data-import-failed" />
          </CardTitle>
        )}
      </DialogContent>

      <DialogActions>
        <Button color="primary" onClick={onUploadCompleted} disabled={!executed}>
          <FormattedMessage id="pages.finish" />
        </Button>
      </DialogActions>
    </>
  );
};
export default ImportDataUploadView;