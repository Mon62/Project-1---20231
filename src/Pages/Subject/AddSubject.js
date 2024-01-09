import React from "react";
import { Grid, TextField, Typography } from "@mui/material";
import { useState, useEffect } from "react";
import { Button } from "@mui/material";
import { NavLink } from "react-router-dom";
import { get, ref, set } from "firebase/database";
import { db } from "../../Config/firebase.js";
import { uid } from "uid";
import Notiflix from "notiflix";

export default function AddSubject() {
  const [subjectName, setSubjectName] = useState("");
  const [subjectList, setSubjectList] = useState([]);
  let isValid = true;

  useEffect(() => {
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
          setSubjectList(subjectArray);
        } else {
          console.log("No data available!");
        }
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  const handleSubmit = (event) => {
    event.preventDefault();
    subjectList.map((subject) => {
      if (subject.subjectName === subjectName) isValid = false;
    });

    if (!isValid) {
      Notiflix.Notify.warning("Đã tồn tại môn " + subjectName);
      isValid = true;
      return;
    }
    const uuid = uid();
    // console.log(uuid);
    const newSubject = {
      subjectName: subjectName,
      subjectId: uuid,
    };
    set(ref(db, `subject/${uuid}`), newSubject)
      .then(() => {
        Notiflix.Notify.success("Thêm môn học thành công!");
        setSubjectList([...subjectList, newSubject]);
      })
      .catch((err) => {
        Notiflix.Notify.failure(err.message);
        console.log(err);
      });
  };

  return (
    <Grid container spacing={2} padding={"50px"}>
      <Grid item xs={12}>
        <div style={{ fontSize: "40px" }}>Thêm môn học </div>
      </Grid>
      <Grid item>
        <form onSubmit={handleSubmit}>
          <Grid container direction={"row"} alignItems={"center"} item xs={12}>
            <Typography style={{ fontSize: "24px", marginRight: "25px" }}>
              Tên môn học
              <span style={{ color: "red" }}> (*) </span>
            </Typography>
            <TextField
              style={{ width: "500px" }}
              inputProps={{ style: { fontSize: "18px" }, required: true }}
              onChange={(e) => setSubjectName(e.target.value)}
            ></TextField>
          </Grid>

          <Grid item>
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
            <NavLink to="/subject">
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
