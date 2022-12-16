import axios from "axios";
import React, { FormEvent } from "react";
import { Form } from "react-router-dom";

// post 작성하기 - create
export const createPost = async (formData) => {
  const token = window.localStorage.getItem("token");
  console.log(token);
  axios
    .post("http://localhost:8080/api/post", formData, {
      headers: {
        "Contest-Type": "multipart/form-data",
        Authorization: token,
      },
    })
    .then((res) => console.log("postNo : " + res.data))
    .then((document.location.href = "/posting"));
};

// Post 전체 데이터 불러오기 - GET
export const postAllData = async (
  posts,
  setWasLastList,
  setPrevPage,
  setPosts,
  currentPage
) => {
  const response = await axios.get(
    `http://localhost:8080/api/postPage?page=${currentPage}&size=10`
  );
  console.log("Diary.js : " + response.data.dtoList);
  // 데이터가 없으면 마지막 페이지였다는걸 표시
  if (!response.data.dtoList.length) {
    setWasLastList(true);
    return;
  }
  setPrevPage(currentPage);
  setPosts([...posts, ...response.data.dtoList]);
};

// Post 한개 객체 불러오기 - GET
export const postData = async (postNo) => {
  const response = await axios.get(`http://localhost:8080/api/post/${postNo}`);
  return response.data;
};

// post 수정하기 - PUT
export const postUpdate = async (postNo, formData) => {
  console.log("수정하기!!!!" + formData);
  console.log(postNo);

  await axios
    .put(`http://localhost:8080/api/updatePost/${postNo}`, formData, {
      headers: {
        "Contest-Type": "multipart/form-data",
      },
    })
    .then((document.location.href = `/posting`));
};

// post 삭제하기 - delete
export const axiosDeletePost = async (postNo) => {
  const response = await axios
    .delete(`http://localhost:8080/api/postDelete?postNo=${postNo}`)
    .then((document.location.href = `/posting`));
  return response.data;
};

// 모든 post 불러오기(깃털꽂기) - GET
export const axiosGetAllPosts = async () => {
  const response = await axios.get(`http://localhost:8080/api/postList`);

  return response.data;
};
// Like 정보 보내기 - POST
export const axiosLike = async (formData) => {
  const response = await axios.post(
    `http://localhost:8080/api/addLikeCnt`,
    // `http://localhost:8080/api/addLike`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );
  console.log("like 개수 : " + response.data);
  return response.data;
};

// 해당 user의 포스팅 like 정보 가져오기 - GET
export const axiosGetLike = async (postNo, userId) => {
  const response = await axios.get(
    `http://localhost:8080/api/getLike?postNo=${postNo}&userId=${userId}`
  );
  return response.data;
};

// 전체 포스트랑 like 정보 다 가져오는거 도전!!!!
export const axiosAllPostAndLike = async (
  posts,
  setWasLastList,
  setPrevPage,
  setPosts,
  currentPage,
  userId
) => {
  const response = await axios.get(
    `http://localhost:8080/api/postPage?page=${currentPage}&size=10&userId=${userId}`
  );
  console.log("Diary.js : " + response.data.dtoList);
  // 데이터가 없으면 마지막 페이지였다는걸 표시
  if (!response.data.dtoList.length) {
    setWasLastList(true);
    return;
  }
  setPrevPage(currentPage);
  setPosts([...posts, ...response.data.dtoList]);
};

// 특정 유저의 post 불러오기(깃털꽂기) - GET
export const axioUserPosts = async (userId) => {
  const response = await axios.get(
    `http://localhost:8080/api/userPosts/${userId}`
  );

  return response.data;
};

// Post랑 like 정보 전체 데이터 불러오기 - GET
export const axiosPostLike = async (
  posts,
  setWasLastList,
  setPrevPage,
  setPosts,
  currentPage,
  loginId,
  searchId,
  setEnd
) => {
  
  console.log(currentPage)
  console.log("searchId : " + searchId);
  const response = await axios.get(
    `http://localhost:8080/api/postLikePage?page=${currentPage}&size=10&loginId=${loginId}&searchId=${searchId}`
  );

  console.log("## inside axiosPostLike : " + response.data.dtoList);
  console.log("## inside axiosPostLike : " + response.data.page);
  // 데이터가 없으면 마지막 페이지였다는걸 표시
  if (!response.data.dtoList.length) {
    console.log("마지막 페이지 입니다.");
    setWasLastList(true);
    return;
  }
  setEnd(response.data.end);
  setPrevPage(currentPage);
  // setPrevPage(response.data.page);
  let result = [];
  if(searchId === 0 || currentPage !== 1) {
    console.log("1페이지가 아닐때 : " + currentPage)
    result = [...posts, ...response.data.dtoList];
  } else {
    console.log("검색했을 때 " + currentPage);
    result = [...response.data.dtoList];
  }

  setPosts(result);
};

// insert Diary - post
export const createDiary = async (formData) => {
  axios
    .post("http://localhost:8080/api/insert", formData, {
      headers: {
        "Contest-Type": "multipart/form-data",
      },
    })
    .then((res) => console.log("diaryNo : " + res.data))
    .then((document.location.href = "/posting"));
};

// Diary 전체 데이터 불러오기 - GET
export const axiosData = async (
  posts,
  setWasLastList,
  setPrevPage,
  setPosts,
  currentPage
) => {
  const response = await axios.get(
    `http://localhost:8080/api/diaryPage?page=${currentPage}&size=10`
  );
  // 데이터가 없으면 마지막 페이지였다는걸 표시
  if (!response.data.dtoList.length) {
    setWasLastList(true);
    return;
  }
  setPrevPage(currentPage);
  setPosts([...posts, ...response.data.dtoList]);
};
