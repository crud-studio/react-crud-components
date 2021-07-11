import React, {useContext, useMemo, useState} from "react";
import {FormProvider, useForm} from "react-hook-form";
import {FormattedMessage} from "react-intl";
import _ from "lodash";
import {PartialDeep} from "type-fest";
import {BaseJpaRO} from "@crud-studio/react-crud-core";
import {Card, CardContent} from "@material-ui/core";
import {Entity, EntityColumn} from "../../../../models/entity";
import CardTitle from "../../../../components/common/CardTitle";
import StatusButton from "../../../../components/buttons/StatusButton";
import EntityUtils from "../../../helpers/EntityUtils";
import useHasEntityActionType from "../../../hooks/useHasEntityActionType";
import EntityFieldComponent from "../../../inputs/field/EntityFieldComponent";
import {EntityContext} from "../../../managers/EntityManager";
import {GrantContext} from "../../../../managers/grants/GrantsManager";

interface IProps<EntityRO extends BaseJpaRO> {
  entity: Entity<EntityRO>;
  item: EntityRO;
  loading: boolean;
  updateItem: (itemData: PartialDeep<EntityRO>, debounced: boolean) => void;
}

const EntityDetailsForm = <EntityRO extends BaseJpaRO>({entity, item, loading, updateItem}: IProps<EntityRO>) => {
  const {getColumnGrant} = useContext(EntityContext);
  const {hasGrant} = useContext(GrantContext);

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
    <Card sx={{mt: 3}}>
      <CardContent>
        <CardTitle>
          <FormattedMessage id="pages.details" />
        </CardTitle>

        <FormProvider {...methods}>
          <form onSubmit={onSubmit}>
            {entityColumns.map((column) => (
              <EntityFieldComponent
                entityField={column}
                defaultValue={EntityUtils.getItemFieldDefaultValue(column, item)}
                disabled={!hasEntityActionUpdate || !column.updatable}
                onValueChanged={(value) => {
                  onValueChanged(value, column.name);
                }}
                sx={{mb: 2}}
                key={column.name}
              />
            ))}

            {hasEntityActionUpdate && (
              <div>
                <StatusButton color="primary" type="submit" loading={loading}>
                  {item.id > 0 ? <FormattedMessage id="pages.update" /> : <FormattedMessage id="pages.create" />}
                </StatusButton>
              </div>
            )}
          </form>
        </FormProvider>
      </CardContent>
    </Card>
  );
};
export default EntityDetailsForm;
