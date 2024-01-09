import Sidebar from "./Sidebar";
import styles from "./DefaulLayout.module.scss";
import classNames from "classnames/bind";
import { useState } from "react";
import { Typography } from "@mui/material";
const cx = classNames.bind(styles);
function DefaultLayout({ children }) {
  const user = sessionStorage.getItem("user")

  return (

    <div className={cx("wrapper")}>
      <Sidebar className={cx("sidebar")} />
      <div className={cx("children")}>{children}</div>
    </div>
  );
}

export default DefaultLayout;
