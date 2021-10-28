import React, {useCallback, useState} from "react";
import ImportDataUploadView from "./ImportDataUploadView";
import ImportDataViewer from "./ImportDataViewer";
import {FormattedMessage} from "react-intl";
import ImportColumnSelectionWizard from "./ImportColumnSelectionWizard";
import {maxImportRows} from "../../../../../constants/defaultValues";
import _ from "lodash";
import {PartialDeep} from "type-fest";
import {AbstractJpaRO} from "@crud-studio/react-crud-core";
import {Dialog} from "@mui/material";
import ImportFileUpload from "./ImportFileUpload";
import {Entity, EntityColumn, EntityPredefinedValue} from "../../../../../models/entity";
import DialogTitleEnhanced from "../../../../../components/dialogs/DialogTitleEnhanced";
import NotificationManager from "../../../../../components/notifications/NotificationManager";
import useGrants from "../../../../../managers/grants/hooks/useGrants";
import useEntity from "../../../../hooks/useEntity";
import useModals from "../../../../../managers/modals/hooks/useModals";

interface IProps<EntityRO extends AbstractJpaRO> {
  modalId: string;
  entity: Entity<EntityRO>;
  predefinedValues: EntityPredefinedValue[];
  onImportSuccess?: () => void;
}

const ImportManyDialog = <EntityRO extends AbstractJpaRO>({
  modalId,
  entity,
  predefinedValues,
  onImportSuccess,
}: IProps<EntityRO>) => {
  const {isModalOpen, hideModal, hideModalWrapper} = useModals();
  const {parseColumnValue, getColumnGrant} = useEntity();
  const {hasGrant} = useGrants();

  const [entityColumns] = useState<EntityColumn[]>(
    entity.columns.filter(
      (column) => column.updatable && !_.find(predefinedValues, {name: column.name}) && hasGrant(getColumnGrant(column))
    )
  );
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [fileData, setFileData] = useState<unknown[] | undefined>(undefined);
  const [items, setItems] = useState<PartialDeep<EntityRO>[] | undefined>(undefined);

  const onCancel = useCallback((): void => {
    hideModal(modalId);
  }, [hideModal, modalId]);

  const onFileSelected = useCallback(
    (data: any[]) => {
      setFileData(data);
      setCurrentStep((currentStep) => currentStep + 1);
    },
    [setFileData, setCurrentStep]
  );

  const getItems = (
    fileData: unknown[] | undefined,
    selectedColumns: {[key: string]: number},
    maxRows: number
  ): PartialDeep<EntityRO>[] | undefined => {
    if (!fileData) {
      return undefined;
    }

    const columnsMap: {[key: string]: EntityColumn} = _.keyBy(entityColumns, "name");

    return _.slice(fileData, 1, maxRows + 1).map<PartialDeep<EntityRO>>((itemRow: unknown) => {
      let item: any = {
        id: 0,
        creationTime: 0,
        lastUpdateTime: 0,
      };
      _.forEach(predefinedValues, (predefinedValue) => {
        _.set(item, predefinedValue.name, predefinedValue.value);
      });
      _.forOwn(selectedColumns, (columnIndex: number, columnName: string) => {
        const column: EntityColumn = columnsMap[columnName];
        const value = parseColumnValue(column, _.get(itemRow, `[${columnIndex}]`));
        _.set(item, columnName, value);
      });
      return item;
    });
  };

  const onColumnsSelected = (selectedColumns: {[key: string]: number}) => {
    const items: PartialDeep<EntityRO>[] | undefined = getItems(fileData, selectedColumns, maxImportRows);

    if (!!items?.length) {
      setItems(items);
      setCurrentStep((currentStep) => currentStep + 1);
    } else {
      showNoItemsNotification();
      hideModal(modalId);
    }
  };

  const onItemsVerified = (items: PartialDeep<EntityRO>[]) => {
    if (!_.isEmpty(items)) {
      setItems(items);
      setCurrentStep(4);
    } else {
      showNoItemsNotification();
      hideModal(modalId);
    }
  };

  const showNoItemsNotification = () => {
    NotificationManager.warning(<FormattedMessage id="pages.no-items-to-import" />);
  };

  const onUploadSuccess = (items: EntityRO[]) => {
    if (onImportSuccess && !_.isEmpty(items)) {
      onImportSuccess();
    }
  };

  const onUploadCompleted = () => {
    hideModal(modalId);
  };

  return (
    <Dialog open={isModalOpen(modalId)} onClose={hideModalWrapper(modalId)} fullWidth maxWidth="lg">
      <DialogTitleEnhanced onClose={hideModalWrapper(modalId)}>
        <FormattedMessage id="pages.import" />
      </DialogTitleEnhanced>

      {currentStep === 1 && <ImportFileUpload onFileSelected={onFileSelected} />}

      {currentStep === 2 && (
        <ImportColumnSelectionWizard
          columns={entityColumns}
          fileData={fileData || []}
          maxRows={maxImportRows}
          onWizardCompleted={onColumnsSelected}
        />
      )}

      {currentStep === 3 && (
        <ImportDataViewer
          entity={entity}
          columns={entityColumns}
          items={items || []}
          onItemsVerified={onItemsVerified}
          onCancel={onCancel}
        />
      )}

      {currentStep === 4 && (
        <ImportDataUploadView
          entity={entity}
          items={items || []}
          onUploadSuccess={onUploadSuccess}
          onUploadCompleted={onUploadCompleted}
        />
      )}
    </Dialog>
  );
};
export default ImportManyDialog;
