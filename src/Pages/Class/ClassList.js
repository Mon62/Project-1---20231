import React, { useEffect, useState } from "react";
import {
  Grid,
  Button,
  Typography,
} from "@mui/material";
import { TextField } from "@mui/material";
import { Table, TableBody, TableCell } from "@mui/material";
import {
  TableRow,
  TableHead,
  TableContainer,
  TableFooter,
  TablePagination,
} from "@mui/material";
import { Paper } from "@mui/material";
import { NavLink } from "react-router-dom";
import PlusCircle from "../../Icons/PlusCircle.png";
import { toast } from "react-toastify";
import { get, ref } from "firebase/database";
import { db } from "../../Config/firebase.js"

export default function ClassList() {
  const pathname = window.location.pathname;
  const nextPagePathName =
    pathname.substr(0, pathname.indexOf("/")) +
    "/classinformation/?classId=";
  const tableHeadName = [
    { name: "Số thứ tự" },
    { name: "Tên lớp" },
    { name: "Giáo viên chủ nhiệm" },
    { name: "Sĩ số" },
    { name: "Ghi chú" },
  ];

  const [className, setClassName] = useState("");
  const [homeroomTeacherName, setHomeroomTeacherName] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [classList, setClassList] = useState([]);
  const [fullClassList, setFullClassList] = useState([]);

  useEffect(() => {
    const classRef = ref(db, "class");
    get(classRef)
      .then((snapshot) => {
        if (snapshot.exists()) {
          const classArray = Object.entries(snapshot.val()).map(([id, data]) => ({
            id,
            ...data,
          }));
          setClassList(classArray);
          setFullClassList(classArray);
        } else {
          console.log("No data available!");
        }
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);
  //console.log(classList);

  const handleSearchName = () => {
    setPage(0);
    let newClassList = fullClassList;
    console.log(className);
    console.log(homeroomTeacherName);

    if (homeroomTeacherName !== "")
      newClassList = newClassList.filter((classInfor) =>
        classInfor.homeroomTeacherName.includes(homeroomTeacherName));
    if (className !== "")
      newClassList = newClassList.filter((classInfor) =>
        classInfor.className.includes(className));

    setClassList(newClassList);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };



  return (
    <Grid container spacing={2} style={{ padding: "50px" }}>
      <Grid item xs={12}>
        <div style={{ fontSize: "48px" }}> Danh sách lớp học </div>
      </Grid>
      <Grid item xs={6} style={{}}>
        <NavLink to="/addclass">
          <Button variant="contained" style={{ backgroundColor: "#79C9FF" }}>
            <Typography style={{ marginRight: "8px" }}>
              <img
                src={PlusCircle}
                style={{ width: "26px", height: "26px" }}
                alt=""
              />
            </Typography>
            <Typography variant="h4" style={{ color: "black" }}>
              Thêm lớp học
            </Typography>
          </Button>
        </NavLink>
      </Grid>
      <Grid item container direction={"row"} xs={12} alignItems={"center"}>
        <TextField
          label={"Tên lớp học"}
          variant="filled"
          style={{ marginRight: "35px" }}
          inputProps={{ style: { fontSize: "18px" } }}
          InputLabelProps={{ style: { fontSize: "20px" } }}
          onChange={(event) => setClassName(event.target.value)}
        />
        <TextField
          label={"Giáo viên chủ nhiệm"}
          variant="filled"
          style={{ marginRight: "35px" }}
          inputProps={{ style: { fontSize: "18px" } }}
          InputLabelProps={{ style: { fontSize: "20px" } }}
          onChange={(event) => setHomeroomTeacherName(event.target.value)}
        />
        <Button
          variant="contained"
          style={{ backgroundColor: "#79C9FF", margin: "30px 0px" }}
          onClick={handleSearchName}
        >
          <Typography variant="h4" style={{ color: "black" }}>
            Tìm kiếm lớp học
          </Typography>
        </Button>
      </Grid>
      <Grid item xs={12}>
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }}>
            <TableHead>
              <TableRow>
                {tableHeadName.map((column, index) => (
                  <TableCell key={index}>
                    <Typography variant="h4" style={{ fontWeight: "bold" }} textAlign={"center"}>
                      {column.name}
                    </Typography>
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {classList &&
                (rowsPerPage > 0
                  ? classList.slice(
                    page * rowsPerPage,
                    page * rowsPerPage + rowsPerPage
                  )
                  : classList
                ).map((classInfor, index) => (
                  <TableRow>
                    <TableCell style={{ fontSize: "18px" }} align="center">
                      {page * rowsPerPage + index + 1}
                    </TableCell>
                    <TableCell style={{ fontSize: "18px" }} align="center">
                      {classInfor.className}
                    </TableCell>
                    <TableCell style={{ fontSize: "18px" }} align="center">
                      {classInfor.homeroomTeacherName}
                    </TableCell>
                    <TableCell style={{ fontSize: "18px" }} align="center">
                      {classInfor.studentNumber}
                    </TableCell>
                    <TableCell align="center">
                      <a href={`${nextPagePathName}${classInfor.classId}`}>
                        <Typography style={{ fontSize: "18px" }}>
                          Chi Tiết
                        </Typography>
                      </a>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
            <TableFooter>
              <tr>
                <TablePagination
                  rowsPerPageOptions={[5, 8, 10, { label: "All", value: -1 }]}
                  colSpan={6}
                  count={classList.length}
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
            </TableFooter>
          </Table>
        </TableContainer>
      </Grid>
    </Grid>
  );
}
