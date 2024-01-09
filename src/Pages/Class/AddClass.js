import React, { useEffect } from "react";
import { Grid, Typography, TextField, Paper, Button } from "@mui/material";
import { Table, TableBody, TableCell, Box } from "@mui/material";
import { TableRow, TableHead, TableContainer } from "@mui/material";
import { NavLink } from "react-router-dom";
import { useState } from "react";
import { Autocomplete } from "@mui/material";
import { get, ref, set, update } from "firebase/database";
import { db } from "../../Config/firebase.js";
import { uid } from "uid";
import Notiflix from "notiflix";

export default function AddClass() {
  const columnNames = [
    "Số thứ tự",
    "Môn học",
    "Giáo viên phụ trách",
    "Số tiết trên tuần",
    "",
  ];
  const [className, setClassName] = useState("");
  const [homeroomTeacherName, setHomeroomTeacherName] = useState("");
  const [homeroomTeacherId, setHomeroomTeacherId] = useState("");
  const [studentNumber, setStudentNumber] = useState(0);
  const [subjectList, setSubjectList] = useState([]);
  const [fullSubjectList, setFullSubjectList] = useState([]);
  const subjectCompactList = [];
  const [classList, setClassList] = useState([]);
  const [teacherList, setTeacherList] = useState([]);
  const teacherCompactList = [];
  const [homeroomTeacherList, setHomeroomTeacherList] = useState([]);
  let isValid = true;

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
          setClassList(classArray);
        } else {
          console.log("No data available!");
        }
      })
      .catch((error) => {
        Notiflix.Notify.error(error);
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
          //   setFullTeacherList(teacherArray);
        } else {
          console.log("No data available!");
        }
      })
      .catch((error) => {
        Notiflix.Notify.error(error);
        console.error(error);
      });
    const subjectRef = ref(db, "subject");
    get(subjectRef)
      .then((snapshot) => {
        if (snapshot.exists()) {
          const subjectArray = Object.entries(snapshot.val()).map(
            ([id, data]) => ({
              id,
              ...data,
            })
          );
          setFullSubjectList(subjectArray);
        } else {
          console.log("No data available!");
        }
      })
      .catch((error) => {
        Notiflix.Notify.error(error);
        console.error(error);
      });
  }, []);

  if (teacherCompactList.length === 0) {
    teacherList.map((teacher) => {
      teacherCompactList.push({
        label: teacher.teacherName,
        teacherId: teacher.teacherId,
        phoneNumber: teacher.phoneNumber,
        id: teacher.id,
      });
      if (teacher.homeroomClass !== undefined) {
        homeroomTeacherList.push(teacher.teacherId);
      }
    });
  }
  if (subjectCompactList.length === 0) {
    fullSubjectList.map((subject) => {
      subjectCompactList.push({
        label: subject.subjectName,
        subjectId: subject.subjectId,
      });
    });
  }
  const handleAddSubject = () => {
    setSubjectList([
      ...subjectList,
      {
        subjectName: "",
        subjectId: "",
        teacherName: "",
        teacherId: "",
        lessonNumber: "",
        id: "",
        className: "",
      },
    ]);
  };
  const handleDeleteSubject = (id) => {
    const updateSubjectList = subjectList.filter((_, index) => index !== id);
    setSubjectList(updateSubjectList);
  };

  const handleChangeHomeroomTeacher = (event, value) => {
    if (value !== null) {
      setHomeroomTeacherName(value.label);
      setHomeroomTeacherId(value.teacherId);
    } else {
      setHomeroomTeacherName("");
      setHomeroomTeacherId("");
    }
  };
  const handleChangeSubjectName = (index) => (event, value) => {
    let newSubjectList = [...subjectList];

    newSubjectList[index] = {
      subjectName: value === null ? "" : value.label,
      subjectId: value === null ? "" : value.subjectId,
      teacherName: subjectList[index].teacherName,
      teacherId: subjectList[index].teacherId,
      lessonNumber: subjectList[index].lessonNumber,
      id: subjectList[index].id,
    };

    setSubjectList(newSubjectList);
  };
  const handleChangeTeacherName = (index) => (event, value) => {
    let newSubjectList = [...subjectList];

    newSubjectList[index] = {
      subjectName: subjectList[index].subjectName,
      subjectId: subjectList[index].subjectId,
      teacherName: value === null ? "" : value.label,
      teacherId: value === null ? "" : value.teacherId,
      id: value === null ? "" : value.id,
      lessonNumber: subjectList[index].lessonNumber,
    };

    setSubjectList(newSubjectList);
  };
  const handleChangeLessonNumber = (index) => (event) => {
    let newSubjectList = [...subjectList];
    let newLessonNumber = event.target.value;
    newSubjectList[index] = {
      subjectName: subjectList[index].subjectName,
      subjectId: subjectList[index].subjectId,
      teacherName: subjectList[index].teacherName,
      teacherId: subjectList[index].teacherId,
      lessonNumber: newLessonNumber,
      id: subjectList[index].id,
    };

    setSubjectList(newSubjectList);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    classList.map((classInfor) => {
      if (classInfor.className === className) isValid = false;
    });
    if (!isValid) {
      Notiflix.Notify.warning("Đã tồn tại lớp " + className);
      isValid = true;
      return;
    }

    homeroomTeacherList.map((id) => {
      if (id === homeroomTeacherId) {
        isValid = false;
      }
    });
    if (!isValid) {
      Notiflix.Notify.warning(
        "Giáo viên " + homeroomTeacherName + " đã chủ nhiệm lớp khác!"
      );
      isValid = true;
      return;
    }
    if (subjectList.length === 0) {
      Notiflix.Notify.warning("Vui lòng thêm môn học!");
      return;
    }

    subjectList.map((subject1, index1) => {
      subjectList.map((subject2, index2) => {
        if (subject1.subjectId === subject2.subjectId && index1 !== index2)
          isValid = false;
      });
    });
    if (!isValid) {
      Notiflix.Notify.warning("Tồn tại trùng lặp trong danh sách môn học!");
      isValid = true;
      return;
    }

    const uuid = uid();
    const newClass = {
      className: className,
      homeroomTeacherName: homeroomTeacherName,
      homeroomTeacherId: homeroomTeacherId,
      studentNumber: studentNumber,
      classId: uuid,
      // subjectList: subjectList,
    };

    //  console.log(newClass);
    subjectList.map((subject) => (subject.className = className));
    set(ref(db, `class/${uuid}`), newClass)
      .then(() => {
        Notiflix.Notify.success("Thêm lớp học mới thành công!");
        setClassList([...classList, newClass]);
        setHomeroomTeacherList([...homeroomTeacherList, homeroomTeacherId]);
        update(ref(db, `teacher/${homeroomTeacherId}`), {
          homeroomClass: className,
        })
          .then(() => {})
          .catch((err) => {
            Notiflix.Notify.failure(err.message);
            console.error(err);
          });

        subjectList.map((subjectAddtionalInfor) => {
          set(
            ref(
              db,
              `class/${uuid}/subjectList/${subjectAddtionalInfor.subjectId}`
            ),
            subjectAddtionalInfor
          )
            .then(() => {})
            .catch((err) => {
              Notiflix.Notify.failure(err.message);
              console.log(err);
            });

          let newClassList = {
            className: className,
            classId: uuid,
            teacherName: subjectAddtionalInfor.teacherName,
            teacherId: subjectAddtionalInfor.teacherId,
            lessonNumber: subjectAddtionalInfor.lessonNumber,
          };
          set(
            ref(
              db,
              `subject/${subjectAddtionalInfor.subjectId}/classList/${uuid}`
            ),
            newClassList
          )
            .then(() => {})
            .catch((err) => {
              Notiflix.Notify.failure(err.message);
              console.error(err);
            });

          newClassList = {
            className: className,
            classId: uuid,
            subjectName: subjectAddtionalInfor.subjectName,
            subjectId: subjectAddtionalInfor.subjectId,
            lessonNumber: subjectAddtionalInfor.lessonNumber,
          };
          set(
            ref(
              db,
              `teacher/${subjectAddtionalInfor.teacherId}/classList/${uuid}`
            ),
            newClassList
          )
            .then(() => {})
            .catch((err) => {
              Notiflix.Notify.failure(err.message);
              console.error(err);
            });
        });
      })
      .catch((error) => {
        Notiflix.Notify.failure(error.message);
        console.log(error);
      });
  };

  return (
    <Grid container spacing={2} padding={"50px"}>
      <Grid item xs={12}>
        <div style={{ fontSize: "40px" }}>Thông tin lớp học</div>
      </Grid>
      <Grid item>
        <form onSubmit={handleSubmit}>
          <Grid item container direction="row" alignItems="center">
            <Typography style={{ fontSize: "24px", marginRight: "118px" }}>
              Tên lớp học
              <span style={{ color: "red" }}> (*) </span>
            </Typography>
            <TextField
              style={{ width: "500px" }}
              onChange={(e) => {
                setClassName(e.target.value);
              }}
              inputProps={{ style: { fontSize: "18px" }, required: true }}
            ></TextField>
          </Grid>
          <Grid
            item
            container
            direction="row"
            alignItems="center"
            sx={{ mt: 2 }}
          >
            <Typography style={{ fontSize: "24px", marginRight: "25px" }}>
              Giáo viên chủ nhiệm
              <span style={{ color: "red" }}> (*) </span>
            </Typography>
            <Autocomplete
              disablePortal
              autoHighlight
              options={teacherCompactList}
              onChange={handleChangeHomeroomTeacher}
              value={homeroomTeacherName}
              sx={{
                "& .MuiAutocomplete-input": {
                  fontSize: 20,
                },
                width: 500,
              }}
              isOptionEqualToValue={(option, value) => option.label === value}
              renderOption={(props, option) => (
                <Box component="li" {...props}>
                  {option.label} (SĐT: {option.phoneNumber})
                </Box>
              )}
              renderInput={(params) => (
                <TextField {...params} label="" required={true} />
              )}
            />
          </Grid>
          <Grid
            item
            container
            direction="row"
            alignItems="center"
            sx={{ mt: 2 }}
          >
            <Typography style={{ fontSize: "24px", marginRight: "150px" }}>
              Sĩ số lớp
              <span style={{ color: "red" }}> (*) </span>
            </Typography>
            <TextField
              style={{ width: "500px" }}
              onChange={(e) => {
                setStudentNumber(e.target.value);
              }}
              type="number"
              inputProps={{ style: { fontSize: "18px" }, required: true }}
            ></TextField>
          </Grid>

          <Grid item xs={12} sx={{ mt: 2 }}>
            <Typography variant="h3">Danh sách môn học</Typography>
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
                  {subjectList &&
                    subjectList.map((subject, index) => (
                      <TableRow>
                        <TableCell style={{ fontSize: "18px" }} align="center">
                          {index + 1}
                        </TableCell>
                        <TableCell style={{ fontSize: "18px" }} align="center">
                          <Autocomplete
                            disablePortal
                            autoHighlight
                            options={subjectCompactList}
                            onChange={handleChangeSubjectName(index)}
                            value={subject.subjectName}
                            sx={{
                              "& .MuiAutocomplete-input": {
                                fontSize: 20,
                              },
                              width: 200,
                            }}
                            isOptionEqualToValue={(option, value) =>
                              option.label === value
                            }
                            renderOption={(props, option) => (
                              <Box component="li" {...props}>
                                {option.label}
                              </Box>
                            )}
                            renderInput={(params) => (
                              <TextField {...params} label="" required={true} />
                            )}
                          />
                        </TableCell>
                        <TableCell
                          style={{ fontSize: "18px", width: "360px" }}
                          align="center"
                        >
                          <Autocomplete
                            disablePortal
                            autoHighlight
                            options={teacherCompactList}
                            onChange={handleChangeTeacherName(index)}
                            value={subject.teacherName}
                            sx={{
                              "& .MuiAutocomplete-input": {
                                fontSize: 20,
                              },
                              width: 300,
                            }}
                            isOptionEqualToValue={(option, value) =>
                              option.label === value
                            }
                            renderOption={(props, option) => (
                              <Box component="li" {...props}>
                                {option.label}
                              </Box>
                            )}
                            renderInput={(params) => (
                              <TextField {...params} label="" required={true} />
                            )}
                          />
                        </TableCell>
                        <TableCell align="center">
                          <TextField
                            inputProps={{
                              style: { fontSize: "18px" },
                              required: true,
                            }}
                            value={subject.lessonNumber}
                            onChange={handleChangeLessonNumber(index)}
                            type="number"
                          ></TextField>
                        </TableCell>
                        <TableCell align="center">
                          <button
                            onClick={() => handleDeleteSubject(index)}
                            style={{ fontSize: "18px", color: "red" }}
                            type="button"
                          >
                            Xóa
                          </button>
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>
          <Grid item xs={12} sx={{ mt: 2 }}>
            <Typography>
              <button
                onClick={() => handleAddSubject()}
                style={{ fontSize: "18px", color: "red" }}
                type="button"
              >
                Thêm
              </button>
            </Typography>
          </Grid>
          <Grid item sx={{ mt: 2 }}>
            <Button
              variant="contained"
              style={{
                backgroundColor: "#79C9FF",
                margin: "30px 0px",
                fontSize: "20px",
                color: "black",
                fontWeight: "400",
              }}
              type="submit"
              size="large"
            >
              Xác nhận
            </Button>
            <NavLink to="/class">
              <Button
                variant="contained"
                style={{
                  backgroundColor: "#FA7070",
                  marginLeft: "30px",
                  fontSize: "20px",
                  color: "black",
                  fontWeight: "400",
                }}
                size="large"
              >
                Hủy
              </Button>
            </NavLink>
          </Grid>
        </form>
      </Grid>
    </Grid>
  );
}
