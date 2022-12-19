import { async } from "@firebase/util";
import axios from "axios";

// firebase database에 접근하여 모든 message 정보 가져오기.
export const messageData = async () => {
  const response = await axios.get(
    "https://project-9b19f-default-rtdb.firebaseio.com/message.json"
  );
  return response.data;
};

// firebase database에 접근하여 새로운 message 정보 등록하기.
export const messageUpdate = async (messageContent) => {
  await axios.post(
    "https://project-9b19f-default-rtdb.firebaseio.com/message.json",
    messageContent
  );
};

// firebase 추방자 insert
export const dulgiKick = async (kickData) => {
  await axios.post(
    "https://project-9b19f-default-rtdb.firebaseio.com/kick.json",
    kickData
  );
};

// firebase 추방자 list 가져오기
export const kickList = async () => {
  const response = await axios.get(
    "https://project-9b19f-default-rtdb.firebaseio.com/kick.json"
  );
  return response.data;
};

// firebase client List insert
export const dulgiInsert = async (dulgiData) => {
  await axios.post(
    "https://project-9b19f-default-rtdb.firebaseio.com/dulgiList.json",
    dulgiData
  );
};

// firebase client List 가져오기
export const dulgiList = async () => {
  const response = await axios.get(
    "https://project-9b19f-default-rtdb.firebaseio.com/dulgiList.json"
  );
  return response.data;
};

// firebase Client list delete
export const deleteDulgi = async (data) => {
  console.log(data);
  await axios.delete(
    `https://project-9b19f-default-rtdb.firebaseio.com/dulgiList/${data}.json`
  );
};
