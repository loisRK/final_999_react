import axios, { all } from "axios";
import { createRooms } from "../api/Chatting";
import React, { FormEvent, useEffect, useState } from "react";
import { Box,
   Button,
   Modal,
   Typography,
   Table,
   TableBody,
   TableCell,
   TableContainer,
   TableHead,
   TableRow,
   Paper,
   AppBar,
   Toolbar,
   Tooltip,
   IconButton,
   Avatar,
   TextField
 } from "@mui/material";
import { Form } from "react-router-dom";
import { useNavigate, useSearchParams } from "react-router-dom";
import { axiosUser } from "../api/User";
import Autocomplete from "@mui/material/Autocomplete";
import gugu from "../img/bidulgi.png";
// import io from "socket.io-client";

function Chatting() {
  // useNavigate() : 양식이 제출되거나 특정 event가 발생할 때, url 조작
  const navigate = useNavigate();
  const formData = new FormData();

  const token = window.localStorage.getItem("token");
  const [nickname, setNickname] = useState("비회원");
  const [newNickname, setNewNickname] = useState("");
  const [category, setCategory] = useState("");
  const [userId, setUserId] = useState("");
  const [tag, setTag] = useState("");

  useEffect(() => {
    if (token !== null) {
      const data = axiosUser();
      data.then((res) => setNickname(res.kakaoNickname));
      data.then((res) => setUserId(res.kakaoId));
    }
  }, []);

  const getNewNickname = (e) => {
    // e.preventDafault();
    setNewNickname(e.target.value);
  };

  const getTag = (e) => {
    // e.preventDafault();
    setTag(e.target.value);
  };

  const goHome = (e) => {
    navigate("/");
  };
  const [search, setSearch] = useSearchParams();
  const roomLatitude = search.get("latitude");
  const roomLongitude = search.get("longitude");
  const createRoom = async (e, nickname, newNickname, tag, category) => {
    formData.append("userId", userId); // 카카오아이디
    formData.append("nickname", nickname); // 카카오닉네임
    formData.append("newNickname", newNickname); // 익명닉네임
    formData.append("tag", tag); // ex ) #배고프다 #맛집추천 #미사역
    formData.append("chatLat", roomLatitude);
    formData.append("chatLong", roomLongitude);
    formData.append("category", category); // 카테고리 (심심, 긴급, 질문, 추천)

    console.log(
      nickname +
        newNickname +
        tag +
        "위도: " +
        roomLatitude +
        "경도: " +
        roomLongitude
    );
    const data = createRooms(formData);
    data.then((res) => console.log(res));
    data.then((res) => {
      navigate(`/room?roomNo=${String(res)}`);
    });

    // await navigate(`/room/${room_no}`);
  };
  const options = ["심심 🎈", "질문 ❔", "추천 👍🏻", "긴급 🚨"];

  return (
    <div>
      {/* 고정 상단바 */}
      <Box sx={{ flexGrow: 1 }}>
        <AppBar position="static" sx={{ background: "#B6E2A1" }}>
          <Toolbar>
            <IconButton
              size="large"
              edge="start"
              color="inherit"
              aria-label="menu"
              sx={{ mr: 2 }}
            ></IconButton>
            {/* 비둘기 사진 누르면 홈으로 이동 */}
            <Box sx={{ flexGrow: 0 }}>
              <Tooltip title="Home">
                <IconButton
                  onClick={() => {
                    document.location.href = "/";
                  }}
                  sx={{ p: 0 }}
                >
                <Avatar alt="gugu" src={gugu} />
              </IconButton>
            </Tooltip>
            </Box>
            {/* 페이지 중앙에 제목 */}
            <Typography
              variant="h6"
              component="div"
              sx={{ flexGrow: 1 }}
              style={{ color: "#4d5749" }}
            >
            채팅방 개설
           </Typography>
          </Toolbar>
        </AppBar>
      </Box>
      <br/>
      {token !== null ? (
        <>
          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell align="right">카테고리</TableCell>
                  <TableCell align="center">
                  <Autocomplete
                    align="center"
                    category={category}
                    onInputChange={(event, newInputValue) => {
                      setCategory(newInputValue);
                    }}
                    id="controllable-states-demo"
                    options={options}
                    sx={{ width: 300 }}
                    renderInput={(params) => <TextField {...params} label="Category" />}
                  />
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  <TableCell component="th" scope="row" align="right">
                    닉네임 입력
                  </TableCell>
                  <TableCell align="left">
                  <TextField
                    name="newNickname"
                    onChange={getNewNickname}
                    value={newNickname}
                    placeholder="익명 닉네임"
                    multiline
                    variant="standard"
                    style={{ width: "70%" }}
                    align="center"
                  />
                  </TableCell>
                </TableRow>
                <TableRow
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  <TableCell component="th" scope="row" align="right">
                    방 제목 입력
                  </TableCell>
                  <TableCell align="left">
                  <TextField
                    name="tag"
                    onChange={getTag}
                    value={tag}
                    placeholder="방 제목 입력"
                    multiline
                    variant="standard"
                    style={{ width: "70%" }}
                    align="center"
                  />
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
          {/* 현재 위도 : <span>{roomLatitude}</span>
          현재 경도 : <span>{roomLongitude}</span>
          <br /> */}
          {/* 회원 닉네임 : <span>{nickname}</span>
          <br />
          카테고리 :{" "}
          <Autocomplete
            category={category}
            onInputChange={(event, newInputValue) => {
              setCategory(newInputValue);
            }}
            id="controllable-states-demo"
            options={options}
            sx={{ width: 300 }}
            renderInput={(params) => <TextField {...params} label="Category" />}
          />
          <br />
          익명 닉네임 :{" "}
          <input
            name="newNickname"
            onChange={getNewNickname}
            value={newNickname}
            placeholder="익명 닉네임"
          />
          <br />
          채팅방 제목 :{" "}
          <input
            name="tag"
            onChange={getTag}
            value={tag}
            placeholder="방 제목 입력"
          /> */}
          <br />
          <Button
            onClick={(e) => createRoom(e, nickname, newNickname, tag, category)}
            variant="contained"
            color="success"
          >
            채팅방 만들기
          </Button>
        </>
      ) : (
        <div>채팅방 개설은 회원만 가능합니다.</div>
      )}
      <div>
        <Button onClick={goHome} color="success">Home</Button>
      </div>
    </div>
  );
}

export default Chatting;
