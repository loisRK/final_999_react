import axios from "axios";
import React, { FormEvent } from "react";
import { Form } from "react-router-dom";

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
// export const axiosData = async (currentPage) => {
//   const response = await axios.get(
//     `http://localhost:8080/api/diaryPage?page=${currentPage}&size=10`
//   );
//   return response.data;
// };

// Diary 한개 객체 불러오기 - GET
export const diaryData = async (diaryNo) => {
  const response = await axios.get(
    `http://localhost:8080/api/diary/${diaryNo}`
  );
  return response.data;
};

// Diary update - PUT
export const diaryUpdate = async (diaryNo, formData, currentPage) => {
  console.log("fordata : " + formData);
  console.log(diaryNo);

  await axios
    .put(`http://localhost:8080/api/updateDiary/${diaryNo}`, formData, {
      headers: {
        "Contest-Type": "multipart/form-data",
      },
    })
    .then(
      (document.location.href = `/diaryFile?diaryNo=${diaryNo}&currentPage=${currentPage}`)
    );
};

// delete Diary - delete
export const diaryDelete = async (diaryNo, currentPage) => {
  const response = await axios
    .delete(`http://localhost:8080/api/page/delete?diaryNo=${diaryNo}`)
    .then((document.location.href = `/posting/${currentPage}`));
  return response.data;
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
    .then((document.location.href = "/posting/1"));
};
