import React, {Ref} from "react";
import {useState, useRef, useContext} from "react";
import {FixedSizeList, FixedSizeListProps} from "react-window";
import {Table, TableBody, useTheme} from "@material-ui/core";
import mergeRefs from "react-merge-refs";

/** Context for cross component communication */
const VirtualTableContext = React.createContext<{
  top: number;
  setTop: (top: number) => void;
  header: React.ReactNode;
  footer: React.ReactNode;
  scrollRef?: Ref<HTMLDivElement>;
}>({
  top: 0,
  setTop: (value: number) => {},
  header: <></>,
  footer: <></>,
  scrollRef: undefined,
});

/** The virtual table. It basically accepts all of the same params as the original FixedSizeList.*/
export default function VirtualTable({
  row,
  header,
  footer,
  scrollRef,
  ...rest
}: {
  row: FixedSizeListProps["children"];
  header?: React.ReactNode;
  footer?: React.ReactNode;
  scrollRef?: Ref<HTMLDivElement>;
} & Omit<FixedSizeListProps, "children" | "innerElementType">) {
  const theme = useTheme();

  const listRef = useRef<FixedSizeList | null>();
  const [top, setTop] = useState<number>(0);

  return (
    <VirtualTableContext.Provider value={{top, setTop, header, footer, scrollRef}}>
      <FixedSizeList
        {...rest}
        innerElementType={Inner}
        outerElementType={Outer}
        onItemsRendered={(props) => {
          const style =
            listRef.current &&
            // @ts-ignore private method access
            listRef.current._getItemStyle(props.overscanStartIndex);
          setTop((style && style.top) || 0);

          // Call the original callback
          rest.onItemsRendered && rest.onItemsRendered(props);
        }}
        ref={(el) => (listRef.current = el)}
        direction={theme.direction}
        style={{overflowY: "scroll"}}
      >
        {row}
      </FixedSizeList>
    </VirtualTableContext.Provider>
  );
}

const Outer = React.forwardRef<HTMLDivElement, React.HTMLProps<HTMLDivElement>>(function Outer(
  {children, ...rest},
  ref
) {
  const {scrollRef} = useContext(VirtualTableContext);
  return (
    <div {...rest} ref={scrollRef ? mergeRefs([scrollRef, ref]) : ref}>
      {children}
    </div>
  );
});

/**
 * The Inner component of the virtual list. This is the "Magic".
 * Capture what would have been the top elements position and apply it to the table.
 * Other than that, render an optional header and footer.
 **/
const Inner = React.forwardRef<HTMLDivElement, React.HTMLProps<HTMLDivElement>>(function Inner(
  {children, ...rest},
  ref
) {
  const {top, header, footer} = useContext(VirtualTableContext);
  return (
    <div {...rest} ref={ref}>
      <Table size="small" sx={{top: top, position: "absolute", width: "100%"}}>
        {header}
        <TableBody>{children}</TableBody>
        {footer}
      </Table>
    </div>
  );
});
