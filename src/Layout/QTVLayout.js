
import styles from "./DefaulLayout.module.scss";
import classNames from "classnames/bind";
import { Typography } from "@mui/material";
import SidebarQTV from "./SidebarQTV/SideBarQTV";
const cx = classNames.bind(styles);
function QTVLayout({ children }) {
    const user = localStorage.getItem("user")
    return (
        <div className={cx("wrapper")}>
            <SidebarQTV className={cx("sidebar")} />
            <div className={cx("children")}>{user == "null" ? <Typography variant="h3">Hãy đăng nhập để thao tác
            </Typography> : children}</div>
        </div>
    );
}
export default QTVLayout;
