import React, { useState } from "react";
import styles from "./ButtonMenu.module.scss";
import classNames from "classnames/bind";
import { Button } from "@mui/material";
const cx = classNames.bind(styles);
const ButtonMenu = ({ iconLeft, title }) => {
  return (
    <div className={cx("menu")}>
      <Button
        className={cx("button")}
        style={{
          fontSize: "25px",
          color: "#707070",
          justifyContent: "space-between",
          paddingRight: "10px",
        }}
      >
        <span className={cx("left-title")}>
          <span
            className={cx("btn-left")}
            style={{ marginRight: title === "Môn học" ? "22px" : "30px" }}
          >
            {iconLeft}
          </span>
          {title}
        </span>
      </Button>
    </div>
  );
};

export default ButtonMenu;
