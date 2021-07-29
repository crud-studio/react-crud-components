import {
  EntityComponentActionConfig,
  EntityComponentActionConfigMany,
  EntityComponentSummaryConfig,
  EntityGenericActionConfig,
  EntityGenericActionConfigMany,
  EntityGenericSummaryConfig,
} from "../../models/entity";

const EntityClientUtils = {
  isEntityGenericSummaryConfig: function (
    summaryConfig: EntityGenericSummaryConfig<any> | EntityComponentSummaryConfig<any>
  ): summaryConfig is EntityGenericSummaryConfig<any> {
    return "columns" in summaryConfig;
  },

  isEntityComponentSummaryConfig: function (
    summaryConfig: EntityGenericSummaryConfig<any> | EntityComponentSummaryConfig<any>
  ): summaryConfig is EntityComponentSummaryConfig<any> {
    return "component" in summaryConfig;
  },

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
export default EntityClientUtils;
