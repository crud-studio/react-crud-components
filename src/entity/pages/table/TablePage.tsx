import React, {useCallback, useMemo, useRef, useState} from "react";
import _ from "lodash";
import {useUpdateEffect} from "react-use";
import {URL_PARAM_PAGE} from "../../../constants/urlKeys";
import TablePageHeading from "./TablePageHeading";
import LoadingTableView from "./components/LoadingTableView";
import EmptyTableView from "./components/EmptyTableView";
import TableRowView from "./components/TableRowView";
import FilterManager from "../../managers/FilterManager";
import OrderByManager from "../../managers/OrderByManager";
import TableHeaderRowView from "./components/TableHeaderRowView";
import {
  AbstractJpaRO,
  FilterField,
  LocalStorageWrapper,
  OrderDTO,
  useCrudSearch,
  useUrlState,
} from "@crud-studio/react-crud-core";
import {Box, Card, Menu, Table, TableBody, TableContainer} from "@material-ui/core";
import {PopoverPosition} from "@material-ui/core/Popover/Popover";
import {Entity, EntityColumn} from "../../../models/entity";
import {DIGITS_REGEX} from "../../../constants/regex";
import MenuActionItems from "../../../components/menus/MenuActionItems";
import {MenuAction} from "../../../models/internal";
import {PARAM_PAGE_SIZE} from "../../../constants/localStorageKeys";
import ErrorTableView from "./components/ErrorTableView";
import VirtualTable from "../../../components/layouts/VirtualTable";
import {ListChildComponentProps} from "react-window";
import AutoSizer from "react-virtualized-auto-sizer";
import {useScrollSync} from "../../../hooks/useScrollSync";
import TableAccessibilityHeaderRowView from "./components/TableAccessibilityHeaderRowView";

interface IProps<EntityRO extends AbstractJpaRO> {
  entity: Entity<EntityRO>;
  filterFields: FilterField[];
  hiddenColumns: string[];
  rowHeight: number;
  refreshItems: number;
  compact: boolean;
  buttons: MenuAction[];
  buttonsHandler: (buttonId: string) => void;
  actions: MenuAction[];
  actionsHandler: (selectedItems: EntityRO[], actionId: string) => void;
  onClickItem?: (item: EntityRO) => void;
}

