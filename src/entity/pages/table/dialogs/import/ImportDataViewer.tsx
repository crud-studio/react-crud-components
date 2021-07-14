import React, {useCallback, useState} from "react";
import {useForm, FormProvider} from "react-hook-form";
import {useUpdateEffect} from "react-use";
import {FormattedMessage} from "react-intl";
import {v4 as uuidv4} from "uuid";
import ImportDataTable from "./ImportDataTable";
import {PartialDeep} from "type-fest";
import {BaseJpaRO, usePagination} from "@crud-studio/react-crud-core";
import {Box, Button, DialogActions, DialogContent, Pagination} from "@material-ui/core";
import {Entity, EntityColumn} from "../../../../../models/entity";
import DialogContentTitle from "../../../../../components/common/DialogContentTitle";
import DialogContentSubTitle from "../../../../../components/common/DialogContentSubTitle";
import EntityUtils from "../../../../helpers/EntityUtils";

interface IProps<EntityRO extends BaseJpaRO> {
  entity: Entity<EntityRO>;
  columns: EntityColumn[];
  items: PartialDeep<EntityRO>[];
  onItemsVerified: (items: PartialDeep<EntityRO>[]) => void;
  onCancel: () => void;
}

const ImportDataViewer = <EntityRO extends BaseJpaRO>({
  entity,
  columns,
  items,
  onItemsVerified,
  onCancel,
}: IProps<EntityRO>) => {
  const [itemsForUpdate, setItemsForUpdate] = useState<(PartialDeep<EntityRO> & {uuid: string})[]>(
    items.map((i) => {
      return {...i, uuid: uuidv4()};
    })
  );

  const [{pageItems, currentPage, totalPages, pageSize}, setCurrentPage] = usePagination<
    PartialDeep<EntityRO> & {uuid: string}
  >(itemsForUpdate);

  const methods = useForm({mode: "onBlur", reValidateMode: "onChange"});
  const [validateNextPage, setValidateNextPage] = useState<boolean>(false);

  useUpdateEffect(() => {
    if (validateNextPage) {
      setValidateNextPage(false);
      methods.handleSubmit(() => {})();
    }
  }, [pageItems]);

  const updateItem = useCallback(
    (item: PartialDeep<EntityRO> & {uuid: string}): void => {
      if (!item?.uuid) {
        return;
      }

      setItemsForUpdate((items) => items.map((i) => (i.uuid !== item.uuid ? i : {...i, ...item})));
    },
    [setItemsForUpdate]
  );

  const deleteItem = useCallback(
    (item: PartialDeep<EntityRO> & {uuid: string}) => {
      if (!item?.uuid) {
        return;
      }

      setItemsForUpdate((items) => items.filter((i) => i.uuid !== item.uuid));
    },
    [setItemsForUpdate]
  );

  const cancel = (): void => {
    if (onCancel) {
      onCancel();
    }
  };

  const nextStep = (): void => {
    if (!verifyItems()) {
      return;
    }

    if (onItemsVerified) {
      onItemsVerified(itemsForUpdate);
    }
  };

  const onSubmit = methods.handleSubmit((data): void => {
    nextStep();
  });

  const verifyItems = () => {
    let firstInvalidIndex = getFirstInvalidItemIndex();
    if (firstInvalidIndex > -1) {
      let invalidIndexPage = Math.ceil((firstInvalidIndex + 1) / pageSize);
      if (invalidIndexPage !== currentPage) {
        setValidateNextPage(true);
        setCurrentPage(invalidIndexPage);
      }
      return false;
    }
    return true;
  };

  const getFirstInvalidItemIndex = () => {
    const itemsLength = itemsForUpdate.length;
    for (let i = 0; i < itemsLength; i++) {
      if (!EntityUtils.isEntityValid<EntityRO>(entity, itemsForUpdate[i])) {
        return i;
      }
    }
    return -1;
  };

  return (
    <>
      <DialogContent sx={{textAlign: "center", pb: 3}}>
        <DialogContentTitle sx={{mb: 0}}>
          <FormattedMessage id="pages.import-check-information" />
        </DialogContentTitle>
        <DialogContentSubTitle>
          <FormattedMessage id="pages.import-check-information-explanation" />
        </DialogContentSubTitle>

        <FormProvider {...methods}>
          <form onSubmit={onSubmit}>
            <ImportDataTable columns={columns} items={pageItems} updateItem={updateItem} deleteItem={deleteItem} />
          </form>
        </FormProvider>
      </DialogContent>

      <DialogActions>
        <Pagination
          page={currentPage}
          count={totalPages}
          onChange={(event, page) => setCurrentPage(page)}
          size="small"
          showFirstButton
          showLastButton
          siblingCount={0}
          boundaryCount={0}
        />
        <Box sx={{flexGrow: 1}} />
        <Button color="primary" variant="outlined" onClick={cancel} sx={{display: {xs: "none", sm: "inline"}}}>
          <FormattedMessage id="pages.cancel" />
        </Button>{" "}
        <Button color="primary" onClick={onSubmit}>
          <FormattedMessage id="pages.continue" />
        </Button>
      </DialogActions>
    </>
  );
};

export default ImportDataViewer;
