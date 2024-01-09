import React, { useEffect } from "react";
import { Grid, Typography, TextField, Paper, Button } from "@mui/material";
import { Table, TableBody, TableCell, Box } from "@mui/material";
import { TableRow, TableHead, TableContainer } from "@mui/material";
import { NavLink } from "react-router-dom";
import { useState } from "react";
import { toast } from "react-toastify";
import { Autocomplete } from "@mui/material";
import { get, ref, orderByChild, equalTo, query } from "firebase/database";
import { db } from "../../Config/firebase.js";

export default function SubjectInformation() {
  const searchParams = new URLSearchParams(window.location.search);
  const subjectId = searchParams.get("subjectId");
  const columnNames = [
    "Số thứ tự",
    "Lớp học",
    "Giáo viên phụ trách",
    "Số tiết trên tuần",
  ];
  const [classList, setClassList] = useState([]);
  const [subjectName, setSubjectName] = useState("");

  useEffect(() => {
    const subjectRef = query(
      ref(db, "subject"),
      orderByChild("subjectId"),
      equalTo(subjectId)
    );
    get(subjectRef)
      .then((snapshot) => {
        if (snapshot.exists()) {
          const classArray = Object.entries(snapshot.val()).map(
            ([id, data]) => ({
              id,
              ...data,
            })
          );
          setSubjectName(classArray[0].subjectName);
          setClassList(Object.values(classArray[0].classList));
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
  };

  return (
    <Grid container spacing={2} padding={"50px"}>
      <Grid item xs={12}>
        <div style={{ fontSize: "40px" }}>Thông tin môn {subjectName}</div>
      </Grid>
      <Grid item>
        <Grid item xs={12} sx={{ mt: 2 }}>
          <Typography variant="h3">Danh sách lớp học</Typography>
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
                {classList &&
                  classList.map((classInfor, index) => (
                    <TableRow>
                      <TableCell style={{ fontSize: "18px" }} align="center">
                        {index + 1}
                      </TableCell>
                      <TableCell style={{ fontSize: "18px" }} align="center">
                        {classInfor.className}
                      </TableCell>
                      <TableCell
                        style={{ fontSize: "18px", width: "360px" }}
                        align="center"
                      >
                        {classInfor.teacherName}
                      </TableCell>
                      <TableCell align="center" style={{ fontSize: "18px" }}>
                        {classInfor.lessonNumber}
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>
        <Grid item sx={{ mt: 2 }}>
          <NavLink to="/subject">
            <Button
              variant="contained"
              style={{
                backgroundColor: "#79C9FF",
                margin: "30px 0px",
                fontSize: "20px",
                color: "black",
                fontWeight: "400",
              }}
              size="large"
            >
              Xác nhận
            </Button>
          </NavLink>
        </Grid>
      </Grid>
    </Grid>
  );
}
