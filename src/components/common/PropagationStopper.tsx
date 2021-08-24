import React, {FunctionComponent, MouseEventHandler, PropsWithChildren, SyntheticEvent, useCallback} from "react";
import {NavLink} from "react-router-dom";
import {Box} from "@material-ui/core";
import {SxProps} from "@material-ui/system";
import {Theme} from "@material-ui/core/styles";

interface IProps extends PropsWithChildren<any> {
  className?: string;
  sx?: SxProps<Theme>;
}

const PropagationStopper: FunctionComponent<IProps> = ({className, sx, children}) => {
  const stop = useCallback((e: SyntheticEvent): void => {
    e.stopPropagation();
    e.preventDefault();
  }, []);

  return (
    <Box
      className={className}
      sx={sx}
      onClick={stop}
      onContextMenu={stop}
      onDoubleClick={stop}
      onDrag={stop}
      onDragEnd={stop}
      onDragEnter={stop}
      onDragExit={stop}
      onDragLeave={stop}
      onDragOver={stop}
      onDragStart={stop}
      onDrop={stop}
      onMouseDown={stop}
      onMouseEnter={stop}
      onMouseLeave={stop}
      onMouseMove={stop}
      onMouseOver={stop}
      onMouseOut={stop}
      onMouseUp={stop}
      onKeyDown={stop}
      onKeyPress={stop}
      onKeyUp={stop}
      onFocus={stop}
      onBlur={stop}
      onChange={stop}
      onInput={stop}
      onInvalid={stop}
      onSubmit={stop}
    >
      {children}
    </Box>
  );
};
export default PropagationStopper;
