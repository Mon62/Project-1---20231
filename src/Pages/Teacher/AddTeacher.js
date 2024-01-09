import React, { useEffect } from "react";
import { Grid, Typography, TextField, Button } from "@mui/material";
import { NavLink } from "react-router-dom";
import { useState } from "react";
import { get, onChildChanged, ref, set } from "firebase/database";
import { db } from "../../Config/firebase.js";
import { uid } from "uid";
import Notiflix from "notiflix";

export default function AddTeacher() {
  const [teacherName, setTeacherName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [emailAddress, setEmailAddress] = useState("");
  const [teacherList, setTeacherList] = useState([]);
  let isValid = true;

  useEffect(() => {
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
        } else {
          console.log("No data available!");
        }
      })
      .catch((error) => {
        Notiflix.Notify.failure(error.message);
        console.error(error);
      });
  }, []);

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log(teacherList);
    teacherList.map((teacher) => {
      if (
        teacher.teacherName === teacherName &&
        teacher.phoneNumber === phoneNumber &&
        teacher.emailAddress === emailAddress
      ) {
        isValid = false;
      }
    });
    console.log(isValid);
    if (!isValid) {
      Notiflix.Notify.warning("Đã tồn tại giáo viên này!");
      isValid = true;
      return;
    }

    const uuid = uid();
    const newTeacher = {
      teacherName: teacherName,
      phoneNumber: phoneNumber,
      emailAddress: emailAddress,
      teacherId: uuid,
      id: teacherList.length,
    };
    console.log(newTeacher);
    set(ref(db, `teacher/${uuid}`), newTeacher)
      .then(() => {
        Notiflix.Notify.success("Thêm giáo viên mới thành công!");
        setTeacherList([...teacherList, newTeacher]);
      })
      .catch((error) => {
        Notiflix.Notify.failure(error);
      });
  };
  return (
    <Grid container spacing={2} padding={"50px"}>
      <Grid item xs={12}>
        <div style={{ fontSize: "40px" }}>Thông tin giáo viên</div>
      </Grid>
      <Grid item>
        <form onSubmit={handleSubmit}>
          <Grid item container direction="row" alignItems="center">
            <Typography style={{ fontSize: "24px", marginRight: "64px" }}>
              Họ và tên
              <span style={{ color: "red" }}> (*) </span>
            </Typography>
            <TextField
              style={{ width: "500px" }}
              onChange={(e) => {
                setTeacherName(e.target.value);
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
              Số điện thoại
              <span style={{ color: "red" }}> (*) </span>
            </Typography>
            <TextField
              style={{ width: "500px" }}
              onChange={(e) => {
                setPhoneNumber(e.target.value);
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
            <Typography style={{ fontSize: "24px", marginRight: "26px" }}>
              Địa chỉ email
              <span style={{ color: "red" }}> (*) </span>
            </Typography>
            <TextField
              style={{ width: "500px" }}
              onChange={(e) => {
                setEmailAddress(e.target.value);
              }}
              inputProps={{ style: { fontSize: "18px" }, required: true }}
            ></TextField>
          </Grid>

          <Grid item sx={{ mt: 2 }}>
            {/* <NavLink to="/addteacher"> */}
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
            {/* </NavLink> */}
            <NavLink to="/teacher">
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
