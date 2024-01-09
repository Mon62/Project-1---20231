import React, { useEffect } from "react";
import { Grid, Typography, TextField, Paper, Button } from "@mui/material";
import { Table, TableBody, TableCell, Box } from "@mui/material";
import { TableRow, TableHead, TableContainer } from "@mui/material";
import { NavLink } from "react-router-dom";
import { useState } from "react";
import { Autocomplete } from "@mui/material";
import {
  get,
  ref,
  orderByChild,
  equalTo,
  query,
  update,
  set,
} from "firebase/database";
import { db } from "../../Config/firebase.js";
import Notiflix from "notiflix";

export default function ClassInformation() {
  const searchParams = new URLSearchParams(window.location.search);
  const classId = searchParams.get("classId");
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
  const [oldHomeroomTeacherId, setOldHomeroomTeacherId] = useState("");
  const [studentNumber, setStudentNumber] = useState(0);
  const [oldSubjectList, setOldSubjectList] = useState([]);
  const [newSubjectList, setNewSubjectList] = useState([]);
  const [teacherList, setTeacherList] = useState([]);
  const [fullSubjectList, setFullSubjectList] = useState([]);
  const subjectCompactList = [];
  const teacherCompactList = [];
  const [homeroomTeacherList, setHomeroomTeacherList] = useState([]);
  let isValid = true;

  useEffect(() => {
    const classRef = query(
      ref(db, "class"),
      orderByChild("classId"),
      equalTo(classId)
    );

    get(classRef)
      .then((snapshot) => {
        if (snapshot.exists()) {
          const classArray = Object.entries(snapshot.val()).map(
            ([id, data]) => ({
              id,
              ...data,
            })
          );
          //   console.log(classArray);
          setClassName(classArray[0].className);
          setStudentNumber(classArray[0].studentNumber);
          setHomeroomTeacherName(classArray[0].homeroomTeacherName);
          setHomeroomTeacherId(classArray[0].homeroomTeacherId);
          setOldHomeroomTeacherId(classArray[0].homeroomTeacherId);
          setOldSubjectList(Object.values(classArray[0].subjectList));
          setNewSubjectList(Object.values(classArray[0].subjectList));
        } else {
          console.log("No data available!");
        }
      })
      .catch((error) => {
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
          teacherArray.map((teacher) => {
            if (teacher.homeroomClass !== undefined) {
              homeroomTeacherList.push(teacher.teacherId);
            }
          });
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
  //   console.log(newSubjectList);

  if (teacherCompactList.length === 0) {
    teacherList.map((teacher) => {
      teacherCompactList.push({
        label: teacher.teacherName,
        teacherId: teacher.teacherId,
        phoneNumber: teacher.phoneNumber,
      });
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
  // console.log(teacherCompactList);
  // console.log(homeroomTeacherList);
  // console.log(subjectCompactList);
  const handleAddSubject = () => {
    setNewSubjectList([
      ...newSubjectList,
      {
        subjectName: "",
        subjectId: "",
        teacherName: "",
        teacherId: "",
        lessonNumber: "",
      },
    ]);
  };
  const handleDeleteSubject = (id) => {
    const updateSubjectList = newSubjectList.filter((_, index) => index !== id);
    setNewSubjectList(updateSubjectList);
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
    let updateSubjectList = [...newSubjectList];

    updateSubjectList[index] = {
      subjectName: value === null ? "" : value.label,
      subjectId: value === null ? "" : value.subjectId,
      teacherName: newSubjectList[index].teacherName,
      teacherId: newSubjectList[index].teacherId,
      lessonNumber: newSubjectList[index].lessonNumber,
    };

    setNewSubjectList(updateSubjectList);
  };
  const handleChangeTeacherName = (index) => (event, value) => {
    let updateSubjectList = [...newSubjectList];

    updateSubjectList[index] = {
      subjectName: newSubjectList[index].subjectName,
      subjectId: newSubjectList[index].subjectId,
      teacherName: value === null ? "" : value.label,
      teacherId: value === null ? "" : value.teacherId,
      lessonNumber: newSubjectList[index].lessonNumber,
    };

    setNewSubjectList(updateSubjectList);
  };
  const handleChangeLessonNumber = (index) => (event) => {
    let updateSubjectList = [...newSubjectList];
    let newLessonNumber = event.target.value;
    updateSubjectList[index] = {
      subjectName: newSubjectList[index].subjectName,
      subjectId: newSubjectList[index].subjectId,
      teacherName: newSubjectList[index].teacherName,
      teacherId: newSubjectList[index].teacherId,
      lessonNumber: newLessonNumber,
    };

    setNewSubjectList(updateSubjectList);
  };
  const handleSubmit = (event) => {
    event.preventDefault();
    homeroomTeacherList.map((id) => {
      if (
        id === homeroomTeacherId &&
        oldHomeroomTeacherId !== homeroomTeacherId
      ) {
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
    if (newSubjectList.length === 0) {
      Notiflix.Notify.warning("Vui lòng thêm môn học!");
      return;
    }

    newSubjectList.map((subject1, index1) => {
      newSubjectList.map((subject2, index2) => {
        if (subject1.subjectId === subject2.subjectId && index1 !== index2)
          isValid = false;
      });
    });
    if (!isValid) {
      Notiflix.Notify.warning("Tồn tại trùng lặp trong danh sách môn học!");
      isValid = true;
      return;
    }

    // console.log(oldSubjectList);
    oldSubjectList.map((subject) => {
      set(ref(db, `subject/${subject.subjectId}/classList/${classId}`), null)
        .then(() => {})
        .catch((err) => {
          Notiflix.Notify.failure(err.message);
          console.log(err);
        });
      set(ref(db, `teacher/${subject.teacherId}/classList/${classId}`), null)
        .then(() => {})
        .catch((err) => {
          Notiflix.Notify.failure(err.message);
          console.log(err);
        });
    });

    newSubjectList.map((subject) => {
      set(ref(db, `class/${classId}/subjectList/${subject.subjectId}`), {
        subjectId: subject.subjectId,
        subjectName: subject.subjectName,
        teacherId: subject.teacherId,
        teacherName: subject.teacherName,
        lessonNumber: subject.lessonNumber,
      }).catch((err) => {
        Notiflix.Notify.failure(err.message);
        console.log(err);
      });

      set(ref(db, `subject/${subject.subjectId}/classList/${classId}`), {
        className: className,
        classId: classId,
        teacherName: subject.teacherName,
        teacherId: subject.teacherId,
        lessonNumber: subject.lessonNumber,
      })
        .then(() => {})
        .catch((err) => {
          Notiflix.Notify.failure(err.message);
          console.log(err);
        });

      set(ref(db, `teacher/${subject.teacherId}/classList/${classId}`), {
        className: className,
        classId: classId,
        subjectName: subject.subjectName,
        subjectId: subject.subjectId,
        lessonNumber: subject.lessonNumber,
      })
        .then(() => {})
        .catch((err) => {
          Notiflix.Notify.failure(err.message);
          console.log(err);
        });
    });
    update(ref(db, `class/${classId}`), {
      homeroomTeacherId: homeroomTeacherId,
      homeroomTeacherName: homeroomTeacherName,
      studentNumber: studentNumber,
    })
      .then(() => {
        Notiflix.Notify.success("Sửa thông tin lớp học thành công!");
      })
      .catch((err) => {
        Notiflix.Notify.failure(err.message);
        console.log(err);
      });

    console.log(oldHomeroomTeacherId);
    set(ref(db, `teacher/${oldHomeroomTeacherId}/homeroomClass`), null).catch(
      (err) => {
        Notiflix.Notify.failure(err.message);
        console.log(err);
      }
    );
    setOldHomeroomTeacherId(homeroomTeacherId);

    set(ref(db, `teacher/${homeroomTeacherId}/homeroomClass`), className).catch(
      (err) => {
        Notiflix.Notify.failure(err.message);
        console.log(err);
      }
    );

    console.log(homeroomTeacherList);
    let newHomeroomTeacherList = homeroomTeacherList;
    homeroomTeacherList.map((id, index) => {
      if (id === oldHomeroomTeacherId) {
        newHomeroomTeacherList[index] = homeroomTeacherId;
      }
    });
    setHomeroomTeacherList(newHomeroomTeacherList);
    console.log(homeroomTeacherList);
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
            </Typography>
            <TextField
              style={{ width: "500px" }}
              value={className}
              inputProps={{ style: { fontSize: "18px" } }}
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
            </Typography>
            <TextField
              style={{ width: "500px" }}
              onChange={(e) => {
                setStudentNumber(e.target.value);
              }}
              value={studentNumber}
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
                  {newSubjectList &&
                    newSubjectList.map((subject, index) => (
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
                        <TableCell style={{ fontSize: "18px" }} align="center">
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
              Sửa thông tin
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