const TablePage = <EntityRO extends AbstractJpaRO>({
  entity,
  filterFields,
  hiddenColumns,
  rowHeight,
  refreshItems,
  compact,
  buttons,
  buttonsHandler,
  actions,
  actionsHandler,
  onClickItem,
}: IProps<EntityRO>) => {
  const [columns] = useState<EntityColumn[]>(entity.columns.filter((column) => !hiddenColumns.includes(column.name)));

  const [pageSize, setPageSize] = useState<number>(LocalStorageWrapper.get(PARAM_PAGE_SIZE) || 10);
  const [currentPage, setCurrentPage] = useUrlState<number>(
    URL_PARAM_PAGE,
    1,
    (state) => state > 1,
    (state) => (DIGITS_REGEX.test(state) ? parseInt(state) : null)
  );

  const [orders, setOrders] = useState<OrderDTO[]>(entity.api.defaultOrders);

  const onContextOrdersUpdated = useCallback(
    (contextOrders: OrderDTO[]): void => {
      if (contextOrders?.length) {
        setOrders(contextOrders);
      } else {
        setOrders(entity.api.defaultOrders);
      }
    },
    [setOrders, entity]
  );

  const [aggregatedFilterFields, setAggregatedFilterFields] = useState<FilterField[] | undefined>(undefined);

  const onContextFilterFieldsUpdated = useCallback(
    (contextFilterFields: FilterField[]): void => {
      setAggregatedFilterFields([...filterFields, ...contextFilterFields]);
      setCurrentPage(1);
    },
    [setAggregatedFilterFields]
  );

  const {
    result: items,
    totalItemCount,
    totalPageCount,
    loading,
    error,
    executed,
    executeRequest,
  } = useCrudSearch<EntityRO>(entity, currentPage, pageSize, aggregatedFilterFields, orders, {
    manual: !aggregatedFilterFields,
    count: true,
  });

  useUpdateEffect(() => {
    if (refreshItems) {
      executeRequest();
    }
  }, [refreshItems]);

  const [selectedItemIds, setSelectedItemIds] = useState<number[]>([]);

  useUpdateEffect(() => {
    setSelectedItemIds([]);
  }, [items]);

  const changePageSize = (size: number): void => {
    setPageSize(size);
    setCurrentPage(1);

    LocalStorageWrapper.set(PARAM_PAGE_SIZE, size);
  };

  const onChangePage = (page: number): void => {
    setCurrentPage(page);
  };

  const onCheckItem = useCallback(
    (event, item: EntityRO): void => {
      if (event.target.tagName === "A" || (event.target.parentElement && event.target.parentElement.tagName === "A")) {
        return;
      }

      const id = item.id;

      if (!event.shiftKey) {
        setSelectedItemIds((selectedItemIds) => {
          if (selectedItemIds.includes(id)) {
            return selectedItemIds.filter((x) => x !== id);
          } else {
            return [...selectedItemIds, id];
          }
        });
      } else {
        setSelectedItemIds((selectedItemIds) => {
          if (items && selectedItemIds.length) {
            let start = _.findIndex(items, ["id", id]);
            let end = _.findIndex(items, ["id", selectedItemIds[selectedItemIds.length - 1]]);
            let slicedItems = items.slice(Math.min(start, end), Math.max(start, end) + 1);
            let allSelectedItemIds = [...selectedItemIds, ...slicedItems.map((x) => x.id)];
            return _.uniq(allSelectedItemIds);
          } else {
            return [id];
          }
        });
      }
    },
    [items]
  );

  const onClickItemInternal = (event: React.MouseEvent<HTMLElement>, item: EntityRO): void => {
    if (onClickItem) {
      onClickItem(item);
    }
  };

  const [contextMenuPosition, setContextMenuPosition] = useState<PopoverPosition | undefined>(undefined);

  const onContextMenuItem = (event: React.MouseEvent<HTMLElement>, item: EntityRO): void => {
    event.preventDefault();
    setContextMenuPosition({left: event.clientX, top: event.clientY});

    if (!selectedItemIds.includes(item.id)) {
      setSelectedItemIds([item.id]);
    }
  };

  const onContextMenuActionClick = (actionId: string): void => {
    onContextMenuClose();
    performAction(actionId);
  };

  const onContextMenuClose = (): void => {
    setContextMenuPosition(undefined);
  };

  const handleChangeSelectAll = (isToggle: boolean): void => {
    if (items) {
      if (selectedItemIds.length >= items.length) {
        if (isToggle) {
          setSelectedItemIds([]);
        }
      } else {
        setSelectedItemIds(items.map((x: EntityRO) => x.id));
      }
    }
  };

  const onDropdownMenuClick = (actionId: string): void => {
    performAction(actionId);
  };

  const performAction = (actionId: string): void => {
    if (!items) {
      return;
    }

    const selectedItems = items.filter((item) => selectedItemIds.includes(item.id));
    actionsHandler(selectedItems, actionId);
  };

  const tableHeaderRef = useRef<any>();
  const tableBodyRef = useRef<any>();

  useScrollSync([tableHeaderRef, tableBodyRef], {
    horizontal: true,
    vertical: false,
    proportional: false,
    throttleWaitTime: 25,
  });

  const startIndex = useMemo<number>(
    () => Math.min((currentPage - 1) * pageSize + 1, totalItemCount),
    [currentPage, pageSize, totalItemCount]
  );
  const endIndex = useMemo<number>(
    () => Math.min(currentPage * pageSize, totalItemCount),
    [currentPage, pageSize, totalItemCount]
  );
  const itemCount = useMemo<number>(() => items?.length || 0, [items]);

  return (
    <FilterManager entity={entity} onContextFilterFieldsUpdated={onContextFilterFieldsUpdated}>
      <OrderByManager entity={entity} onContextOrdersUpdated={onContextOrdersUpdated}>
        <Box sx={{height: "100%", display: "flex", flexDirection: "column"}}>
          <TablePageHeading
            compact={compact}
            heading={entity.client.titleKey}
            currentPage={currentPage}
            totalPageCount={totalPageCount}
            onChangePage={onChangePage}
            onChangePageSize={changePageSize}
            selectedPageSize={pageSize}
            totalItemCount={totalItemCount}
            startIndex={startIndex}
            endIndex={endIndex}
            buttons={buttons}
            buttonsHandler={buttonsHandler}
            dropdownActions={actions}
            dropdownActionsHandler={onDropdownMenuClick}
          />

          <Card sx={{position: "relative", display: "flex", flexDirection: "column", flexGrow: 1}}>
            <TableContainer sx={{overflowY: "scroll", overflowX: "hidden"}} ref={tableHeaderRef}>
              <Table size="small">
                <TableHeaderRowView
                  columns={columns}
                  itemsLength={items?.length || 0}
                  selectedItemsLength={selectedItemIds?.length || 0}
                  handleChangeSelectAll={handleChangeSelectAll}
                />

                <TableBody>
                  {loading && <LoadingTableView />}
                  {!loading && !error && executed && totalItemCount === 0 && <EmptyTableView />}
                  {!loading && !!error && <ErrorTableView />}
                </TableBody>
              </Table>
            </TableContainer>

            <TableContainer sx={{flexGrow: 1, minHeight: 100}}>
              <AutoSizer disableWidth={true}>
                {({height}) => (
                  <VirtualTable
                    height={height}
                    width="100%"
                    itemData={{
                      items: items,
                      columns: columns,
                      selectedItemIds: selectedItemIds,
                      onClickItem: onClickItemInternal,
                      onCheckItem: onCheckItem,
                      onContextMenuItem: onContextMenuItem,
                    }}
                    itemCount={itemCount}
                    itemSize={rowHeight}
                    itemKey={(index, data) => data.items[index].id}
                    row={Row}
                    header={<TableAccessibilityHeaderRowView columns={columns} itemCount={itemCount} />}
                    scrollRef={tableBodyRef}
                  />
                )}
              </AutoSizer>
            </TableContainer>
          </Card>

          <Menu
            transformOrigin={{
              vertical: "top",
              horizontal: "left",
            }}
            anchorReference="anchorPosition"
            anchorPosition={contextMenuPosition}
            open={!!contextMenuPosition}
            onContextMenu={(e) => {
              e.preventDefault();
              onContextMenuClose();
            }}
            onClose={onContextMenuClose}
          >
            <MenuActionItems actions={actions} onActionClick={onContextMenuActionClick} />
          </Menu>
        </Box>
      </OrderByManager>
    </FilterManager>
  );
};

function Row({index, data}: ListChildComponentProps) {
  const item = data.items[index];
  return (
    <TableRowView
      columns={data.columns}
      item={item}
      index={index}
      isSelect={data.selectedItemIds.includes(item.id)}
      onClickItem={data.onClickItem}
      onCheckItem={data.onCheckItem}
      onContextMenuItem={data.onContextMenuItem}
    />
  );
}

export default TablePage;
