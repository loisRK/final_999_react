import axios from "axios";
import React, { FormEvent } from "react";
import { Form } from "react-router-dom";

// Post 한개 객체 불러오기 - GET
export const postData = async (postNo) => {
  const response = await axios.get(`http://localhost:8080/api/post/${postNo}`);
  return response.data;
};

// Post update - PUT
export const postUpdate = async (postNo, formData) => {
  console.log("수정하기!!!!" + formData);
  console.log(postNo);

  await axios.put(`http://localhost:8080/api/updatePost/${postNo}`, formData, {
    headers: {
      "Contest-Type": "multipart/form-data",
    },
  });
  // .then(
  //   (document.location.href = `/posting`)
  // );
};

// delete Diary - delete
export const axiosDeletePost = async (postNo) => {
  const response = await axios
    .delete(`http://localhost:8080/api/postDelete?postNo=${postNo}`)
    .then((document.location.href = `/posting`));
  return response.data;
};

// Like 정보 보내기 - POST
export const axiosLike = async (formData) => {
  await axios.post(`http://localhost:8080/api/addLike`, formData, {
    headers: {
      "Contest-Type": "multipart/form-data",
    },
  });
};
