import React, {FunctionComponent, PropsWithChildren, useEffect, useState} from "react";
import _ from "lodash";
import {URL_PARAM_TAB} from "../../constants/urlKeys";
import {useUrlState} from "@crud-studio/react-crud-core";
import {Badge, Box, Tab, Tabs} from "@material-ui/core";
import {FormattedMessage} from "react-intl";
import {TabInfo} from "../../models/internal";
import {DIGITS_REGEX} from "../../constants/regex";

interface IProps extends PropsWithChildren<any> {
  tabs: TabInfo[];
  tabsCount?: {[index: string]: number};
  saveActiveTab?: boolean;
}

const TabPanel: FunctionComponent<IProps> = ({tabs, tabsCount, saveActiveTab = true, children}: IProps) => {
  const [activeTab, setActiveTab] = useUrlState<number>(
    URL_PARAM_TAB,
    0,
    (state) => state > 0 && saveActiveTab,
    (state) => (DIGITS_REGEX.test(state) ? parseInt(state) : null)
  );
  const [loadedTabs, setLoadedTabs] = useState<number[]>([]);

  useEffect(() => {
    if (!loadedTabs.includes(activeTab)) {
      setLoadedTabs((loadedTabs) => [...loadedTabs, activeTab]);
    }
  }, [activeTab]);

  const toggleTab = (event: React.SyntheticEvent, tab: number): void => {
    if (activeTab !== tab) {
      setActiveTab(tab);
    }
  };

  return (
    <Box sx={{width: "100%"}}>
      <Box sx={{borderBottom: 1, borderColor: "divider"}}>
        <Tabs value={activeTab} onChange={toggleTab}>
          {tabs.map((tab) => {
            const hasTabCount = tabsCount && _.has(tabsCount, tab.id);
            const tabCount = tabsCount && tabsCount[tab.id];
            return (
              <Tab
                label={
                  <Badge badgeContent={tabCount} color="secondary" invisible={!hasTabCount}>
                    <FormattedMessage id={tab.labelKey} />
                  </Badge>
                }
                key={tab.id}
              />
            );
          })}
        </Tabs>
      </Box>

      {children
        ?.filter((child: any) => child)
        .map((child: any, index: number) => {
          const tab: TabInfo = _.get(tabs, index);
          const tabLoaded: boolean = !tab || !tab.lazy || activeTab === index || loadedTabs.includes(index);
          return (
            <Box sx={{display: activeTab === index ? "block" : "none"}} key={index}>
              {tabLoaded && child}
            </Box>
          );
        })}
    </Box>
  );
};
export default TabPanel;