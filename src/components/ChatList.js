import React from "react";
import { useState, useEffect } from "react";
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
import {roomList} from "../api/Chatting";
import { useNavigate } from "react-router-dom";

// 임시로만든 db내 채팅 리스트 data 가져오기
const chatList = chat;
// [{db안에 있는 data}, 거리] -> 가까운 순으로 정렬
const distanceList=[];
// 거리를 기준으로 정렬된 db data
const chatInfo=[];

function getDistanceFromLatLonInKm(lat1, lng1, lat2, lng2) {
  function deg2rad(deg) {
    return deg * (Math.PI / 180);
  }

  var R = 6371; // Radius of the earth in km
  var dLat = deg2rad(lat2 - lat1); // deg2rad below
  var dLon = deg2rad(lng2 - lng1);
  var a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) *
      Math.cos(deg2rad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  var d = R * c; // Distance in km
  return d;
}

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
  const [latitude, setLatitude] = useState(0);
  const [longitude, setLongitude] = useState(0);

  // navigator.geolocation 으로 Geolocation API 에 접근(사용자의 브라우저가 위치 정보 접근 권한 요청)
  // geolocation으로 현재 위치 가져오는 함수 (Geolocation.getCurrentPosition(success, error, [options]))
  const currentPosition = () => {
    // console.log("navigator.geolocation : " + navigator.geolocation);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        function (position) {
          setLatitude(position.coords.latitude);
          setLongitude(position.coords.longitude);
          // console.log(
            //   `latitude : ${position.coords.latitude} longitude : ${position.coords.longitude}`
            // );
          },
          function (error) {
            console.error(error);
          }
          );
        } else {
          console.log("GPS를 지원하지 않습니다.");
        }
      };



  useEffect(() => {
    console.log(latitude);
    // 페이지 로드 시 현재 위치 지정
    currentPosition();
    {
      // 현재위치를 기준으로 거리 계산
      chatList.map((li, i) => (
        console.log("chatList", chatList),
        // 거리계산
        console.log(`${i}`, getDistanceFromLatLonInKm(latitude, longitude, chatList[i].latitude, chatList[i].longitude)),
        distanceList[i] = [chatList[i] , getDistanceFromLatLonInKm(latitude, longitude, chatList[i].latitude, chatList[i].longitude)],
        console.log(getDistanceFromLatLonInKm(latitude, longitude, chatList[0].latitude, chatList[0].longitude))
        
        ))}
      
        // distanceList를 거리순으로 정렬
        distanceList.sort(compareSecondColumn);

        function compareSecondColumn(a, b) {
            if (a[1] === b[1]) {
                return 0;
            }
            else {
                return (a[1] < b[1]) ? -1 : 1;
            }
        }
        
        // distanceList에서 data만 가져옴
        distanceList.map((dli,i) => (
          chatInfo[i] = distanceList[i][0]
        ))

      },[]);



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
    <>
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
            <StyledTableCell align="center">title</StyledTableCell>
            <StyledTableCell align="center">peoples</StyledTableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {chatInfo
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
              count={chatInfo.length}
              page={page}
              rowsPerPage={rowsPerPage}
              onChangePage={handleChangePage}
              onChangeRowsPerPage={handleChangeRowsPerPage}
            />
          </TableRow>
        </TableFooter>
      </Table>
    </TableContainer>
    </>
  );
}

export default ChatList;
