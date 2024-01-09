import styles from "./Sidebar.module.scss";
import classNames from "classnames/bind";
import ButtonMenu from "./ButtonMenu";
import { NavLink, useNavigate } from "react-router-dom";
import { Class } from "../../Icons/Class.js";
import { Teacher } from "../../Icons/Teacher.js";
import { Subject } from "../../Icons/Subject.js";
import { TimeTable } from "../../Icons/TimeTable.js";
const cx = classNames.bind(styles);

function Sidebar() {
  return (
    <div className={cx("wrapperparent")}>
      <div className={cx("sidebar")}>
        <div className={cx("title")}>
          <h1>Quản lí </h1>
          <h1>Thời khóa biểu</h1>
        </div>
        <div>
          <NavLink
            to="/teacher"
            className={(nav) => {
              cx({ active: nav.isActive });
            }}
          >
            <ButtonMenu iconLeft={<Teacher />} title="Giáo viên"></ButtonMenu>
          </NavLink>

          <NavLink
            to="/class"
            className={(nav) => {
              cx({ active: nav.isActive });
            }}
          >
            <ButtonMenu iconLeft={<Class />} title="Lớp học"></ButtonMenu>
          </NavLink>

          <NavLink
            to="/subject"
            className={(nav) => {
              cx({ active: nav.isActive });
            }}
          >
            <ButtonMenu title="Môn học" iconLeft={<Subject />}></ButtonMenu>
          </NavLink>

          <NavLink
            to="/timetable"
            className={(nav) => {
              cx({ active: nav.isActive });
            }}
          >
            <ButtonMenu title="TKB" iconLeft={<TimeTable />}></ButtonMenu>
          </NavLink>
        </div>
      </div>
    </div>
  );
}

export default Sidebar;
