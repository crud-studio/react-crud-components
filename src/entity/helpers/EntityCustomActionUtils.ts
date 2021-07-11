import {
  EntityComponentActionConfig,
  EntityComponentActionConfigMany,
  EntityGenericActionConfig,
  EntityGenericActionConfigMany,
} from "../../models/entity";

const EntityCustomActionUtils = {
  isEntityGenericActionConfig: function (
    actionConfig: EntityGenericActionConfig<any> | EntityComponentActionConfig<any>
  ): actionConfig is EntityGenericActionConfig<any> {
    return "api" in actionConfig;
  },

  isEntityComponentActionConfig: function (
    actionConfig: EntityGenericActionConfig<any> | EntityComponentActionConfig<any>
  ): actionConfig is EntityComponentActionConfig<any> {
    return "component" in actionConfig;
  },

  isEntityGenericActionConfigMany: function (
    actionConfig: EntityGenericActionConfigMany<any> | EntityComponentActionConfigMany<any>
  ): actionConfig is EntityGenericActionConfigMany<any> {
    return "api" in actionConfig;
  },

  isEntityComponentActionConfigMany: function (
    actionConfig: EntityGenericActionConfigMany<any> | EntityComponentActionConfigMany<any>
  ): actionConfig is EntityComponentActionConfigMany<any> {
    return "component" in actionConfig;
  },
};
export default EntityCustomActionUtils;
