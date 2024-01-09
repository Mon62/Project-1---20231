import { Button } from "@mui/material";
import styles from "./Sidebar.module.scss";
import classNames from "classnames/bind";
const cx = classNames.bind(styles);
function Item({ title, startIcon }) {
  return (
    <Button
      className={cx("btn")}
      style={{
        fontSize: "24px",
        color: "black",
        fontWeight: "400",
        textTransform: "none",
        justifyContent: "flex-start",
        paddingLeft: "50px",
        borderRadius: "10px",
        paddingTop: "4px",
        paddingBottom: "4px",
      }}
      startIcon={startIcon}
    >
      {title}
    </Button>
  );
}

export default Item;
