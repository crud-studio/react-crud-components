import React, {useMemo, useState} from "react";
import {FormProvider, useForm} from "react-hook-form";
import {FormattedMessage} from "react-intl";
import _ from "lodash";
import {PartialDeep} from "type-fest";
import {BaseJpaRO} from "@crud-studio/react-crud-core";
import {Card, CardContent, Stack} from "@material-ui/core";
import {Entity, EntityColumn} from "../../../../models/entity";
import EntityUtils from "../../../helpers/EntityUtils";
import useHasEntityActionType from "../../../hooks/useHasEntityActionType";
import EntityFieldComponent from "../../../inputs/field/EntityFieldComponent";
import {LoadingButton} from "@material-ui/lab";
import useGrants from "../../../../managers/grants/hooks/useGrants";
import useEntity from "../../../hooks/useEntity";

interface IProps<EntityRO extends BaseJpaRO> {
  entity: Entity<EntityRO>;
  item: EntityRO;
  loading: boolean;
  updateItem: (itemData: PartialDeep<EntityRO>, debounced: boolean) => void;
}

const EntityDetailsForm = <EntityRO extends BaseJpaRO>({entity, item, loading, updateItem}: IProps<EntityRO>) => {
  const {getColumnGrant} = useEntity();
  const {hasGrant} = useGrants();

  const methods = useForm();

  const [itemData, setItemData] = useState<PartialDeep<EntityRO>>({} as PartialDeep<EntityRO>);
  const hasEntityActionUpdate = useHasEntityActionType(entity, "UPDATE");

  const entityColumns = useMemo<EntityColumn[]>(
    () => entity.columns.filter((column) => (item.id > 0 || column.updatable) && hasGrant(getColumnGrant(column))),
    [entity, item.id]
  );

  const onValueChanged = (value: any, columnName: string): void => {
    setItemData((itemData) => {
      return _.set(
        {
          ...itemData,
        },
        columnName,
        value
      );
    });
  };

  const onSubmit = methods.handleSubmit((data): void => {
    updateItem(
      {
        ...itemData,
        id: item.id,
      },
      false
    );
  });

  return (
    <Card>
      {/*<CardHeader title={<FormattedMessage id="pages.details" />} />*/}
      <CardContent>
        <FormProvider {...methods}>
          <form onSubmit={onSubmit}>
            <Stack spacing={{xs: 2, md: 3}}>
              {entityColumns.map((column) => (
                <EntityFieldComponent
                  entityField={column}
                  defaultValue={EntityUtils.getItemFieldDefaultValue(column, item)}
                  disabled={!hasEntityActionUpdate || !column.updatable}
                  onValueChanged={(value) => {
                    onValueChanged(value, column.name);
                  }}
                  key={column.name}
                />
              ))}

              {hasEntityActionUpdate && (
                <Stack direction="row-reverse" spacing={1}>
                  <LoadingButton variant="contained" color="primary" type="submit" loading={loading}>
                    {item.id > 0 ? <FormattedMessage id="pages.update" /> : <FormattedMessage id="pages.create" />}
                  </LoadingButton>
                </Stack>
              )}
            </Stack>
          </form>
        </FormProvider>
      </CardContent>
    </Card>
  );
};
export default EntityDetailsForm;
