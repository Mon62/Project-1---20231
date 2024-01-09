import Home from "../Pages/Home";
import TeacherList from "../Pages/Teacher/TeacherList.js";
import ClassList from "../Pages/Class/ClassList.js";
import SubjectList from "../Pages/Subject/SubjectList.js";
import AddTeacher from "../Pages/Teacher/AddTeacher.js";
import TeacherInformation from "../Pages/Teacher/TeacherInformation.js";
import AddClass from "../Pages/Class/AddClass.js";
import ClassInformation from "../Pages/Class/ClassInformation.js";
import AddSubject from "../Pages/Subject/AddSubject.js";
import SubjectInformation from "../Pages/Subject/SubjectInformation.js";
import TimeTable from "../Pages/TimeTable/TimeTable.js";

const publicRoutes = [
  { path: "/teacher", component: TeacherList },
  { path: "/class", component: ClassList },
  { path: "/home", component: Home },
  { path: "/", component: Home },
  { path: "/subject", component: SubjectList },
  { path: "/teacherinformation", component: TeacherInformation },
  { path: "/addclass", component: AddClass },
  { path: "/classinformation", component: ClassInformation },
  { path: "/addsubject", component: AddSubject },
  { path: "/subjectinformation", component: SubjectInformation },
  { path: "/timetable", component: TimeTable },
  { path: "/addteacher", component: AddTeacher },
];

export { publicRoutes };
