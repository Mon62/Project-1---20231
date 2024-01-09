import React, { useEffect, useState } from "react";
import { Grid, Button, Typography } from "@mui/material";
import { Table, TableBody, TableCell, Paper } from "@mui/material";
import {
  TableRow,
  TableHead,
  TableContainer,
  TableFooter,
  TablePagination,
} from "@mui/material";
import Checkbox from "@mui/material/Checkbox";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import CheckBoxOutlineBlankIcon from "@mui/icons-material/CheckBoxOutlineBlank";
import CheckBoxIcon from "@mui/icons-material/CheckBox";
import { get, ref, set, update } from "firebase/database";
import { db } from "../../Config/firebase.js";
import Notiflix from "notiflix";

export default function TimeTable() {
  const columnNames = [
    "Tiết",
    "Thứ 2",
    "Thứ 3",
    "Thứ 4",
    "Thứ 5",
    "Thứ 6",
    "Thứ 7",
  ];
  const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
  const checkedIcon = <CheckBoxIcon fontSize="small" />;
  const [fullClassList, setFullClassList] = useState([]);
  const [classList, setClassList] = useState([]);
  const [teacherList, setTeacherList] = useState([]);
  const [classTimeTableId, setClassTimeTableId] = useState("");
  const [teacherTimeTableId, setTeacherTimeTableId] = useState("");
  const [teacherTimeTableName, setTeacherTimeTableName] = useState("");
  const [isCreatedTimeTable, setIsCreatedTimeTable] = useState(false);
  const [isTeacher, setIsTeacher] = useState(false);
  const [timeTable, setTimeTable] = useState([]);
  const g = [];
  const vis = [];
  const mark = [];
  const lessonOrder = [1, 2, 3, 4, 5, 6, 7, 8, 9];
  const dayOrder = [2, 3, 4, 5, 6, 7];
  let lessonCount = 0,
    totalLesson = 0;

  useEffect(() => {
    const classRef = ref(db, "class");
    get(classRef)
      .then((snapshot) => {
        if (snapshot.exists()) {
          const classArray = Object.entries(snapshot.val()).map(
            ([id, data]) => ({
              id,
              ...data,
            })
          );
          setFullClassList(classArray);
        } else {
          console.log("No data available!");
        }
      })
      .catch((error) => {
        Notiflix.Notify.failure(error.message);
        console.error(error);
      });

    const teacherRef = ref(db, "teacher");
    get(teacherRef)
      .then((snapshot) => {
        if (snapshot.exists()) {
          const teacherArray = Object.entries(snapshot.val()).map(
            ([id, data]) => ({
              id,
              ...data,
            })
          );
          setTeacherList(teacherArray);
          // console.log(teacherArray);
        } else {
          console.log("No data available!");
        }
      })
      .catch((error) => {
        Notiflix.Notify.failure(error.message);
        console.error(error);
      });
  }, []);

  const handleChangeClassList = (value) => {
    if (value !== null) setClassList(value);
    else setClassList([]);
  };

  const DFS = (u) => {
    if (vis[u]) return false;
    vis[u] = true;
    // console.log(g[u], u);
    if (g[u] === null) return false;
    // console.log(g[u]);
    for (let i = 0; i < g[u].length; ++i) {
      if (g[u][i] === null || g[u][i].teacherIndex === null) continue;
      let v = g[u][i].teacherIndex;
      if (mark[v] === undefined || DFS(mark[v].classIndex)) {
        mark[v] = {
          classId: classList[u].classId,
          subjectName: g[u][i].subjectName,
          teacherId: g[u][i].teacherId,
          classIndex: u,
          position: g[u][i].position,
          teacherName: g[u][i].teacherName,
          className: g[u][i].className,
        };
        return true;
      }
    }

    return false;
  };

  const handleCreateTimeTable = () => {
    set(ref(db, "classTimeTable"), null).catch((err) => {
      Notiflix.Notify.failure(err.message);
      console.error(err);
    });
    set(ref(db, "teacherTimeTable"), null).catch((err) => {
      Notiflix.Notify.failure(err.message);
      console.error(err);
    });
    //console.log(classList);
    setIsCreatedTimeTable(true);
    lessonCount = 0;
    totalLesson = 0;
    classList.map((classInfor, indexClass) => {
      let subjectList = Object.values(classInfor.subjectList);
      g[indexClass] = [];
      let cnt = 0;
      subjectList.map((subject, indexSubject) => {
        for (let i = 0; i < subject.lessonNumber; ++i) {
          g[indexClass].push({
            teacherId: subject.teacherId,
            subjectName: subject.subjectName,
            teacherIndex: subject.id,
            position: cnt,
            teacherName: subject.teacherName,
            className: subject.className,
          });
          totalLesson++;
          cnt++;
        }
      });
    });

    // console.log(g);
    while (totalLesson) {
      lessonCount++;
      for (let i = 0; i < g.length; i++) {
        for (let j = 0; j < g.length; j++) vis[j] = false;
        if (DFS(i)) totalLesson--;
      }
      //  console.log(mark);
      /* eslint-disable no-loop-func */
      mark.map((lesson) => {
        g[lesson.classIndex][lesson.position] = null;

        set(ref(db, `classTimeTable/${lesson.classId}/${lessonCount}`), {
          teacherName: lesson.teacherName,
          subjectName: lesson.subjectName,
        }).catch((err) => {
          Notiflix.Notify.failure(err.message);
          console.log(err);
        });
        set(ref(db, `teacherTimeTable/${lesson.teacherId}/${lessonCount}`), {
          className: lesson.className,
          subjectName: lesson.subjectName,
        }).catch((err) => {
          Notiflix.Notify.failure(err.message);
          console.log(err);
        });
      });
      mark.splice(0, mark.length);
      //  console.log(g);
      // console.log(lessonCount, totalLesson);
    }
    if (lessonCount < 64)
      Notiflix.Notify.success("Tạo thời khóa biểu thành công!");
    else Notiflix.Notify.failure("Số tiết học vượt quá thời gian một tuần!");
  };

  const handleShowTimeTableOfClass = () => {
    setIsTeacher(false);

    if (!isCreatedTimeTable) {
      Notiflix.Notify.warning("Vui lòng tạo thời khóa biểu trước");
      return;
    }
    console.log(classTimeTableId);
    const classRef = ref(db, `classTimeTable/${classTimeTableId}`);
    get(classRef)
      .then((snapshot) => {
        if (snapshot.exists()) {
          const lessonArray = Object.entries(snapshot.val()).map(
            ([id, data]) => ({
              id,
              ...data,
            })
          );
          console.log(lessonArray);
          let newLessonArray = [];
          lessonArray.map((lesson) => {
            newLessonArray[lesson.id] = lesson;
          });
          setTimeTable(newLessonArray);
        } else {
          console.log("No data available!");
        }
      })
      .catch((error) => {
        Notiflix.Notify.failure(error.message);
        console.error(error);
      });
  };
  const handleShowTimeTableOfTeacher = () => {
    if (!isCreatedTimeTable) {
      Notiflix.Notify.warning("Vui lòng tạo thời khóa biểu trước");
      return;
    }

    setIsTeacher(true);

    const teacherRef = ref(db, `teacherTimeTable/${teacherTimeTableId}`);
    get(teacherRef)
      .then((snapshot) => {
        if (snapshot.exists()) {
          const lessonArray = Object.entries(snapshot.val()).map(
            ([id, data]) => ({
              id,
              ...data,
            })
          );
          let newLessonArray = [];
          lessonArray.map((lesson) => {
            newLessonArray[lesson.id] = lesson;
          });
          setTimeTable(newLessonArray);
          console.log(newLessonArray);
        } else {
          Notiflix.Notify.warning(
            "Giáo viên " + teacherTimeTableName + " không có thời khóa biểu!"
          );
          console.log("No data available!");
        }
      })
      .catch((error) => {
        Notiflix.Notify.failure(error.message);
        console.error(error);
      });
  };

  return (
    <Grid container spacing={2} style={{ padding: "50px" }}>
      <Grid item xs={12}>
        <div style={{ fontSize: "48px" }}> Thời khóa biểu </div>
      </Grid>
      <Grid item xs={12}>
        <Autocomplete
          multiple
          id="checkboxes-tags-demo"
          options={fullClassList}
          disableCloseOnSelect
          getOptionLabel={(option) => option.className}
          onChange={(event, value) => {
            handleChangeClassList(value);
            setIsCreatedTimeTable(false);
          }}
          sx={{
            "& .MuiAutocomplete-input": {
              fontSize: "20px",
            },
            ".MuiAutocomplete-tag": {
              fontSize: "20px",
            },
          }}
          renderOption={(props, option, { selected }) => (
            <li {...props} sx={{ fontSize: "20px" }}>
              <Checkbox
                icon={icon}
                checkedIcon={checkedIcon}
                style={{ marginRight: 8 }}
                checked={selected}
                sx={{
                  "& .MuiSvgIcon-root": { fontSize: 20 },
                }}
              />
              <Typography fontSize={"20px"}>{option.className}</Typography>
            </li>
          )}
          style={{ width: 400 }}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Vui lòng chọn lớp để tạo thời khóa biểu!"
              variant="standard"
              sx={{
                label: {
                  fontSize: "20px",
                },
              }}
            />
          )}
        />
      </Grid>
      <Grid item xs={12}>
        <Button
          variant="contained"
          style={{ backgroundColor: "#79C9FF" }}
          onClick={handleCreateTimeTable}
        >
          <Typography variant="h4" style={{ color: "black" }}>
            Tạo thời khóa biểu mới
          </Typography>
        </Button>
      </Grid>
      <Grid item xs={12} container alignItems={"center"} direction="row">
        <Grid item xs={6} container direction="column">
          <Grid item>
            <Autocomplete
              id="checkboxes-tags-demo"
              options={classList}
              getOptionLabel={(option) => option.className}
              onChange={(event, value) => {
                setClassTimeTableId(value.classId);
                //console.log(classTimeTable);
              }}
              isOptionEqualToValue={(option, value) =>
                option.className === value
              }
              sx={{
                "& .MuiAutocomplete-input": {
                  fontSize: "20px",
                },
                ".MuiAutocomplete-tag": {
                  fontSize: "20px",
                },
              }}
              renderOption={(props, option, { selected }) => (
                <li {...props} sx={{ fontSize: "20px" }}>
                  <Typography fontSize={"20px"}>{option.className}</Typography>
                </li>
              )}
              style={{ width: 400 }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Vui lòng chọn lớp để xem thời khóa biểu!"
                  variant="standard"
                  sx={{
                    label: {
                      fontSize: "20px",
                    },
                  }}
                />
              )}
            />
          </Grid>
          <Grid item sx={{ mt: 2 }}>
            <Button
              variant="contained"
              style={{ backgroundColor: "#79C9FF" }}
              onClick={handleShowTimeTableOfClass}
            >
              <Typography variant="h4" style={{ color: "black" }}>
                Xem thời khóa biểu
              </Typography>
            </Button>
          </Grid>
        </Grid>
        <Grid item xs={6} container direction="column">
          <Grid item>
            <Autocomplete
              id="checkboxes-tags-demo"
              options={teacherList}
              getOptionLabel={(option) => option.teacherName}
              onChange={(event, value) => {
                setTeacherTimeTableId(value.teacherId);
                setTeacherTimeTableName(value.teacherName);
                //console.log(classTimeTable);
              }}
              isOptionEqualToValue={(option, value) =>
                option.teacherName === value
              }
              sx={{
                "& .MuiAutocomplete-input": {
                  fontSize: "20px",
                },
                ".MuiAutocomplete-tag": {
                  fontSize: "20px",
                },
              }}
              renderOption={(props, option, { selected }) => (
                <li {...props} sx={{ fontSize: "20px" }}>
                  <Typography fontSize={"20px"}>
                    {option.teacherName}
                  </Typography>
                </li>
              )}
              style={{ width: 500 }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Vui lòng chọn giáo viên để xem thời khóa biểu!"
                  variant="standard"
                  sx={{
                    label: {
                      fontSize: "20px",
                    },
                  }}
                />
              )}
            />
          </Grid>
          <Grid item sx={{ mt: 2 }}>
            <Button
              variant="contained"
              style={{ backgroundColor: "#79C9FF" }}
              onClick={handleShowTimeTableOfTeacher}
            >
              <Typography variant="h4" style={{ color: "black" }}>
                Xem thời khóa biểu
              </Typography>
            </Button>
          </Grid>
        </Grid>
      </Grid>
      <Grid item xs={12} sx={{ mt: 2 }}>
        <TableContainer component={Paper}>
          <Table
            sx={{
              minWidth: 650,
              "& .MuiTableCell-root": {
                border: "1px solid black",
              },
            }}
          >
            <TableHead>
              <TableRow>
                {columnNames.map((name, index) => (
                  <TableCell key={index}>
                    <Typography
                      variant="h4"
                      style={{ fontWeight: "bold" }}
                      textAlign={"center"}
                    >
                      {name}
                    </Typography>
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {lessonOrder.map((lesson) => (
                <TableRow>
                  <TableCell style={{ fontSize: "18px" }} align="center">
                    {lesson}
                  </TableCell>
                  {dayOrder.map((day) => (
                    <TableCell style={{ fontSize: "18px" }} align="center">
                      {timeTable[(day - 2) * 9 + lesson] &&
                        timeTable[(day - 2) * 9 + lesson].subjectName}
                      {" - "}
                      {timeTable[(day - 2) * 9 + lesson] &&
                        (isTeacher
                          ? timeTable[(day - 2) * 9 + lesson].className
                          : timeTable[(day - 2) * 9 + lesson].teacherName)}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Grid>
    </Grid>
  );
}
