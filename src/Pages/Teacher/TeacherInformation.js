import React from "react";
import { Grid, Typography, TextField, Paper, Button } from "@mui/material";
import { Table, TableBody, TableCell } from "@mui/material";
import { TableRow, TableHead, TableContainer } from "@mui/material";
import { NavLink } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  get,
  ref,
  orderByChild,
  equalTo,
  query,
  update,
} from "firebase/database";
import { db } from "../../Config/firebase.js";
import Notiflix from "notiflix";

export default function TeacherInformation() {
  const searchParams = new URLSearchParams(window.location.search);
  const teacherId = searchParams.get("teacherId");
  const [teacherInformation, setTeacherInformation] = useState([]);
  const [classes, setClasses] = useState([]);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [emailAddress, setEmailAddress] = useState("");

  useEffect(() => {
    const teacherRef = query(
      ref(db, "teacher"),
      orderByChild("teacherId"),
      equalTo(teacherId)
    );

    get(teacherRef)
      .then((snapshot) => {
        if (snapshot.exists()) {
          const teacherArray = Object.entries(snapshot.val()).map(
            ([id, data]) => ({
              id,
              ...data,
            })
          );
          setTeacherInformation(teacherArray[0]);
          setPhoneNumber(teacherArray[0].phoneNumber);
          setEmailAddress(teacherArray[0].emailAddress);
          setClasses(Object.values(teacherArray[0].classList));
        } else {
          console.log("No data available!");
        }
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);
  console.log(classes);
  // console.log(teacherInformation);

  const tableHeadName = [
    "Số thứ tự",
    "Tên lớp",
    "Môn học",
    "Số tiết trên tuần",
  ];
  const hanleSubmit = () => {
    update(ref(db, `teacher/${teacherId}`), {
      phoneNumber: phoneNumber,
      emailAddress: emailAddress,
    })
      .then(() => {
        Notiflix.Notify.success("Sửa thông tin thành công!");
      })
      .catch((err) => {
        Notiflix.Notify.failure(err.message);
        console.error(err);
      });
  };

  return (
    <Grid container spacing={2} padding={"50px"}>
      {/* <form onSubmit={hanleSubmit}> */}
      <Grid item xs={12}>
        <h1 style={{ fontSize: "40px" }}>Thông tin giáo viên</h1>
      </Grid>
      <Grid item container direction="row" alignItems="center" sx={{ mt: 2 }}>
        <Typography style={{ fontSize: "24px", marginRight: "81px" }}>
          Họ và tên
        </Typography>
        <TextField
          style={{ width: "500px" }}
          value={teacherInformation.teacherName}
          inputProps={{ style: { fontSize: "18px" } }}
        ></TextField>
      </Grid>
      <Grid item container direction="row" alignItems="center" sx={{ mt: 2 }}>
        <Typography style={{ fontSize: "24px", marginRight: "42px" }}>
          Số điện thoại
        </Typography>
        <TextField
          style={{ width: "500px" }}
          value={phoneNumber}
          inputProps={{ style: { fontSize: "18px" } }}
          onChange={(event) => setPhoneNumber(event.target.value)}
        ></TextField>
      </Grid>
      <Grid item container direction="row" alignItems="center" sx={{ mt: 2 }}>
        <Typography style={{ fontSize: "24px", marginRight: "44px" }}>
          Địa chỉ email
        </Typography>
        <TextField
          style={{ width: "500px" }}
          value={emailAddress}
          inputProps={{ style: { fontSize: "18px" } }}
          onChange={(event) => setEmailAddress(event.target.value)}
        ></TextField>
      </Grid>
      <Grid item container direction="row" alignItems="center" sx={{ mt: 2 }}>
        <Typography style={{ fontSize: "24px", marginRight: "24px" }}>
          Lớp chủ nhiệm
        </Typography>
        <TextField
          style={{ width: "500px" }}
          value={teacherInformation.homeroomClass}
          inputProps={{ style: { fontSize: "18px" } }}
          readOnly="true"
        ></TextField>
      </Grid>
      <Grid item xs={12} sx={{ mt: 2 }}>
        <Typography variant="h3">Danh sách lớp phụ trách </Typography>
      </Grid>
      <Grid item xs={12} sx={{ mt: 2 }}>
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }}>
            <TableHead>
              <TableRow>
                {tableHeadName.map((name, index) => (
                  <TableCell key={index}>
                    <Typography variant="h4" style={{ fontWeight: "bold" }}>
                      {name}
                    </Typography>
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {classes &&
                classes.map((classInfor, index) => (
                  <TableRow>
                    <TableCell style={{ fontSize: "18px" }}>
                      {index + 1}
                    </TableCell>
                    <TableCell style={{ fontSize: "18px" }}>
                      <TextField
                        inputProps={{
                          style: { fontSize: "18px" },
                        }}
                        readOnly="true"
                        value={classInfor.className}
                      ></TextField>
                    </TableCell>
                    <TableCell style={{ fontSize: "18px", width: "360px" }}>
                      <TextField
                        inputProps={{
                          style: { fontSize: "18px" },
                        }}
                        readOnly="true"
                        value={classInfor.subjectName}
                      ></TextField>
                    </TableCell>
                    <TableCell style={{ fontSize: "18px", width: "360px" }}>
                      <TextField
                        inputProps={{
                          style: { fontSize: "18px" },
                        }}
                        readOnly="true"
                        value={classInfor.lessonNumber}
                      ></TextField>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Grid>

      <Grid item>
        <Button
          variant="contained"
          style={{ backgroundColor: "#79C9FF", margin: "30px 0px" }}
          type="submit"
          onClick={hanleSubmit}
        >
          <Typography variant="h4" style={{ color: "black" }}>
            Sửa thông tin
          </Typography>
        </Button>
        <NavLink onClick={() => window.history.back()}>
          <Button
            variant="contained"
            style={{ backgroundColor: "#FA7070", marginLeft: "30px" }}
          >
            <Typography variant="h4" style={{ color: "black" }}>
              Quay lại
            </Typography>
          </Button>
        </NavLink>
      </Grid>
      {/* </form> */}
    </Grid>
  );
}
