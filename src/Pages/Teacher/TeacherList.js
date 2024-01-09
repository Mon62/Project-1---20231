import React from "react";
import { Grid, Button, Typography } from "@mui/material";
import { TextField } from "@mui/material";
import { Table, TableBody, TableCell } from "@mui/material";
import { TableRow, TableHead, TableContainer } from "@mui/material";
import { TablePagination } from "@mui/material";
import { Paper } from "@mui/material";
import { NavLink } from "react-router-dom";
import PlusCircle from "../../Icons/PlusCircle.png";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { get, ref, orderByChild, equalTo, query } from "firebase/database";
import { db } from "../../Config/firebase.js";
import Notiflix from "notiflix";

export default function TeacherList() {
  const pathname = window.location.pathname;
  const nextPagePathname =
    pathname.substr(0, pathname.indexOf("/")) +
    "/teacherinformation/?teacherId=";

  const tableHeadName = [
    { name: "Số thứ tự" },
    { name: "Họ và tên" },
    { name: "Số điện thoại" },
    { name: "Địa chỉ email" },
    { name: "Lớp chủ nhiệm" },
    { name: "Ghi chú" },
  ];
  const [teacherName, setTeacherName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [homeroomClass, setHomeroomClass] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [teacherList, setTeacherList] = useState([]);
  const [fullTeacherList, setFullTeacherList] = useState([]);

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
          setFullTeacherList(teacherArray);
        } else {
          console.log("No data available!");
        }
      })
      .catch((error) => {
        Notiflix.Notify.error(error);
        console.error(error);
      });
  }, []);
  // console.log(teacherList);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };
  const handleSearch = () => {
    setPage(0);
    let newTeacherList = fullTeacherList;
    console.log(newTeacherList);
    console.log(fullTeacherList);
    if (teacherName !== "")
      newTeacherList = newTeacherList.filter((teacher) =>
        teacher.teacherName.includes(teacherName)
      );
    if (phoneNumber !== "")
      newTeacherList = newTeacherList.filter((teacher) =>
        teacher.phoneNumber.includes(phoneNumber)
      );
    if (homeroomClass !== "")
      newTeacherList = newTeacherList.filter(
        (teacher) =>
          teacher.homeroomClass && teacher.homeroomClass.includes(homeroomClass)
      );
    console.log(newTeacherList);
    console.log(fullTeacherList);
    setTeacherList(newTeacherList);
  };

  return (
    <Grid container spacing={2} style={{ padding: "50px" }}>
      <Grid item xs={12}>
        <div style={{ fontSize: "48px" }}> Danh sách giáo viên </div>
      </Grid>
      <Grid item xs={6}>
        <NavLink to="/addteacher">
          <Button variant="contained" style={{ backgroundColor: "#79C9FF" }}>
            <Typography style={{ marginRight: "8px" }}>
              <img
                src={PlusCircle}
                style={{ width: "26px", height: "26px" }}
                alt=""
              />
            </Typography>
            <Typography variant="h4" style={{ color: "black" }}>
              Thêm giáo viên
            </Typography>
          </Button>
        </NavLink>
      </Grid>
      <Grid item xs={12} container direction={"row"} alignItems={"center"}>
        <TextField
          label="Họ và tên"
          variant="filled"
          style={{ marginRight: "35px" }}
          inputProps={{ style: { fontSize: "18px" } }}
          InputLabelProps={{ style: { fontSize: "20px" } }}
          onChange={(e) => setTeacherName(e.target.value)}
        />
        <TextField
          label="Số điện thoại"
          variant="filled"
          style={{ marginRight: "35px" }}
          inputProps={{ style: { fontSize: "18px" } }}
          InputLabelProps={{ style: { fontSize: "20px" } }}
          onChange={(e) => setPhoneNumber(e.target.value)}
        />
        <TextField
          label="Lớp chủ nhiệm"
          variant="filled"
          style={{ marginRight: "35px" }}
          inputProps={{ style: { fontSize: "18px" } }}
          InputLabelProps={{ style: { fontSize: "20px" } }}
          onChange={(e) => setHomeroomClass(e.target.value)}
        />
        <Button
          variant="contained"
          style={{ backgroundColor: "#79C9FF", margin: "30px 0px" }}
          onClick={() => handleSearch()}
        >
          <Typography variant="h4" style={{ color: "black" }}>
            Tìm kiếm giáo viên
          </Typography>
        </Button>
      </Grid>

      <Grid item xs={12}>
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }}>
            <thead>
              <TableRow>
                {tableHeadName.map((column, index) => (
                  <TableCell key={index} style={{ backgroundColor: "#e5e5e5" }}>
                    <Typography
                      variant="h4"
                      style={{ fontWeight: "bold" }}
                      textAlign={"center"}
                    >
                      {column.name}
                    </Typography>
                  </TableCell>
                ))}
              </TableRow>
            </thead>
            <tbody>
              {teacherList &&
                (rowsPerPage > 0
                  ? teacherList.slice(
                      page * rowsPerPage,
                      page * rowsPerPage + rowsPerPage
                    )
                  : teacherList
                ).map(
                  (teacher, index) =>
                    teacher && (
                      <TableRow>
                        <TableCell style={{ fontSize: "18px" }}>
                          {page * rowsPerPage + index + 1}
                        </TableCell>
                        <TableCell style={{ fontSize: "18px" }}>
                          {teacher.teacherName}
                        </TableCell>
                        <TableCell style={{ fontSize: "18px" }}>
                          {teacher.phoneNumber}
                        </TableCell>
                        <TableCell style={{ fontSize: "18px" }}>
                          {teacher.emailAddress}
                        </TableCell>
                        <TableCell style={{ fontSize: "18px" }}>
                          {teacher.homeroomClass}
                        </TableCell>
                        <TableCell style={{ fontSize: "18px" }}>
                          <a
                            href={`${nextPagePathname}${teacher.teacherId}`}
                            style={{ textDecoration: "underline" }}
                          >
                            <Typography variant="h4" textAlign={"center"}>
                              Chi tiết
                            </Typography>
                          </a>
                        </TableCell>
                      </TableRow>
                    )
                )}
            </tbody>
            <tfoot>
              <tr>
                <TablePagination
                  rowsPerPageOptions={[5, 8, 10, { label: "All", value: -1 }]}
                  colSpan={6}
                  count={teacherList.length}
                  rowsPerPage={rowsPerPage}
                  page={page}
                  slotProps={{
                    select: {
                      "aria-label": "rows per page",
                    },
                    actions: {
                      showFirstButton: true,
                      showLastButton: true,
                    },
                  }}
                  onPageChange={handleChangePage}
                  onRowsPerPageChange={handleChangeRowsPerPage}
                  sx={{
                    "& .MuiTablePagination-input": {
                      fontSize: "16px",
                    },
                    "& .MuiTablePagination-displayedRows": {
                      fontSize: "16px",
                    },
                    "& .MuiTablePagination-selectLabel": {
                      fontSize: "16px",
                    },
                  }}
                />
              </tr>
            </tfoot>
          </Table>
        </TableContainer>
      </Grid>
    </Grid>
  );
}
