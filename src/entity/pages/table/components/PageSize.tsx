import React, {FunctionComponent, useState} from "react";
import {FormattedMessage} from "react-intl";
import {Box, Button, Menu, MenuItem, Typography} from "@material-ui/core";
import {KeyboardArrowDown} from "@material-ui/icons";
import {pageSizes} from "../../../../constants/defaultValues";

interface IProps {
  startIndex: number;
  endIndex: number;
  totalItemCount: number;
  selectedPageSize: number;
  onChangePageSize: (pageSize: number) => void;
}

const PageSize: FunctionComponent<IProps> = ({
  startIndex,
  endIndex,
  totalItemCount,
  selectedPageSize,
  onChangePageSize,
}) => {
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

  const handleMenu = (event: React.MouseEvent<HTMLButtonElement>): void => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = (): void => {
    setAnchorEl(null);
  };

  const onChangePageSizeInternal = (pageSize: number): void => {
    handleClose();
    onChangePageSize(pageSize);
  };

  return (
    <Box sx={{display: "flex", flexDirection: "row", alignItems: "center"}}>
      <Typography variant="body2" sx={{mr: 1}}>
        {`${startIndex}-${endIndex} `}
        <FormattedMessage id="pages.of" />
        {` ${totalItemCount} `}
      </Typography>

      <Button
        variant="outlined"
        size="small"
        color="primary"
        disableElevation
        onClick={handleMenu}
        endIcon={<KeyboardArrowDown />}
      >
        {selectedPageSize}
      </Button>
      <Menu
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        {pageSizes.map((size) => {
          return (
            <MenuItem onClick={() => onChangePageSizeInternal(size)} key={size}>
              {size}
            </MenuItem>
          );
        })}
      </Menu>
    </Box>
  );
};
export default PageSize;
