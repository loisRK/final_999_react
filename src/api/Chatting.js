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
export async function roomList() {
  const response = await axios.get("http://localhost:8080/api/roomList");
  console.log(response.data);
  return response.data;
}

// 해당 채팅에 관한 정보 불러오기.
export const roomInfo = async (roomNo) => {
  const response = await axios.get(`http://localhost:8080/api/room/${roomNo}`);
  console.log(response.data);
  return response.data;
};

// 해당 유저 신고하기 (메세지를 클릭하여 신고)
// 신고 몇 번 당했는지 값 불러오기
export const report = async (formData) => {
  // axios.post("http://localhost:8080/api/report", formData);

  const response = await axios.post(
    "http://localhost:8080/api/report",
    formData
  );

  console.log("#### axiosReportNum : " + response);

  return response.data;
};

// 해당 room에 user ++
export const client_in = async (roomNo) => {
  axios.get(`http://localhost:8080/api/clientIn/${roomNo}`);
};

// 해당 room에 user --
export const client_out = async (roomNo) => {
  axios.get(`http://localhost:8080/api/clientOut/${roomNo}`);
};

// 금기어 생성하기
export const insert_taboo = async (formData) => {
  axios.post("http://localhost:8080/api/taboo", formData);
};

// 내 방 금기어 전부 가져오기 !
export const alltabooList = async (roomNo) => {
  const response = await axios.get(
    `http://localhost:8080/api/tabooList/${roomNo}`
  );
  console.log("금기어 리스트 : ", response.data);
  return response.data;
};

// 해당 금기어 delete !
export const deleteTaboo = async (tabooWord) => {
  console.log("금기어 삭제 : ", tabooWord);
  axios.get(`http://localhost:8080/api/deleteTaboo/${tabooWord}`);
};

// // 신고 몇 번 당했는지 값 불러오기
// export const axiosReportNum = async (roomNo, userId) => {
//   const response = await axios.get(
//     `http://localhost:8080/api/reportNum?roomNo=${roomNo}&reportedId=${userId}`
//   );

//   console.log("#### axiosReportNum : " + response);

//   return response.data;
// };
