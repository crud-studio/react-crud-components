import ImportColumnSelection from "./ImportColumnSelection";
import React, {FunctionComponent, useState} from "react";
import _ from "lodash";
import {useUpdateEffect} from "react-use";
import {EntityColumn} from "../../../../../models/entity";

interface IProps {
  columns: EntityColumn[];
  fileData: unknown[];
  maxRows: number;
  onWizardCompleted: (selectedColumns: {[key: string]: number}) => void;
}

const ImportColumnSelectionWizard: FunctionComponent<IProps> = ({columns, fileData, maxRows, onWizardCompleted}) => {
  const [selectedColumns, setSelectedColumns] = useState<{[key: string]: number}>({});
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);
  const [currentStepColumn, setCurrentStepColumn] = useState<EntityColumn>(columns[0]);

  useUpdateEffect(() => {
    if (currentStepIndex < columns.length) {
      setCurrentStepColumn(columns[currentStepIndex]);
    } else {
      onWizardCompleted(selectedColumns);
    }
  }, [currentStepIndex]);

  const onColumnSelected = (columnIndex: number): void => {
    setSelectedColumns((selectedColumns) => {
      return _.merge({}, selectedColumns, {
        [currentStepColumn.name]: columnIndex,
      });
    });
    nextStep();
  };

  const onColumnBack = (): void => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(currentStepIndex - 1);
    }
  };

  const onColumnSkipped = (): void => {
    nextStep();
  };

  const nextStep = (): void => {
    setCurrentStepIndex((currentStepIndex) => currentStepIndex + 1);
  };

  return (
    <ImportColumnSelection
      column={currentStepColumn}
      fileData={fileData}
      maxRows={maxRows}
      allowSkip={!currentStepColumn.required}
      allowBack={currentStepIndex > 0}
      onColumnSelected={onColumnSelected}
      onColumnBack={onColumnBack}
      onColumnSkipped={onColumnSkipped}
    />
  );
};
export default ImportColumnSelectionWizard;
