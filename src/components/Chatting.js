import axios, { all } from "axios";
import { createRooms } from "../api/Chatting";
import React, { FormEvent, useEffect, useState } from "react";
import { Box, Button, Modal, Typography } from "@mui/material";
import { Form } from "react-router-dom";
import { useNavigate, useSearchParams } from "react-router-dom";
import { axiosUser } from "../api/User";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
// import io from "socket.io-client";
import { roomInfo } from "../api/Chatting";
// import { axiosUser } from "../api/User";
// const data = axiosUser();

function Chatting() {
  const navigate = useNavigate();
  const formData = new FormData();

  const token = window.localStorage.getItem("token");
  const [nickname, setNickname] = useState("비회원");
  const [newNickname, setNewNickname] = useState("");
  const [category, setCategory] = useState("");
  const [userId, setUserId] = useState("");
  const [tag, setTag] = useState("");
  const [roomNo, setRoomNo] = useState("");

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
      {token !== null ? (
        <div>
          현재 위도 : <span>{roomLatitude}</span>
          현재 경도 : <span>{roomLongitude}</span>
          <br />
          회원 닉네임 : <span>{nickname}</span>
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
            placeholder="해시태그 입력"
          />
          <br />
          <button
            onClick={(e) => createRoom(e, nickname, newNickname, tag, category)}
          >
            채팅방 만들기
          </button>
        </div>
      ) : (
        <div>채팅방 개설은 회원만 가능합니다.</div>
      )}
      <div>
        <Button onClick={goHome}>Home</Button>
      </div>
    </div>
  );
}

export default Chatting;
