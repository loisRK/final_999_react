import axios from "axios";
import React, { FormEvent } from "react";
import { Form } from "react-router-dom";

// insert Chatting Rooms - post
// 룸 넘버를 생성함과 동시에 자동으로 생성된 roomNo 추출
export const createRooms = async (formData) => {
  const response = await axios.post("http://localhost:8080/api/room", formData);
  // console.log("nickname:" + formData.nickname);
  // console.log("newNickname:" + formData.newNickname);
  // console.log("tag:" + formData.tag);
  console.log("createRooms axios 실행");
  console.log(response.data);
  return response.data;
};

// DB 내에 존재하는 모든 채팅방 리스트 불러오기
export const roomList = async () => {
  const response = await axios.get("http://localhost:8080/api/roomList");
  // console.log(response.data);
  return response.data;
};

// 해당 채팅에 관한 정보 불러오기.
export const roomInfo = async (roomNo) => {
  console.log("-------rsfsaf", roomNo);
  const response = await axios.get(`http://localhost:8080/api/room/${roomNo}`);
  return response.data;
};

// 해당 room에 user ++
export const client_in = async (roomNo) => {
  axios.get("");
};

// 해당 room에 user --
export const client_out = async (roomNo) => {
  axios.get("");
};
