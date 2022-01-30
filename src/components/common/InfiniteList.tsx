import React, {useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState} from "react";
import {useUpdateEffect} from "react-use";
import InfiniteScroll from "react-infinite-scroller";
import PerfectScrollbar from "react-perfect-scrollbar";
import {AbstractJpaRO, FilterField, OrderDTO, useCrudSearch} from "@crud-studio/react-crud-core";
import {Box, CircularProgress, Typography} from "@mui/material";
import {FormattedMessage} from "react-intl";
import _ from "lodash";
import {Entity} from "../../models/entity";

export interface InfiniteListItemProps<EntityRO> {
  item: EntityRO;
}

interface InfiniteListProps<EntityRO> {
  entity: Entity<EntityRO>;
  filterFields?: FilterField[];
  orders?: OrderDTO[];
  ListItem: React.ComponentType<InfiniteListItemProps<EntityRO>>;
  LoadingView?: React.ComponentType;
  EmptyView?: React.ComponentType;
  ErrorView?: React.ComponentType;
  refreshFlag?: number;
  wheelPropagation?: boolean;
  pageSize?: number;
  threshold?: number;
  reversed?: boolean;
}

const InfiniteList = <EntityRO extends AbstractJpaRO>({
  entity,
  filterFields,
  orders,
  ListItem,
  LoadingView,
  EmptyView,
  ErrorView,
  refreshFlag,
  wheelPropagation = false,
  pageSize = 20,
  threshold = 200,
  reversed = false,
}: InfiniteListProps<EntityRO>) => {
  const [allItems, setAllItems] = useState<EntityRO[]>([]);
  const [loadMore, setLoadMore] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(0);

  const {result, hasMore, loading, error, executed, totalItemCount, executeRequest} = useCrudSearch<EntityRO>(
    entity,
    currentPage,
    pageSize,
    filterFields,
    orders || entity.api.defaultOrders,
    {manual: true, count: true, cache: true}
  );

  const scrollRef = useRef<HTMLElement>();
  const oldScrollHeight = useRef<number>(0);

  useUpdateEffect(() => {
    if (loading || !hasMore || !!error) {
      return;
    }
    setCurrentPage((currentCurrentPage) => currentCurrentPage + 1);
  }, [loadMore]);

  useUpdateEffect(() => {
    executeRequest();
  }, [currentPage]);

  useEffect(() => {
    if (result) {
      if (reversed) {
        oldScrollHeight.current = scrollRef.current?.scrollHeight || 0;
        setAllItems((currentAllItems) => [...result.reverse(), ...currentAllItems]);
      } else {
        setAllItems((currentAllItems) => [...currentAllItems, ...result]);
      }
    }
  }, [result]);

  useLayoutEffect(() => {
    if (reversed && scrollRef.current) {
      if (allItems.length <= pageSize) {
        scrollRef.current.scrollTop = 999999;
      } else {
        scrollRef.current.scrollTop =
          scrollRef.current.scrollHeight - oldScrollHeight.current + scrollRef.current.scrollTop;
      }
    }
  }, [allItems]);

  useEffect(() => {
    refreshItems();
  }, [filterFields]);

  const handleLoadMore = useCallback((): void => {
    setLoadMore((currentLoadMore) => currentLoadMore + 1);
  }, [setLoadMore]);

  const refreshItems = useCallback((): void => {
    setAllItems([]);

    if (currentPage === 1) {
      executeRequest();
    } else {
      setCurrentPage(1);
    }
  }, [setAllItems, currentPage, setCurrentPage, executeRequest]);

  useUpdateEffect(() => {
    refreshItems();
  }, [refreshFlag]);

  // Use hasMore instead of totalItemCount when fixed and set "count" on request to false
  const scrollHasMore = useMemo<boolean>(
    () => !_.isEmpty(allItems) && allItems.length < totalItemCount && !loading && !error,
    [totalItemCount, loading, allItems, error]
  );

  const isEmpty = useMemo<boolean>(
    () => !loading && !error && executed && totalItemCount === 0,
    [loading, error, executed, totalItemCount]
  );

  const isError = useMemo<boolean>(() => !loading && !!error, [loading, error]);

  return (
    <PerfectScrollbar
      options={{suppressScrollX: true, wheelPropagation: wheelPropagation}}
      containerRef={(container) => (scrollRef.current = container)}
    >
      <InfiniteScroll
        pageStart={0}
        loadMore={handleLoadMore}
        hasMore={scrollHasMore}
        useWindow={false}
        threshold={threshold}
        getScrollParent={() => scrollRef?.current || null}
        isReverse={reversed}
        initialLoad={false}
      >
        {allItems.map((item) => {
          return <ListItem item={item} key={item.id} />;
        })}
      </InfiniteScroll>

      {loading &&
        (LoadingView ? (
          <LoadingView />
        ) : (
          <Box sx={{textAlign: "center"}}>
            <CircularProgress sx={{my: 3}} />
          </Box>
        ))}

      {isEmpty &&
        (EmptyView ? (
          <EmptyView />
        ) : (
          <Typography
            variant="body2"
            component="div"
            sx={{
              textAlign: "center",
              color: "text.disabled",
              my: 2,
            }}
          >
            <FormattedMessage id="pages.no-results-found" />
          </Typography>
        ))}

      {isError &&
        (ErrorView ? (
          <ErrorView />
        ) : (
          <Typography
            variant="body2"
            component="div"
            sx={{
              textAlign: "center",
              color: "text.disabled",
              my: 2,
            }}
          >
            <FormattedMessage id="pages.error-retrieving-data" />
          </Typography>
        ))}
    </PerfectScrollbar>
  );
};

export default InfiniteList;
