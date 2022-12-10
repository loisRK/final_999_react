import React from "react";
import { useState } from "react";
import { styled } from "@mui/material/styles";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { TableFooter, TablePagination } from "@material-ui/core";
import chat from "../db/room_mock.json";

// 임시로만든 db내 채팅 리스트 data 가져오기
const chatList = chat;

// 테이블 속성 (columns)
const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.success.light,
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

// 테이블 속성 ( row )
const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: theme.palette.action.hover,
  },
  // hide last border
  "&:last-child td, &:last-child th": {
    border: 0,
  },
}));

function ChatList() {
  // 첫 페이지 0번
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 5));
    setPage(0);
  };
  return (
    <TableContainer component={Paper}>
      <br />
      <Table
        sx={{ width: 1 / 1, height: 1 / 2 }}
        aria-label="customized table"
        stickyHeader
      >
        <TableHead>
          <TableRow>
            <StyledTableCell align="center">category</StyledTableCell>
            <StyledTableCell align="center">tag</StyledTableCell>
            <StyledTableCell align="center">peoples</StyledTableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {chatList
            .slice(page * rowsPerPage, (page + 1) * rowsPerPage)
            .map((c, idx) => (
              <StyledTableRow key={idx}>
                <StyledTableCell align="center">{c.category}</StyledTableCell>
                <StyledTableCell align="center">{c.tag}</StyledTableCell>
                <StyledTableCell align="center">
                  {`${c.user_cnt} 人`}{" "}
                </StyledTableCell>
              </StyledTableRow>
            ))}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TablePagination
              count={chatList.length}
              page={page}
              rowsPerPage={rowsPerPage}
              onChangePage={handleChangePage}
              onChangeRowsPerPage={handleChangeRowsPerPage}
            />
          </TableRow>
        </TableFooter>
      </Table>
    </TableContainer>
  );
}

export default ChatList;
